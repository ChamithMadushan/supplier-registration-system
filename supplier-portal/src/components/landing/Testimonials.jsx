import React from 'react'
import { Star, Quote } from 'lucide-react'
import Reveal from '../ui/Reveal'

const testimonials = [
  {
    quote:
      'The registration process was very smooth and transparent. We were approved within 20 days.',
    name: 'Managing Director',
    company: 'ABC Trading (Pvt) Ltd',
    initials: 'AT',
  },
  {
    quote: 'The online portal made it so easy to submit documents. Great system!',
    name: 'CEO',
    company: 'XYZ Supplies Pvt Ltd',
    initials: 'XS',
  },
  {
    quote:
      'Excellent communication throughout the process. Highly professional team.',
    name: 'Director',
    company: 'DEF Services Ltd',
    initials: 'DS',
  },
]

function TestimonialCard({ t, active }) {
  return (
    <div
      className={`h-full bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-8 relative transition-all duration-300 ${
        active ? 'ring-2 ring-accent/40' : ''
      }`}
    >
      <Quote size={44} className="absolute top-6 right-6 text-accent/15" fill="currentColor" />
      <div className="flex gap-1 text-warning">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={17} fill="currentColor" />
        ))}
      </div>
      <p className="mt-5 text-[15px] text-ink leading-relaxed">"{t.quote}"</p>
      <div className="mt-6 flex items-center gap-3.5">
        <span className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-heading font-bold text-sm">
          {t.initials}
        </span>
        <div>
          <p className="font-semibold text-sm text-ink">{t.name}</p>
          <p className="text-[13px] text-accent font-medium">{t.company}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Supplier Stories
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-ink">
            What Our Suppliers Say
          </h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.company} delay={i * 100}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
