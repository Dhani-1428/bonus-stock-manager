"use client"

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

const testimonials = [
  {
    quote:
      "StockPulse completely transformed how I manage my shop. I used to track everything in a notebook. Now I can scan a barcode and see everything instantly. My reordering is 10x faster.",
    name: "Rajesh Kumar",
    designation: "Owner, PhoneWorld Store",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The low stock alerts alone have saved us from running out of our best-selling accessories multiple times. The analytics help me understand which products to stock more of.",
    name: "Priya Sharma",
    designation: "Manager, TechBuzz Electronics",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "We have 3 staff members and the role-based access is perfect. My staff can process sales while I monitor everything from the dashboard. Best investment for my shop.",
    name: "Ahmed Hassan",
    designation: "Owner, Mobile Galaxy",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The barcode scanning feature is incredibly fast and accurate. It has reduced our checkout time by 60% and eliminated manual entry errors completely.",
    name: "Suresh Patel",
    designation: "Founder, Mobile Hub",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "StockPulse's cloud sync means I can check my inventory from anywhere. Whether I'm at home or traveling, I always know what's in stock. Game changer!",
    name: "Meera Reddy",
    designation: "CEO, TechMart Solutions",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">
            Loved by Shop Owners
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            See what our users have to say about their experience with StockPulse.
          </p>
        </div>

        {/* Animated Testimonials */}
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  )
}
