"use client";

import Link from "next/link";
import { ArrowRight, Play, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center"
    >
      {/* ── Full-screen background image ── */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-image.png')" }}
      />
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Accent glows on top of the dark overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-500/15 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-indigo-300 gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            GPT-4o Integration — Now Live
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-2xl">
            Parse resumes{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              instantly
            </span>
            <br className="hidden md:inline" />
            <span className="text-white/70"> with AI intelligence.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Extract structured JSON data from any resume format in milliseconds.
            Built for enterprise ATS platforms, recruiters, and HR tech teams.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6 md:gap-10 pt-2 flex-wrap justify-center">
            {[
              { icon: Zap, label: "< 500ms", desc: "Parse time" },
              { icon: Shield, label: "SOC2", desc: "Compliant" },
              { icon: Globe, label: "50+ formats", desc: "Supported" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                  <Icon className="h-4 w-4 text-indigo-300" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{label}</div>
                  <div className="text-xs text-white/60">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
              render={<Link href="/register" />}
            >
              Start Parsing Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 text-base border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-indigo-400/60 hover:bg-white/15 transition-all duration-300"
              render={<Link href="/#demo" />}
            >
              <Play className="mr-2 h-4 w-4 text-indigo-300" />
              Watch Demo
            </Button>
          </div>

          {/* Trust markers */}
          <p className="text-xs text-white/50 pt-2">
            No credit card required &nbsp;·&nbsp; Free 500 parses/month &nbsp;·&nbsp; Cancel anytime
          </p>
        </div>
      </div>

      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
