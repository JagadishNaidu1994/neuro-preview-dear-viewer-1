
import jsPDF from 'jspdf';

interface OrderItem {
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  shipping_address?: any;
}

export const generateInvoicePDF = (order: Order, userEmail: string = '') => {
  const pdf = new jsPDF();
  
  // Header styling
  pdf.setFillColor(70, 130, 150); // Teal blue color matching the reference
  pdf.rect(0, 0, 210, 40, 'F');
  
  // Invoice title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', 20, 25);
  
  // Company branding
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('DearNeuro', 20, 35);
  
  // Reset text color for body
  pdf.setTextColor(0, 0, 0);
  
  // Order details section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Order Details', 20, 60);
  
  // Order info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const orderNumber = order.id.slice(0, 8);
  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN');
  
  pdf.text(`Invoice Number: ${orderNumber}`, 20, 75);
  pdf.text(`Date of Issue: ${orderDate}`, 20, 85);
  
  // Billed To section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Billed To', 120, 60);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(order.shipping_address?.name || 'Customer Name', 120, 75);
  pdf.text(userEmail, 120, 85);
  if (order.shipping_address) {
    pdf.text(order.shipping_address.address_line_1 || '', 120, 95);
    pdf.text(`${order.shipping_address.city}, ${order.shipping_address.state}`, 120, 105);
    pdf.text(order.shipping_address.pincode || '', 120, 115);
  }
  
  // Items table header
  const tableTop = 140;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, tableTop, 170, 15, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', 25, tableTop + 10);
  pdf.text('Rate', 100, tableTop + 10);
  pdf.text('Qty', 130, tableTop + 10);
  pdf.text('Line Total', 150, tableTop + 10);
  
  // Items
  let yPosition = tableTop + 25;
  pdf.setFont('helvetica', 'normal');
  
  order.order_items.forEach((item) => {
    pdf.text(item.product.name, 25, yPosition);
    pdf.text(`₹${item.price.toFixed(2)}`, 100, yPosition);
    pdf.text(item.quantity.toString(), 135, yPosition);
    pdf.text(`₹${(item.price * item.quantity).toFixed(2)}`, 155, yPosition);
    yPosition += 15;
  });
  
  // Totals section
  const totalsY = yPosition + 20;
  pdf.setFont('helvetica', 'bold');
  
  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;
  
  pdf.text('Subtotal:', 130, totalsY);
  pdf.text(`₹${subtotal.toFixed(2)}`, 155, totalsY);
  
  pdf.text('Tax:', 130, totalsY + 10);
  pdf.text(`₹${tax.toFixed(2)}`, 155, totalsY + 10);
  
  pdf.text('Total:', 130, totalsY + 20);
  pdf.text(`₹${order.total_amount.toFixed(2)}`, 155, totalsY + 20);
  
  pdf.text('Amount Due (USD):', 130, totalsY + 30);
  pdf.text(`₹${order.total_amount.toFixed(2)}`, 155, totalsY + 30);
  
  // Footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for your business!', 20, 270);
  pdf.text('Please pay invoice within 15 days.', 20, 280);
  
  // Download the PDF
  pdf.save(`invoice-${orderNumber}.pdf`);
};
