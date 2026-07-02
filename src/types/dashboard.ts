export interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatar?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  href: string;
}

export interface BillingInfo {
  plan: string;
  status: "active" | "cancelled" | "past_due";
  nextBillingDate: string;
  amount: string;
  paymentMethod: string;
  lastFour: string;
}
