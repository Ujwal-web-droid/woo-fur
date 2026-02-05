import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EmailRequest {
  type: "booking_confirmation" | "donation_receipt" | "volunteer_welcome" | "contact_form" | "booking_reminder";
  to: string;
  data: Record<string, any>;
}

const templates = {
  booking_confirmation: (data: any) => ({
    subject: "Your Woo-Fur Booking is Confirmed! 🐾",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #87A96B 0%, #6B8E23 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #87A96B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed! 🐾</h1>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>Great news! Your ${data.serviceType} session at Woo-Fur has been confirmed.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span><strong>Date:</strong></span>
                  <span>${data.date}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Time:</strong></span>
                  <span>${data.time}</span>
                </div>
                ${data.animalName ? `
                <div class="detail-row">
                  <span><strong>Animal Companion:</strong></span>
                  <span>${data.animalName}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span><strong>Duration:</strong></span>
                  <span>${data.duration || '60 minutes'}</span>
                </div>
              </div>

              <h3>What to Bring:</h3>
              <ul>
                <li>Comfortable clothing</li>
                <li>A positive attitude!</li>
                ${data.serviceType === 'part-time-pet' ? '<li>Pet carrier (if needed)</li>' : ''}
              </ul>

              <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
              
              <a href="${data.confirmationUrl || '#'}" class="button">View Booking Details</a>
            </div>
            <div class="footer">
              <p>Woo-Fur Animal Sanctuary</p>
              <p>123 Healing Paws Lane, Greenfield, CA 95000</p>
              <p>(555) 123-4567 | hello@woo-fur.org</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  donation_receipt: (data: any) => ({
    subject: "Thank You for Your Generous Donation! 💚",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4A574 0%, #C4956A 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
            .amount { font-size: 36px; font-weight: bold; color: #87A96B; text-align: center; margin: 20px 0; }
            .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #ddd; }
            .impact { background: #87A96B; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You! 💚</h1>
            </div>
            <div class="content">
              <p>Dear ${data.name || 'Generous Donor'},</p>
              <p>Your kindness is changing lives. Thank you for your generous donation to Woo-Fur Animal Sanctuary.</p>
              
              <div class="amount">$${data.amount}</div>
              
              <div class="receipt">
                <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Allocation:</strong> ${data.allocation || 'General Fund'}</p>
                ${data.recurring ? '<p><strong>Type:</strong> Recurring Monthly</p>' : ''}
              </div>

              <div class="impact">
                <h3 style="margin-top: 0;">Your Impact</h3>
                <p>Your donation helps us provide medical care, nutritious food, and loving shelter to animals in need. Every dollar makes a difference!</p>
              </div>

              <p>This email serves as your tax-deductible receipt. Woo-Fur is a registered 501(c)(3) nonprofit organization (EIN: XX-XXXXXXX).</p>
            </div>
            <div class="footer">
              <p>Woo-Fur Animal Sanctuary</p>
              <p>123 Healing Paws Lane, Greenfield, CA 95000</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  volunteer_welcome: (data: any) => ({
    subject: "Welcome to the Woo-Fur Volunteer Family! 🌟",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #87A96B 0%, #6B8E23 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
            .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .step { padding: 10px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #87A96B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to the Team! 🌟</h1>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>We're thrilled to have you join our volunteer family at Woo-Fur! Your application has been received and is under review.</p>
              
              <div class="next-steps">
                <h3>What's Next?</h3>
                <div class="step">
                  <strong>1. Background Check</strong>
                  <p>We'll process your background check within 3-5 business days.</p>
                </div>
                <div class="step">
                  <strong>2. Orientation</strong>
                  <p>Once approved, you'll be invited to our next volunteer orientation session.</p>
                </div>
                <div class="step">
                  <strong>3. Start Making a Difference</strong>
                  <p>After orientation, you can start signing up for volunteer shifts!</p>
                </div>
              </div>

              <p>Questions? Feel free to reach out to our volunteer coordinator.</p>
            </div>
            <div class="footer">
              <p>Woo-Fur Animal Sanctuary</p>
              <p>123 Healing Paws Lane, Greenfield, CA 95000</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  booking_reminder: (data: any) => ({
    subject: `Reminder: Your Woo-Fur Session is ${data.timeUntil}! 🐾`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #87A96B 0%, #6B8E23 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
            .reminder-box { background: #FFF3CD; border: 1px solid #FFEEBA; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>See You Soon! 🐾</h1>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              
              <div class="reminder-box">
                <p><strong>Your ${data.serviceType} session is ${data.timeUntil}!</strong></p>
                <p>📅 ${data.date} at ${data.time}</p>
                ${data.animalName ? `<p>🐕 With: ${data.animalName}</p>` : ''}
              </div>

              <p>We're looking forward to seeing you!</p>

              <p><strong>Location:</strong><br>
              123 Healing Paws Lane<br>
              Greenfield, CA 95000</p>
            </div>
            <div class="footer">
              <p>Need to reschedule? Contact us at (555) 123-4567</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  contact_form: (data: any) => ({
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Reason:</strong> ${data.reason}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  }),
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
    console.log("Authenticated user sending email:", userId);

    const { type, to, data }: EmailRequest = await req.json();

    // Validate email type
    const validTypes = ["booking_confirmation", "donation_receipt", "volunteer_welcome", "contact_form", "booking_reminder"];
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate recipient email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to || !emailRegex.test(to)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid recipient email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const template = templates[type];
    if (!template) {
      throw new Error(`Unknown email template: ${type}`);
    }

    const { subject, html } = template(data);

    // For contact form, send to admin email
    const recipient = type === "contact_form" ? "hello@woo-fur.org" : to;

    const emailResponse = await resend.emails.send({
      from: "Woo-Fur <notifications@woo-fur.org>",
      to: [recipient],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
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
