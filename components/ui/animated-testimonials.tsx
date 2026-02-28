"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

import { useEffect, useState, useMemo } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Generate deterministic rotation values based on index to avoid hydration mismatch
  const rotationValues = useMemo(() => {
    return testimonials.map((_, index) => {
      // Use a deterministic seed based on index to generate consistent values
      const seed = index * 7 + 13;
      return ((seed % 21) - 10);
    });
  }, [testimonials]);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (autoplay && mounted) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, mounted]);

  const getRotateY = (index: number) => {
    return rotationValues[index] || 0;
  };
  if (!mounted) {
    // Return a static version during SSR to avoid hydration mismatch
    return (
      <div className="w-full">
        <div className="relative grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-2 items-start">
          {/* Image Container */}
          <div className="relative w-full lg:max-w-md">
            <div className="relative aspect-[3/4] w-full">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={testimonials[0]?.src}
                  alt={testimonials[0]?.name}
                  width={500}
                  height={667}
                  draggable={false}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              {/* Layered effect */}
              <div className="absolute -right-4 -bottom-4 w-full h-full rounded-2xl bg-primary/10 -z-10 blur-xl" />
            </div>
          </div>

          {/* Text Card */}
          <div className="flex flex-col justify-between min-h-[400px] lg:min-h-[500px]">
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {testimonials[0]?.name}
                </h3>
                <p className="text-base text-muted-foreground">
                  {testimonials[0]?.designation}
                </p>
              </div>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {testimonials[0]?.quote}
              </p>
            </div>
            <div className="flex gap-3 pt-8">
              <button className="group/button flex h-10 w-10 items-center justify-center rounded-full glass hover:neon-glow transition-all">
                <IconArrowLeft className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:translate-x-[-2px]" />
              </button>
              <button className="group/button flex h-10 w-10 items-center justify-center rounded-full glass hover:neon-glow transition-all">
                <IconArrowRight className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:translate-x-[2px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-2 items-start">
        {/* Image Container */}
        <div className="relative w-full lg:max-w-md">
          <div className="relative aspect-[3/4] w-full">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.src}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    x: -20,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0,
                    scale: isActive(index) ? 1 : 0.95,
                    x: isActive(index) ? 0 : -20,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    x: 20,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={667}
                      draggable={false}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  {/* Layered effect */}
                  {isActive(index) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -right-4 -bottom-4 w-full h-full rounded-2xl bg-primary/10 -z-10 blur-xl"
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Text Card */}
        <div className="flex flex-col justify-between min-h-[400px] lg:min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {testimonials[active].name}
                </h3>
                <p className="text-base text-muted-foreground">
                  {testimonials[active].designation}
                </p>
              </div>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {testimonials[active].quote}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 pt-8">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full glass hover:neon-glow transition-all"
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:translate-x-[-2px]" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full glass hover:neon-glow transition-all"
              aria-label="Next testimonial"
            >
              <IconArrowRight className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:translate-x-[2px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
