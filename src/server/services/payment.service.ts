import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { subscriptionService } from "@/server/services/subscription.service";
import { invoiceService } from "@/server/services/invoice.service";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SQxqJOMmeLZK9n",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "9Y3M6fGuUUp7zxevkNkqeMDV"
});

export class PaymentService {
  /**
   * Generates a Razorpay Order and saves the PENDING payment locally.
   */
  async createOrder(tenantId: string, planId: string) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) {
      throw new Error("Invalid or inactive plan.");
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(plan.price * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    // Create a pending payment tracking record
    await prisma.payment.create({
      data: {
        tenantId,
        planId,
        amount: plan.price,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: order.id
      }
    });

    return {
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_SQxqJOMmeLZK9n"
    };
  }

  /**
   * Verifies the cryptographic signature returned by Razorpay to prevent fraud.
   */
  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET || "9Y3M6fGuUUp7zxevkNkqeMDV";
    const body = `${orderId}|${paymentId}`;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Marks a payment as completed and activates the user's subscription automatically.
   */
  async processSuccessfulPayment(razorpayOrderId: string, razorpayPaymentId: string, signature: string) {
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId }
    });

    if (!payment) {
      throw new Error("Payment record not found.");
    }

    if (payment.status === "COMPLETED") {
      return { message: "Payment already processed." };
    }

    // Update payment to completed
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        razorpayPaymentId,
        razorpaySignature: signature
      }
    });

    // Automatically trigger subscription assignment and credit deposit
    if (payment.planId) {
      await subscriptionService.assignSubscription(payment.tenantId, payment.planId);
    }

    // Generate Invoice Record
    await invoiceService.generateInvoiceRecord(payment.id, payment.tenantId);

    return { success: true };
  }

  /**
   * Handles payment failures cleanly
   */
  async processFailedPayment(razorpayOrderId: string) {
    await prisma.payment.update({
      where: { razorpayOrderId },
      data: { status: "FAILED" }
    });
  }
}

export const paymentService = new PaymentService();
