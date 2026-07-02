import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Product updates and release notes.",
};

export default function ChangelogPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Changelog</h1>
        <div className="space-y-12">
          <div className="border-l-2 border-primary/20 pl-6 pb-6">
            <h2 className="text-2xl font-semibold mb-2">v2.1.0 - Improved Table Extraction</h2>
            <p className="text-sm text-muted-foreground mb-4">July 2, 2026</p>
            <div className="prose prose-slate dark:prose-invert">
              <p>We've completely overhauled our table extraction engine to better handle complex, multi-column layouts often found in designer resumes.</p>
              <ul>
                <li>Improved accuracy on two-column layouts by 15%.</li>
                <li>Fixed a bug where nested tables were parsed out of order.</li>
              </ul>
            </div>
          </div>
          
          <div className="border-l-2 border-primary/20 pl-6 pb-6">
            <h2 className="text-2xl font-semibold mb-2">v2.0.0 - GPT-4o Integration</h2>
            <p className="text-sm text-muted-foreground mb-4">June 15, 2026</p>
            <div className="prose prose-slate dark:prose-invert">
              <p>We are thrilled to announce that our parsing engine is now powered by the latest GPT-4o model, delivering unprecedented accuracy and speed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
