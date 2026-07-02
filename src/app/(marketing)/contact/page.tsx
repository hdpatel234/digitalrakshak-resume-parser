import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Sales",
  description: "Get in touch with our sales team.",
};

export default function ContactPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Contact Sales</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Let's talk about your needs.</h2>
            <p className="text-muted-foreground">
              Whether you need higher volume limits, custom SLA, or on-premise deployment, our team is ready to help you find the right solution.
            </p>
            <div className="pt-8 space-y-4">
              <p className="font-medium">Email: sales@digitalrakshak.com</p>
              <p className="font-medium">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="bg-muted/50 p-8 rounded-2xl border">
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input type="text" className="w-full p-2 rounded-md border bg-background" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Email</label>
                <input type="email" className="w-full p-2 rounded-md border bg-background" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full p-2 rounded-md border bg-background min-h-[100px]" placeholder="Tell us about your volume and needs..."></textarea>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium">Submit Request</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
