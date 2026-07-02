import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights and news from DigitalRakshak.",
};

export default function BlogPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">Insights on hiring, AI, and engineering.</p>
          
          <div className="grid gap-8 md:grid-cols-2 mt-12">
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-xl"></div>
              <h3 className="text-2xl font-bold">The Future of AI in Recruitment</h3>
              <p className="text-muted-foreground">How large language models are fundamentally changing how we evaluate candidates.</p>
            </div>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-xl"></div>
              <h3 className="text-2xl font-bold">Building a High-Throughput Parser</h3>
              <p className="text-muted-foreground">Engineering challenges we faced while scaling our document processing pipeline to millions of resumes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
