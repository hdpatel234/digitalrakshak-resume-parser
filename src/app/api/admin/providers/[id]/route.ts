import { NextResponse } from "next/server";
import { providerService } from "@/server/services/provider.service";
import { auth } from "@/lib/auth/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isActive } = await req.json();
  const updatedProvider = await providerService.toggleProvider(resolvedParams.id, isActive);
  return NextResponse.json(updatedProvider);
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await providerService.getProviderById(resolvedParams.id);
  if (!provider) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(provider);
}
