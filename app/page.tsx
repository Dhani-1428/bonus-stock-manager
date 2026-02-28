import { SiteHeader } from "@/components/landing/site-header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FAQSection } from "@/components/landing/faq-section"
import { ContactSection } from "@/components/landing/contact-section"
import { CTASection } from "@/components/landing/cta-section"
import { SiteFooter } from "@/components/landing/site-footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
      <SiteFooter />
    </main>
  )
}
