import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const codeSnippet = `POST /api/v1/parse
Authorization: Bearer sk_test_12345
Content-Type: application/pdf

{
  "file": "@resume.pdf",
  "webhook_url": "https://api.yourdomain.com/webhook"
}

// Response
{
  "id": "req_9876xyz",
  "status": "success",
  "data": {
    "personal": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1 555-0198"
    },
    "experience": [
      {
        "company": "Tech Corp",
        "title": "Senior Engineer",
        "duration": "2020 - Present"
      }
    ],
    "skills": ["React", "TypeScript", "Node.js"]
  }
}`;

export function ApiSection() {
  return (
    <section className="py-24 bg-foreground text-background overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="space-y-6 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Developer-first API integration.
            </h2>
            <p className="text-lg text-muted/80 leading-relaxed">
              Drop our API into your existing hiring stack with just a few lines of code. We handle the OCR, layout analysis, and LLM extraction. You get clean JSON.
            </p>
            <ul className="space-y-3 pt-4">
              {[
                "Webhooks for asynchronous bulk processing",
                "SDKs for Node.js, Python, and Go",
                "99.99% Uptime SLA",
                "SOC2 Type II Certified",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-background/90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-6">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                Read the Documentation
              </Button>
            </div>
          </div>

          {/* Code Window */}
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl">
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#161b22]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto text-xs font-mono text-white/40">parse-resume.sh</div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-white/80">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Dark mode background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
    </section>
  );
}
