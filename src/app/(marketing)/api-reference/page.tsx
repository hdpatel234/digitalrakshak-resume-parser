import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference",
  description: "API Reference for DigitalRakshak Resume Parser.",
};

export default function ApiReferencePage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">API Reference</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">Integrate our parsing engine directly into your ATS.</p>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Authentication</h2>
            <p>All API requests must be authenticated using a Bearer token. You can generate API keys in your dashboard.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>Authorization: Bearer YOUR_API_KEY</code>
            </pre>
            
            <h2 className="text-2xl font-semibold">Endpoints</h2>
            <h3 className="text-xl font-medium mt-4">POST /v1/parse</h3>
            <p>Upload a file to be parsed. Accepts multipart/form-data.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
