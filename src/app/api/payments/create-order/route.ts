import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { paymentService } from "@/server/services/payment.service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required." }, { status: 400 });
    }

    const orderPayload = await paymentService.createOrder(tenantId, planId);

    return NextResponse.json({ success: true, data: orderPayload });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
