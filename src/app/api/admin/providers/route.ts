import { NextResponse } from "next/server";
import { providerService } from "@/server/services/provider.service";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providers = await providerService.getProviders();
  return NextResponse.json(providers);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, isActive } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const newProvider = await providerService.createProvider(name, isActive);
  return NextResponse.json(newProvider, { status: 201 });
}
