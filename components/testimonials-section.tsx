"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LFDTBadge } from "@/components/ui/lfdt-badge"
import Image from "next/image"
import testimonialsData from "@/data/testimonials.json"

const testimonials = testimonialsData

// Function to render testimonial quote with LFDT badges
const renderQuoteWithLFDTBadges = (quote: string) => {
  const parts = quote.split(/(LFDT|Linux Foundation Decentralized Trust)/gi)
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === 'lfdt' || part.toLowerCase() === 'linux foundation decentralized trust') {
      return <LFDTBadge key={index} variant="inline" className="mx-1" />
    }
    return part
  })
}

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance testimonials every 5 seconds
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextTestimonial()
      }, 5000) // 5 seconds

      return () => clearInterval(interval)
    }
  }, [isPaused])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 pt-4 md:pt-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.3]">
            What the community says
            <br />
            about <span className="bg-[#2F81F7] text-white px-3 py-1 inline-block">GitMesh CE</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto pb-8">
            Hear from developers, engineering managers, and teams who are using GitMesh Community Edition to streamline their development workflows.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative">
            <div 
              className="bg-white border-4 border-black rounded-3xl py-8 md:py-14 px-6 md:px-8 md:pr-72 lg:pr-72"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute -top-6 md:-top-8 left-6 md:left-8 w-12 h-12 md:w-16 md:h-16">
                <Image
                  src="/images/633b1c81e34cfb82b85454eb-quote-s.png"
                  alt="Quote"
                  width={64}
                  height={64}
                  className="w-full h-full"
                />
              </div>

              <div className="md:max-w-[65%]">
                <p className="text-sm md:text-base lg:text-lg mb-6 leading-relaxed">
                  {renderQuoteWithLFDTBadges(currentTestimonial.quote)}
                </p>

                <div>
                  <div className="font-bold text-base md:text-lg">{currentTestimonial.author}</div>
                  <div className="text-gray-600 text-sm md:text-base">{currentTestimonial.role}</div>
                </div>
              </div>
            </div>

            <div 
              className="absolute -right-20 top-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full overflow-hidden hidden lg:block border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Image
                src={currentTestimonial.avatar}
                alt={currentTestimonial.author}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                prevTestimonial()
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 3000) // Resume after 3 seconds
              }}
              className="border-2 border-black hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsPaused(true)
                    setTimeout(() => setIsPaused(false), 3000) // Resume after 3 seconds
                  }}
                  className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${
                    index === currentIndex ? 'bg-black' : 'bg-white'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                nextTestimonial()
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 3000) // Resume after 3 seconds
              }}
              className="border-2 border-black hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
