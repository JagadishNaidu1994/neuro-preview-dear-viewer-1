import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  to: string;
  orderId: string;
  status: string;
  customerName?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount?: number;
  trackingLink?: string;
}

const getEmailTemplate = (data: OrderEmailRequest) => {
  const { orderId, status, customerName, items, totalAmount, trackingLink } = data;
  
  const statusMessages = {
    placed: {
      subject: `Order Confirmation - ${orderId}`,
      title: "Order Confirmed!",
      message: "Thank you for your order. We've received it and will process it shortly.",
      color: "#10B981"
    },
    processing: {
      subject: `Order Processing - ${orderId}`,
      title: "Order Being Processed",
      message: "Your order is currently being prepared for shipment.",
      color: "#F59E0B"
    },
    shipped: {
      subject: `Order Shipped - ${orderId}`,
      title: "Order Shipped!",
      message: "Your order has been shipped and is on its way to you.",
      color: "#3B82F6"
    },
    delivered: {
      subject: `Order Delivered - ${orderId}`,
      title: "Order Delivered!",
      message: "Your order has been successfully delivered. Thank you for choosing us!",
      color: "#10B981"
    },
    cancelled: {
      subject: `Order Cancelled - ${orderId}`,
      title: "Order Cancelled",
      message: "Your order has been cancelled. If this was unexpected, please contact support.",
      color: "#EF4444"
    }
  };

  const statusInfo = statusMessages[status as keyof typeof statusMessages] || statusMessages.placed;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusInfo.subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #eee;">
          <h1 style="color: #514B3D; margin: 0;">DearNeuro</h1>
        </div>

        <!-- Status Banner -->
        <div style="background-color: ${statusInfo.color}; color: white; padding: 15px; text-align: center; margin: 20px 0; border-radius: 6px;">
          <h2 style="margin: 0; font-size: 24px;">${statusInfo.title}</h2>
        </div>

        <!-- Greeting -->
        <div style="margin: 20px 0;">
          <h3>Hello ${customerName || 'Valued Customer'},</h3>
          <p>${statusInfo.message}</p>
        </div>

        <!-- Order Details -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #514B3D;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
          
          ${items && items.length > 0 ? `
            <div style="margin: 15px 0;">
              <h4>Items Ordered:</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #514B3D; color: white;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: center;">Qty</th>
                    <th style="padding: 8px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(item => `
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px;">${item.name}</td>
                      <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                      <td style="padding: 8px; text-align: right;">₹${item.price.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
          
          ${totalAmount ? `<p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>` : ''}
          
          ${trackingLink ? `
            <div style="margin: 15px 0;">
              <p><strong>Track Your Order:</strong></p>
              <a href="${trackingLink}" style="background-color: #514B3D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Track Package
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Next Steps -->
        ${status === 'placed' ? `
          <div style="margin: 20px 0;">
            <h3>What's Next?</h3>
            <ul>
              <li>We'll send you an email when your order ships</li>
              <li>You can track your order status in your account</li>
              <li>Expected delivery: 3-5 business days</li>
            </ul>
          </div>
        ` : ''}

        ${status === 'shipped' && trackingLink ? `
          <div style="margin: 20px 0;">
            <h3>Track Your Package</h3>
            <p>Your order is on its way! Use the tracking link above to monitor its progress.</p>
          </div>
        ` : ''}

        <!-- Support -->
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Need Help?</h3>
          <p>If you have any questions about your order, please don't hesitate to contact our support team.</p>
          <p>
            <strong>Email:</strong> support@dearneuro.com<br>
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px 0; border-top: 2px solid #eee; color: #666; font-size: 14px;">
          <p>Thank you for choosing DearNeuro!</p>
          <p>&copy; 2025 DearNeuro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: OrderEmailRequest = await req.json();
    const { to, orderId, status } = emailData;

    if (!to || !orderId || !status) {
      throw new Error("Missing required fields: to, orderId, status");
    }

    const statusMessages = {
      placed: `Order Confirmation - ${orderId}`,
      processing: `Order Processing - ${orderId}`,
      shipped: `Order Shipped - ${orderId}`,
      delivered: `Order Delivered - ${orderId}`,
      cancelled: `Order Cancelled - ${orderId}`
    };

    const subject = statusMessages[status as keyof typeof statusMessages] || `Order Update - ${orderId}`;

    const emailResponse = await resend.emails.send({
      from: "DearNeuro <orders@dearneuro.com>",
      to: [to],
      subject: subject,
      html: getEmailTemplate(emailData),
    });

    console.log("Order email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
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