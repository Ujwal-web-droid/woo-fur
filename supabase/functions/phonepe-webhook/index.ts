import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PhonePeCallback {
  response: string;
}

const verifyChecksum = async (base64Response: string, receivedChecksum: string, saltKey: string, saltIndex: string): Promise<boolean> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(base64Response + "/pg/v1/status" + saltKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  const expectedChecksum = hashHex + "###" + saltIndex;
  return expectedChecksum === receivedChecksum;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const saltKey = Deno.env.get("PHONEPE_SALT_KEY");
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") || "1";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!saltKey) {
      throw new Error("PhonePe salt key not configured");
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Parse the callback
    const body = await req.text();
    let callbackData: any;
    
    try {
      callbackData = JSON.parse(body);
    } catch {
      // Handle URL-encoded form data
      const params = new URLSearchParams(body);
      callbackData = { response: params.get("response") };
    }

    if (!callbackData.response) {
      throw new Error("No response data in callback");
    }

    // Decode the base64 response
    const decodedResponse = JSON.parse(atob(callbackData.response));
    console.log("PhonePe callback received:", decodedResponse);

    const { merchantTransactionId, code, data } = decodedResponse;
    const paymentStatus = code === "PAYMENT_SUCCESS" ? "completed" : "failed";

    // Update donation status
    const { error: updateError } = await supabase
      .from("donations")
      .update({
        status: paymentStatus,
      })
      .eq("transaction_id", merchantTransactionId);

    if (updateError) {
      console.error("Failed to update donation:", updateError);
    }

    // If payment successful and it's a donation, you might want to send confirmation email
    if (paymentStatus === "completed") {
      // Fetch donation details
      const { data: donation } = await supabase
        .from("donations")
        .select("*")
        .eq("transaction_id", merchantTransactionId)
        .single();

      if (donation) {
        // Trigger email notification
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              type: "donation_receipt",
              to: donation.donor_email,
              data: {
                name: donation.donor_name,
                amount: donation.amount,
                transactionId: merchantTransactionId,
              },
            }),
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, status: paymentStatus }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("PhonePe webhook error:", error);
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
