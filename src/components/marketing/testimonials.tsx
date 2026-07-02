import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";

const testimonials = [
  {
    quote: "This parser has completely transformed our top-of-funnel hiring. What used to take our recruiting team hours of manual data entry now happens instantly.",
    author: "Sarah Jenkins",
    role: "VP of Talent, TechFlow",
    avatar: "/avatars/sarah.jpg"
  },
  {
    quote: "The JSON structure is incredibly predictable. We ripped out our legacy parser and integrated this API in a single afternoon. Flawless execution.",
    author: "Michael Chang",
    role: "Lead Engineer, HireSync",
    avatar: "/avatars/michael.jpg"
  },
  {
    quote: "Even with the most complex, multi-column designer resumes, the AI perfectly extracts the exact timeline and skills. It's almost magic.",
    author: "Elena Rodriguez",
    role: "Founder, ScaleHR",
    avatar: "/avatars/elena.jpg"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/20 border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Trusted by modern HR teams.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it. See how teams are scaling their hiring velocity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-background border-border/40 shadow-sm flex flex-col justify-between">
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed italic mb-8">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <UserAvatar name={t.author} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
