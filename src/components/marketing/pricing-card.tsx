"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Currency definitions ──────────────────────────────────────────
const CURRENCIES = [
  { code: "INR", symbol: "₹", flag: "🇮🇳", label: "Indian Rupee", rate: 83 },
  { code: "USD", symbol: "$", flag: "🇺🇸", label: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", flag: "🇪🇺", label: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", flag: "🇬🇧", label: "British Pound", rate: 0.79 },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", label: "UAE Dirham", rate: 3.67 },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// Base prices in INR
function formatPrice(inr: number, currency: (typeof CURRENCIES)[number]) {
  const usdAmount = inr / 83; // assuming base rate 83 INR = 1 USD
  const amount = Math.round(usdAmount * currency.rate);
  if (currency.code === "INR") {
    return `${currency.symbol}${amount.toLocaleString("en-IN")}`;
  }
  return `${currency.symbol}${amount.toLocaleString("en-US")}`;
}

// ── Currency Selector ─────────────────────────────────────────────
function CurrencySelector({
  selected,
  onChange,
}: {
  selected: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = CURRENCIES.find((c) => c.code === selected)!;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors backdrop-blur-sm"
      >
        <span className="text-base">{current.flag}</span>
        <span>{current.code}</span>
        <span className="text-muted-foreground">— {current.symbol}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 w-56 rounded-xl border border-border/60 bg-popover shadow-xl overflow-hidden">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { onChange(c.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                  c.code === selected ? "bg-indigo-500/10 text-indigo-400 font-semibold" : "text-foreground"
                }`}
              >
                <span className="text-base w-6">{c.flag}</span>
                <span className="font-medium">{c.code}</span>
                <span className="text-muted-foreground text-xs ml-auto">{c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Pricing Card ──────────────────────────────────────────────────
interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlanProps {
  tier: string;
  priceINR: number | "custom";
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  isPopular?: boolean;
  features: PricingFeature[];
}

export function PricingCard({
  tier,
  priceINR,
  currency,
  description,
  features,
  isPopular,
  buttonText,
  buttonVariant = "default",
}: PricingPlanProps & { currency: (typeof CURRENCIES)[number] }) {
  const displayPrice =
    priceINR === "custom" ? "Custom" : formatPrice(priceINR, currency);

  return (
    <Card
      className={`relative flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
        isPopular
          ? "border-indigo-500/60 shadow-lg shadow-indigo-500/10"
          : "border-border/40 shadow-sm hover:shadow-md"
      } bg-background`}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs uppercase tracking-wider font-semibold border-0">
          Most Popular
        </Badge>
      )}

      <CardHeader className="pt-8 text-center pb-4">
        <h3 className="text-xl font-bold">{tier}</h3>
        <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{description}</p>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-4xl font-extrabold tracking-tight">{displayPrice}</span>
          {priceINR !== "custom" && (
            <span className="text-sm font-medium text-muted-foreground">/mo</span>
          )}
        </div>
        {priceINR !== "custom" && currency.code !== "INR" && (
          <p className="text-xs text-muted-foreground mt-1">
            ≈ ₹{priceINR} INR / month
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-6">
        <ul className="space-y-4 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check
                className={`h-5 w-5 shrink-0 ${
                  feature.included ? "text-indigo-500" : "text-muted-foreground/30"
                }`}
              />
              <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-6 pb-8">
        <Button
          variant={buttonVariant}
          className={`w-full h-11 ${
            isPopular
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0 shadow-md shadow-indigo-500/25"
              : ""
          }`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── Full Pricing Section (exported for use in page.tsx) ───────────
export function PricingSection({ plans }: { plans: PricingPlanProps[] }) {
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const currentCurrency = CURRENCIES.find((c) => c.code === currency)!;

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start parsing immediately. Scale infinitely when you&apos;re ready.
          </p>
          {/* Currency Switcher */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground mb-1">Select your currency</p>
            <CurrencySelector selected={currency} onChange={setCurrency} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.tier}
              {...plan}
              currency={currentCurrency}
            />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Prices shown in {currentCurrency.label} ({currentCurrency.code}). All plans billed monthly. Annual plans available with 20% discount.
        </p>
      </div>
    </section>
  );
}
