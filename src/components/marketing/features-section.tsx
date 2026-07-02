import {
  FileJson,
  FileText,
  UserCheck,
  Target,
  UploadCloud,
  Code2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Resume Parsing",
    description: "Extract text seamlessly from PDF, DOCX, and TXT files, regardless of complex layouts or multi-column designs.",
    icon: FileText,
  },
  {
    title: "JSON Output",
    description: "Receive perfectly structured, predictable JSON objects ready to insert directly into your database or ATS.",
    icon: FileJson,
  },
  {
    title: "Candidate Data Extraction",
    description: "Automatically identify and categorize skills, work history, education, and contact information with near-human accuracy.",
    icon: UserCheck,
  },
  {
    title: "ATS Scoring",
    description: "Generate keyword matches and relevance scores automatically based on provided job descriptions.",
    icon: Target,
  },
  {
    title: "Bulk Resume Upload",
    description: "Process thousands of resumes simultaneously through our high-throughput asynchronous parsing engine.",
    icon: UploadCloud,
  },
  {
    title: "API Access",
    description: "Integrate parsing capabilities directly into your existing software with our robust, well-documented REST API.",
    icon: Code2,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/20 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to scale hiring.
          </h2>
          <p className="text-lg text-muted-foreground md:max-w-2xl md:mx-auto">
            Our engine handles the unstructured chaos of human resumes so your software can focus on matching the right candidates.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="bg-background border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
