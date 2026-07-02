import { prisma } from "@/lib/db/prisma";
import PDFDocument from "pdfkit";
import { Writable } from "stream";

export class InvoiceService {
  /**
   * Generates a database record for a new invoice securely attached to a payment.
   */
  async generateInvoiceRecord(paymentId: string, tenantId: string) {
    const uniqueNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const invoice = await prisma.invoice.create({
      data: {
        paymentId,
        tenantId,
        invoiceNumber: uniqueNumber,
        pdfUrl: `/api/invoices/${uniqueNumber}/download` // Internal route for dynamic streaming
      }
    });

    return invoice;
  }

  /**
   * Builds the PDF dynamically in memory and pipes it to a Writable stream (e.g. Server Response).
   */
  async buildPdfStream(invoiceNumber: string, tenantId: string, stream: Writable) {
    // 1. Fetch deep relations to build the receipt
    const invoice = await prisma.invoice.findFirst({
      where: { invoiceNumber, tenantId },
      include: {
        tenant: true,
        payment: {
          include: { plan: true }
        }
      }
    });

    if (!invoice) {
      throw new Error("Invoice not found or unauthorized access.");
    }

    const { payment, tenant } = invoice;
    const planName = payment.plan?.name || "Custom Credits";
    const amount = payment.amount;

    // 2. Initialize PDFKit
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(stream);

    // 3. Draw Header
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Digitalrakshak Resume Parser", 50, 57)
      .fontSize(10)
      .text("123 Tech Park, Bangalore, India", 200, 65, { align: "right" })
      .text("support@digitalrakshak.com", 200, 80, { align: "right" })
      .moveDown();

    doc.moveTo(50, 110).lineTo(550, 110).stroke();

    // 4. Draw Customer Info & Meta
    doc
      .fillColor("#000000")
      .fontSize(14)
      .text("INVOICE", 50, 130)
      .fontSize(10)
      .text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 150)
      .text(`Date: ${invoice.createdAt.toLocaleDateString()}`, 50, 165)
      .text(`Transaction ID: ${payment.razorpayPaymentId || payment.id}`, 50, 180)
      .text(`Billed To:`, 300, 130)
      .font("Helvetica-Bold")
      .text(tenant.name, 300, 150)
      .font("Helvetica");

    doc.moveTo(50, 210).lineTo(550, 210).stroke();

    // 5. Draw Table Header
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Description", 50, 240)
      .text("Status", 280, 240)
      .text("Amount (INR)", 400, 240, { align: "right" });

    doc.moveTo(50, 260).lineTo(550, 260).stroke();

    // 6. Draw Table Content
    doc
      .font("Helvetica")
      .text(`Subscription Plan: ${planName}`, 50, 280)
      .text(payment.status, 280, 280)
      .text(`Rs ${amount.toFixed(2)}`, 400, 280, { align: "right" });

    doc.moveTo(50, 310).lineTo(550, 310).stroke();

    // 7. Draw Total
    doc
      .font("Helvetica-Bold")
      .text("Total Paid:", 280, 330)
      .text(`Rs ${amount.toFixed(2)}`, 400, 330, { align: "right" });

    // 8. Footer
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        "Payment is processed. Thank you for your business.",
        50,
        700,
        { align: "center", width: 500 }
      );

    // Finalize the PDF
    doc.end();
  }
}

export const invoiceService = new InvoiceService();
