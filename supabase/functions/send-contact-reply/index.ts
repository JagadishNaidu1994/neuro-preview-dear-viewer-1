
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactReplyRequest {
  to: string;
  subject: string;
  replyMessage: string;
  originalMessage: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, replyMessage, originalMessage, userName }: ContactReplyRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "DearNeuro Team <hello@dearneuro.com>",
      to: [to],
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #514B3D;">Hello ${userName},</h2>
          <p>Thank you for contacting DearNeuro. Here's our response to your inquiry:</p>
          
          <div style="background-color: #f8f8f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #514B3D; margin-top: 0;">Our Response:</h3>
            <p style="line-height: 1.6;">${replyMessage.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #666; margin-top: 0;">Your Original Message:</h4>
            <p style="line-height: 1.6; color: #666;">${originalMessage.replace(/\n/g, '<br>')}</p>
          </div>

          <p>If you have any further questions, please don't hesitate to reach out to us.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The DearNeuro Team</strong><br>
            <a href="mailto:hello@dearneuro.com" style="color: #514B3D;">hello@dearneuro.com</a>
          </p>
        </div>
      `,
    });

    console.log("Reply email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-reply function:", error);
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
