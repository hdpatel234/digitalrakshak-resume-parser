import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What file formats do you support?",
    answer: "We currently support PDF, DOCX, DOC, TXT, and RTF files. For images (like PNG/JPG of a resume), our OCR engine handles text extraction seamlessly.",
  },
  {
    question: "How accurate is the AI parsing?",
    answer: "Our pipeline utilizes state-of-the-art LLMs trained specifically on HR documents. It achieves >98% accuracy on standard resumes and gracefully handles complex multi-column layouts where legacy parsers fail.",
  },
  {
    question: "Is the parsed data secure and compliant?",
    answer: "Yes. We are SOC2 Type II compliant. We do not use your candidate data to train our foundational models, and all data is encrypted at rest and in transit. You can configure automatic data deletion policies.",
  },
  {
    question: "Can I process resumes in bulk?",
    answer: "Absolutely. Our Enterprise tier supports asynchronous webhooks allowing you to batch upload thousands of resumes and receive callbacks as they are processed.",
  },
  {
    question: "Do you offer custom schema mapping?",
    answer: "Yes, our API returns a highly structured standard JSON schema, but Enterprise customers can provide custom TypeScript interfaces for the AI to conform to.",
  },
];

export function FaqSection() {
  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
