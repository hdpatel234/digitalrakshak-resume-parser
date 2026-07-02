import { Shield, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
    {
        icon: Shield,
        title: "Security First",
        description:
            "We believe that trust is earned through unwavering commitment to data security and privacy. Every feature we build starts with security as the foundation.",
    },
    {
        icon: Target,
        title: "Customer Obsessed",
        description:
            "Our customers are at the heart of every decision. We listen, learn, and iterate to deliver solutions that truly solve real-world problems.",
    },
    {
        icon: Heart,
        title: "Built with Care",
        description:
            "Great software is crafted, not just coded. We pay attention to every pixel, every interaction, and every line of code to deliver an exceptional experience.",
    },
];

const stats = [
    { value: "2,000+", label: "Companies Trust Us" },
    { value: "14,500+", label: "Active Users" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "24/7", label: "Expert Support" },
];

export function AboutSection() {
    return (
        <section id="about" className="py-24 md:py-32 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        About{" "}
                        <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                            DigitalRakshak
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        We&apos;re on a mission to democratize enterprise-grade digital
                        solutions. Founded in 2024, DigitalRakshak empowers businesses of
                        all sizes with tools that were previously available only to large
                        corporations.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center p-6 rounded-xl border bg-card"
                        >
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Our Story */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            DigitalRakshak was born from a simple observation: small and
                            mid-sized businesses deserve the same powerful digital tools that
                            large enterprises have access to, without the complexity and
                            prohibitive cost.
                        </p>
                        <p>
                            Our founding team — a group of engineers and designers from
                            leading tech companies — came together with a shared vision of
                            building software that is secure by default, intuitive by design,
                            and scalable by architecture.
                        </p>
                        <p>
                            Today, we serve over 2,000 companies across industries, from
                            early-stage startups to Fortune 500 enterprises, all united by a
                            common need for reliable, modern digital infrastructure.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                        Our Values
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {values.map((value) => (
                            <Card
                                key={value.title}
                                className="group hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/20 transition-all"
                            >
                                <CardContent className="pt-6 space-y-4">
                                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-colors">
                                        <value.icon className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
