"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"
import { CardSpotlight } from "@/components/ui/card-spotlight"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", message: "" })
    alert("Thank you for your message! We'll get back to you soon.")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">
            Get in Touch
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 perspective-3d">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <CardSpotlight className="hover:neon-glow transition-all">
              <div className="flex items-start gap-4 relative z-20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Email
                  </h3>
                  <Link
                    href="mailto:support@stockpulse.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    support@stockpulse.com
                  </Link>
                </div>
              </div>
            </CardSpotlight>

            <CardSpotlight className="hover:neon-glow transition-all">
              <div className="flex items-start gap-4 relative z-20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Phone
                  </h3>
                  <Link
                    href="tel:+1234567890"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (234) 567-8900
                  </Link>
                </div>
              </div>
            </CardSpotlight>

            <CardSpotlight className="hover:neon-glow transition-all">
              <div className="flex items-start gap-4 relative z-20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Office
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    123 Business Street<br />
                    Suite 100<br />
                    City, State 12345
                  </p>
                </div>
              </div>
            </CardSpotlight>
          </div>

          {/* Contact Form */}
          <CardSpotlight className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-20">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all neon-glow mt-2"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </CardSpotlight>
        </div>
      </div>
    </section>
  )
}
