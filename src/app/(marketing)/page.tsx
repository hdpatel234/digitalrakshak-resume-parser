import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { ApiSection } from "@/components/marketing/api-section";
import { PricingSection } from "@/components/marketing/pricing-card";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { FaqSection } from "@/components/marketing/faq";
import { AboutSection } from "@/components/marketing/about-section";
import { prisma } from "@/lib/db/prisma";
import { PricingPlanProps } from "@/components/marketing/pricing-card";

async function getPricingPlans(): Promise<PricingPlanProps[]> {
  const dbPlans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' }
  });

  return dbPlans.map((plan) => {
    let description = "";
    let features: any[] = [];

    if (plan.features) {
      const parsed = typeof plan.features === "string" ? JSON.parse(plan.features) : plan.features as any;
      if (parsed.description) description = parsed.description;
      if (parsed.featuresList && Array.isArray(parsed.featuresList)) {
        features = parsed.featuresList;
      }
    }

    if (!features.length) {
      features = [
        { text: `${plan.credits.toLocaleString("en-US")} parses / month`, included: true },
        { text: "Standard JSON output", included: true },
        { text: plan.price > 1000 ? "Priority support" : "Community support", included: true },
        { text: "Custom schemas", included: plan.price > 4000 },
        { text: "Webhook integrations", included: plan.price > 1000 },
      ];
    }

    return {
      tier: plan.name,
      priceINR: plan.price,
      description: description || `Unlock ${plan.credits} parses/month`,
      buttonText: plan.price > 5000 ? "Contact Sales" : plan.price > 1000 ? "Subscribe Now" : "Start Free Trial",
      buttonVariant: plan.price > 1000 && plan.price < 5000 ? "default" : "outline",
      isPopular: plan.name.toLowerCase() === "pro" || plan.name.toLowerCase() === "growth",
      features,
    };
  });
}

export default async function LandingPage() {
  const plans = await getPricingPlans();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <FeaturesSection />

      <HowItWorksSection />

      <ApiSection />

      <PricingSection plans={plans} />

      <AboutSection />

      <TestimonialsSection />

      <FaqSection />
    </div>
  );
}
