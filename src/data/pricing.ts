import type { PricingTier, BillingInfo } from "@/types/dashboard";

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "₹0",
    period: "forever",
    description: "Perfect for individuals getting started with digital solutions.",
    features: [
      "Up to 3 projects",
      "Basic analytics",
      "1 GB storage",
      "Community support",
      "API access (100 req/day)",
    ],
    cta: "Get Started Free",
    href: "/register",
  },
  {
    name: "Professional",
    price: "₹1,999",
    period: "per month",
    description: "For growing teams that need advanced features and priority support.",
    features: [
      "Unlimited projects",
      "Advanced analytics & reports",
      "50 GB storage",
      "Priority email support",
      "API access (10K req/day)",
      "Custom integrations",
      "Team collaboration",
      "Audit logs",
    ],
    cta: "Start Free Trial",
    popular: true,
    href: "/register?plan=pro",
  },
  {
    name: "Enterprise",
    price: "₹7,999",
    period: "per month",
    description: "For large organizations requiring full control, security, and scale.",
    features: [
      "Everything in Professional",
      "Unlimited storage",
      "24/7 dedicated support",
      "API access (unlimited)",
      "SSO & SAML",
      "Custom SLA",
      "On-premise deployment",
      "Advanced security controls",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/register?plan=enterprise",
  },
];

export const mockBillingInfo: BillingInfo = {
  plan: "Professional",
  status: "active",
  nextBillingDate: "August 1, 2025",
  amount: "₹1,999",
  paymentMethod: "Visa",
  lastFour: "4242",
};
