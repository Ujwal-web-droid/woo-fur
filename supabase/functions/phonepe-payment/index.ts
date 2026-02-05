import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PhonePePaymentRequest {
  amount: number;
  merchantTransactionId: string;
  merchantUserId: string;
  callbackUrl: string;
  paymentType: "donation" | "booking";
  metadata?: {
    donationId?: string;
    bookingId?: string;
    allocation?: object;
    recurring?: boolean;
  };
}

const generateChecksum = async (payload: string, saltKey: string, saltIndex: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload + "/pg/v1/pay" + saltKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex + "###" + saltIndex;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration missing");
    }

    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Token validation failed:", claimsError);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID");
    const saltKey = Deno.env.get("PHONEPE_SALT_KEY");
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") || "1";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!merchantId || !saltKey) {
      throw new Error("PhonePe credentials not configured");
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { amount, merchantTransactionId, merchantUserId, callbackUrl, paymentType, metadata }: PhonePePaymentRequest = await req.json();

    // Validate request data
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid amount" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!merchantTransactionId || !callbackUrl || !paymentType) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Convert amount to paise (PhonePe uses paise)
    const amountInPaise = Math.round(amount * 100);

    const payloadData = {
      merchantId,
      merchantTransactionId,
      merchantUserId: merchantUserId || userId,
      amount: amountInPaise,
      redirectUrl: callbackUrl,
      redirectMode: "POST",
      callbackUrl: `${supabaseUrl}/functions/v1/phonepe-webhook`,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const base64Payload = btoa(JSON.stringify(payloadData));
    const checksum = await generateChecksum(base64Payload, saltKey, saltIndex);

    // PhonePe UAT endpoint for testing, change to production when ready
    const phonePeEndpoint = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const response = await fetch(phonePeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const result = await response.json();

    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      // Store pending transaction in database
      if (paymentType === "donation" && metadata?.donationId) {
        await supabase
          .from("donations")
          .update({
            transaction_id: merchantTransactionId,
            payment_method: "phonepe",
            status: "pending"
          })
          .eq("id", metadata.donationId);
      }

      console.log("Payment initiated successfully for user:", userId);
      return new Response(
        JSON.stringify({
          success: true,
          paymentUrl: result.data.instrumentResponse.redirectInfo.url,
          transactionId: merchantTransactionId
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      throw new Error(result.message || "Failed to initiate payment");
    }
  } catch (error: any) {
    console.error("PhonePe payment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
