import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for DigitalRakshak Resume Parser.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">Last updated: July 2, 2026</p>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
            <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and DigitalRakshak ("Company", "we", "us", or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.</p>
            
            <h2 className="text-2xl font-semibold">2. Intellectual Property Rights</h2>
            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.</p>

            <h2 className="text-2xl font-semibold">3. User Representations</h2>
            <p>By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete.</p>
            
            <h2 className="text-2xl font-semibold">4. Prohibited Activities</h2>
            <p>You may not access or use the Site for any purpose other than that for which we make the Site available.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
