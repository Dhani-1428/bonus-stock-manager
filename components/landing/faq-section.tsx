"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { GlareCard } from "@/components/ui/glare-card"

const faqs = [
  {
    question: "How does barcode scanning work?",
    answer:
      "StockPulse uses your device's camera to scan standard barcodes (EAN, UPC, etc.). Simply point your camera at a product's barcode, and the app will instantly find the product in your inventory, show stock levels, and allow you to process sales or update quantities.",
  },
  {
    question: "Can I use StockPulse offline?",
    answer:
      "Yes! StockPulse works offline for basic operations like scanning, viewing inventory, and processing sales. Your data will sync to the cloud automatically when you're back online.",
  },
  {
    question: "How many products can I track?",
    answer:
      "The free Starter plan allows up to 100 products. Professional and Enterprise plans support unlimited products, so you can scale as your business grows.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All your data is encrypted and stored securely in the cloud. We use industry-standard security practices and never share your information with third parties.",
  },
  {
    question: "Can multiple staff members use the same account?",
    answer:
      "Yes! You can add multiple staff members with different permission levels. Admins have full access, while staff members can process sales and view inventory without making changes to settings.",
  },
  {
    question: "Do I need special hardware?",
    answer:
      "No special hardware required! StockPulse works on any smartphone or tablet with a camera. You can use your existing device to scan barcodes and manage your inventory.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes, Professional and Enterprise plans include export functionality. You can export your inventory and sales data to PDF or Excel formats for accounting and analysis purposes.",
  },
  {
    question: "What if I need help?",
    answer:
      "We offer email support for all plans, with priority support for Professional users and 24/7 phone support for Enterprise customers. Our help center also has detailed guides and tutorials.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            Everything you need to know about StockPulse.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-4 perspective-3d">
          {faqs.map((faq, index) => (
            <GlareCard
              key={index}
              className="overflow-hidden transition-all hover:neon-glow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left gap-4 hover:bg-secondary/30 transition-colors relative z-20"
              >
                <h3 className="text-base font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed relative z-20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </GlareCard>
          ))}
        </div>
      </div>
    </section>
  )
}
