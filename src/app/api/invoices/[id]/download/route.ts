import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { invoiceService } from "@/server/services/invoice.service";
import { Writable } from "stream";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const invoiceNumber = resolvedParams.id; // e.g. INV-2026-12345

    // We will pipe pdfkit output to a ReadableStream to return as standard fetch response
    const { readable, writable } = new TransformStream();
    
    // Create a Node Writable wrapper around the TransformStream's writable side
    const nodeWritable = new Writable({
      write(chunk, encoding, callback) {
        const writer = writable.getWriter();
        writer.write(chunk).then(() => {
          writer.releaseLock();
          callback();
        }).catch(callback);
      },
      final(callback) {
        writable.close().then(() => callback()).catch((err) => callback(err));
      }
    });

    // Start generating the PDF asynchronously
    invoiceService.buildPdfStream(invoiceNumber, tenantId, nodeWritable).catch(err => {
      console.error("PDF Generation Error", err);
      // If error happens after stream starts, we might not be able to send 500 cleanly
      // but if it errors early, it will be caught here.
      nodeWritable.destroy(err);
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoiceNumber}.pdf"`
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
