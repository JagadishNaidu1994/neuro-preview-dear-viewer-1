
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend("re_MHvKSbdx_FRfYWktq3CwBmMfwbNh2e6Ts");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactReplyRequest {
  to: string;
  subject: string;
  message: string;
  originalMessage?: string;
  userName?: string;
  conversationHistory?: Array<{
    message: string;
    reply?: string;
    timestamp: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, originalMessage, userName, conversationHistory }: ContactReplyRequest = await req.json();

    // Build conversation snapshot
    let conversationSnapshot = "";
    if (conversationHistory && conversationHistory.length > 0) {
      conversationSnapshot = `
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #514B3D; margin-bottom: 15px;">📋 Conversation History</h3>
      `;
      
      conversationHistory.forEach((item, index) => {
        conversationSnapshot += `
          <div style="margin-bottom: 15px; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid #514B3D;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #514B3D;">Message ${index + 1} - ${new Date(item.timestamp).toLocaleDateString()}</p>
            <p style="margin: 0 0 10px 0; color: #333;">${item.message}</p>
            ${item.reply ? `<div style="background-color: #f1f5f9; padding: 10px; border-radius: 4px; margin-top: 8px;">
              <p style="margin: 0; font-weight: bold; color: #514B3D; font-size: 14px;">Our Reply:</p>
              <p style="margin: 5px 0 0 0; color: #555;">${item.reply}</p>
            </div>` : ''}
          </div>
        `;
      });
      
      conversationSnapshot += `</div>`;
    }

    const emailResponse = await resend.emails.send({
      from: "DearNeuro Support <noreply@jizquudonunnxwwhyfrexa.supabase.co>",
      to: [to],
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #514B3D;">
            <h1 style="color: #514B3D; margin: 0; font-size: 28px; font-weight: 600;">DearNeuro</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Premium Neurological Supplements</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px 0;">
            <h2 style="color: #161616; margin-bottom: 20px;">Hello ${userName || 'there'}! 👋</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
            </div>

            ${originalMessage ? `
              <div style="margin: 25px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #514B3D;">
                <h4 style="color: #514B3D; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Your Original Message:</h4>
                <p style="margin: 0; color: #555; font-style: italic; line-height: 1.5;">"${originalMessage}"</p>
              </div>
            ` : ''}

            ${conversationSnapshot}

            <div style="margin: 30px 0; text-align: center;">
              <a href="mailto:support@dearneuro.com" style="display: inline-block; background-color: #514B3D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background-color 0.3s;">
                Reply to this Email
              </a>
            </div>

            <p style="color: #666; line-height: 1.6; margin-top: 25px;">
              Best regards,<br>
              <strong style="color: #514B3D;">The DearNeuro Support Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">This email was sent in response to your inquiry.</p>
            <p style="margin: 0;">© 2024 DearNeuro. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log("Contact reply email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-reply function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
