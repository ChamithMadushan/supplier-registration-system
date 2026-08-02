import React from 'react'
import { FileText, MailCheck, Search, FileCheck2, Cpu, Users, BellRing, PartyPopper } from 'lucide-react'
import Reveal from '../ui/Reveal'

const journey = [
  { day: 'Day 1', title: 'Submit application online', icon: FileText, color: 'bg-accent' },
  { day: 'Day 3', title: 'Receive acknowledgment', icon: MailCheck, color: 'bg-secondary' },
  { day: 'Day 5', title: 'Initial screening complete', icon: Search, color: 'bg-info' },
  { day: 'Day 10', title: 'Document verification done', icon: FileCheck2, color: 'bg-success' },
  { day: 'Day 15', title: 'Technical evaluation done', icon: Cpu, color: 'bg-warning' },
  { day: 'Day 20', title: 'Committee review', icon: Users, color: 'bg-danger' },
  { day: 'Day 25', title: 'Decision notification', icon: BellRing, color: 'bg-secondary' },
  { day: 'Day 30', title: 'Welcome as approved supplier', icon: PartyPopper, color: 'bg-success' },
]

export default function Journey() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Transparent Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-ink">
            Your Journey with Us
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted">
            Every step is tracked and communicated clearly
          </p>
        </Reveal>

        <div className="relative mt-16 mx-auto max-w-3xl">
          {/* center line */}
          <div className="absolute left-[22px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-secondary to-success rounded-full" />

          <div className="space-y-10">
            {journey.map((j, i) => {
              const left = i % 2 === 0
              return (
                <Reveal key={j.day} delay={i * 60}>
                  <div className={`relative flex items-center ${left ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-6 sm:gap-0`}>
                    {/* node */}
                    <div className={`absolute left-[22px] sm:left-1/2 -translate-x-1/2 z-10`}>
                      <span className={`w-11 h-11 rounded-full ${j.color} text-white flex items-center justify-center shadow-lg`}>
                        <j.icon size={20} />
                      </span>
                    </div>
                    <div className={`w-full sm:w-1/2 ${left ? 'sm:pr-14' : 'sm:pl-14'}`}>
                      <div className={`ml-16 sm:ml-0 ${left ? '' : 'sm:text-right'}`}>
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent-hover text-xs font-bold uppercase tracking-wide">
                          {j.day}
                        </span>
                        <h3 className="mt-2 font-semibold text-[16px] text-ink">{j.title}</h3>
                        <p className="mt-1 text-[13px] text-ink-muted">
                          {left ? 'We begin processing your application.' : 'Status updates shared via email & SMS.'}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
