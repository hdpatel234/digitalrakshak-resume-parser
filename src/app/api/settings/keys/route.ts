import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { apiKeyService } from "@/server/services/apikey.service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tenantId = (session.user as any).tenantId;

  const keys = await apiKeyService.getKeys(tenantId);
  return NextResponse.json({ success: true, keys });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tenantId = (session.user as any).tenantId;

  try {
    const body = await req.json();
    const { name, action, keyId } = body;

    if (action === "create") {
      const newKey = await apiKeyService.generateKey(tenantId, name || "New API Key");
      return NextResponse.json({ success: true, key: newKey });
    }

    if (action === "deactivate") {
      await apiKeyService.deactivateKey(keyId, tenantId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
