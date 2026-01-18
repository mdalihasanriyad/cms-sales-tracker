import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordChangeRequest {
  email: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userName }: PasswordChangeRequest = await req.json();

    if (!email) {
      console.error("Missing email in request");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending password change notification to: ${email}`);

    const displayName = userName || "User";
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const emailResponse = await resend.emails.send({
        from: "CMS Sales <no-reply@cms.ahriyad.top>", // ✅ verified domain
        replyTo: "ahriyadinfo@gmail.com",              // ✅ reply goes to gmail
        to: [email],                                  // ✅ user email
        cc: ["ahriyadinfo@gmail.com"],                 // ✅ admin copy
        subject: "Your password has been changed",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">CMS Sales</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Security Notification</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #18181b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Password Changed Successfully</h2>
              
              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hello ${displayName},
              </p>
              
              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Your password for your CMS Sales account has been successfully changed.
              </p>
              
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #71717a; font-size: 14px; margin: 0;">
                  <strong style="color: #52525b;">Date & Time:</strong> ${currentDate}
                </p>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                  ⚠️ If you did not make this change, please contact our support team immediately and secure your account.
                </p>
              </div>
              
              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 20px 0 0;">
                Thank you for keeping your account secure.
              </p>
              
              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 20px 0 0;">
                Best regards,<br>
                <strong>The CMS Sales Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f4f4f5; padding: 20px 30px; text-align: center;">
              <p style="color: #71717a; font-size: 12px; margin: 0;">
                This is an automated security notification. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-change-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
