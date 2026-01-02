import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID");
    const saltKey = Deno.env.get("PHONEPE_SALT_KEY");
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") || "1";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!merchantId || !saltKey) {
      throw new Error("PhonePe credentials not configured");
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { amount, merchantTransactionId, merchantUserId, callbackUrl, paymentType, metadata }: PhonePePaymentRequest = await req.json();

    // Convert amount to paise (PhonePe uses paise)
    const amountInPaise = Math.round(amount * 100);

    const payloadData = {
      merchantId,
      merchantTransactionId,
      merchantUserId,
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
