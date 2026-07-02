import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parsing Engine",
  description: "Learn about the DigitalRakshak Resume Parsing Engine.",
};

export default function ParsingEnginePage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Parsing Engine</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">Deep learning models designed specifically for human resources data.</p>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <p>Our parsing engine uses state-of-the-art NLP models to understand the semantic meaning of resumes, moving beyond simple keyword matching.</p>
            
            <h2 className="text-2xl font-semibold">Supported Formats</h2>
            <p>We accurately extract text from PDF, DOCX, TXT, and RTF formats, automatically handling complex multi-column layouts, tables, and unusual formatting.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
