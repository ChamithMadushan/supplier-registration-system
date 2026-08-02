import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PhoneCall, Check } from 'lucide-react'
import Reveal from '../ui/Reveal'

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-accent to-accent-hover py-16 sm:py-20">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 30%, #fff 2px, transparent 2px), radial-gradient(circle at 85% 70%, #fff 2px, transparent 2px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="relative mx-auto max-w-[900px] px-4 sm:px-6 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-[40px] font-bold font-heading text-white leading-tight">
            Ready to Join Our Supplier Network?
          </h2>
          <p className="mt-4 text-white/90 text-[16px] sm:text-[17px]">
            Start your application today. It takes less than 30 minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register/step-1"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[8px] bg-white text-accent-hover font-semibold text-[15px] shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Register as Supplier <ArrowRight size={18} />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[8px] border-2 border-white text-white font-semibold text-[15px] hover:bg-white/10 transition-all duration-200"
            >
              <PhoneCall size={18} /> Talk to Us First
            </a>
          </div>
          <p className="mt-7 flex items-center justify-center gap-2 text-[13px] text-white/85">
            <Check size={15} /> Free to register <span className="text-white/50">•</span> No hidden fees{' '}
            <span className="text-white/50">•</span> Cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  )
}
