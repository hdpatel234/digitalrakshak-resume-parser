import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the DigitalRakshak team.",
};

export default function CareersPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Careers</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">Help us build the future of HR technology.</p>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Open Positions</h2>
            <p>We are always looking for talented engineers, designers, and go-to-market professionals. If you don't see a role that fits, reach out anyway!</p>
            
            <div className="space-y-4 mt-8">
              <div className="p-6 border rounded-xl">
                <h3 className="text-xl font-bold">Senior Machine Learning Engineer</h3>
                <p className="text-muted-foreground">Remote - Full Time</p>
              </div>
              <div className="p-6 border rounded-xl">
                <h3 className="text-xl font-bold">Frontend Developer (React/Next.js)</h3>
                <p className="text-muted-foreground">Remote - Full Time</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
