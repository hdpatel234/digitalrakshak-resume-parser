import { NextResponse } from "next/server";
import { providerService } from "@/server/services/provider.service";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const models = await providerService.getModels();
  return NextResponse.json(models);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    if (!data.providerId || !data.modelName) {
      return NextResponse.json({ error: "providerId and modelName are required" }, { status: 400 });
    }

    const newModel = await providerService.createModel({
      providerId: data.providerId,
      modelName: data.modelName,
      costPerRequest: data.costPerRequest,
      maxRequestsPerMin: data.maxRequestsPerMin,
      maxDailyLimit: data.maxDailyLimit,
      tokenLimit: data.tokenLimit,
      isActive: data.isActive
    });

    return NextResponse.json(newModel, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
