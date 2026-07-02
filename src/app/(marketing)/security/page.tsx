import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security (SOC2)",
  description: "Security and compliance at DigitalRakshak.",
};

export default function SecurityPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Security & Compliance</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Commitment to Security</h2>
            <p>At DigitalRakshak, we take the security of your data seriously. We adhere to industry best practices to ensure that your candidate information and business data are protected at all times.</p>
            
            <h2 className="text-2xl font-semibold">SOC 2 Type II Compliance</h2>
            <p>We are actively working towards full SOC 2 Type II compliance to validate our security controls and processes. This ensures that our systems are designed to keep our clients' sensitive data secure.</p>
            
            <h2 className="text-2xl font-semibold">Data Encryption</h2>
            <p>All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption. We never store raw resumes longer than necessary for processing unless explicitly configured in your data retention policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
