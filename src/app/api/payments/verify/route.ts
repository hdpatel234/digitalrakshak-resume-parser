import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { paymentService } from "@/server/services/payment.service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Authenticate the signature
    const isValid = paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      // Mark as failed if spoofed
      await paymentService.processFailedPayment(razorpay_order_id);
      return NextResponse.json({ error: "Invalid payment signature. Fraud detected." }, { status: 400 });
    }

    // 2. Process success (updates DB, activates subscription, deposits credits)
    await paymentService.processSuccessfulPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    return NextResponse.json({ success: true, message: "Payment verified securely." });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
