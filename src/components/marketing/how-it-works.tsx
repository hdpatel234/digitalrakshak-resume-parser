import { Upload, Sparkles, Braces } from "lucide-react";

const steps = [
  {
    title: "Upload Resume",
    description: "Send us a PDF, DOCX, or Image file via our dashboard or secure REST API.",
    icon: Upload,
  },
  {
    title: "AI Process",
    description: "Our proprietary LLM pipeline reads, contextualizes, and categorizes the unstructured data.",
    icon: Sparkles,
  },
  {
    title: "Structured JSON Output",
    description: "Receive a deeply nested, perfectly typed JSON object mapped to standard HR schemas.",
    icon: Braces,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform messy documents into structured intelligence.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-border/60 z-0" />

          <div className="grid gap-12 md:gap-6 md:grid-cols-3 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-4">
                  <div className="h-24 w-24 rounded-2xl bg-card border border-border/60 shadow-sm flex items-center justify-center relative">
                    <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>
                    <Icon className="h-10 w-10 text-foreground/80" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
