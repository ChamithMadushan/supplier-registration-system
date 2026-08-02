import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'

const categories = [
  { emoji: '🏭', title: 'Raw Materials', subs: 'Steel • Cement • Chemicals', count: 45 },
  { emoji: '💻', title: 'IT & Technology', subs: 'Hardware • Software • Networking', count: 38 },
  { emoji: '🔧', title: 'Technical Services', subs: 'Repair • Maintenance • Install', count: 52 },
  { emoji: '🚚', title: 'Logistics & Transport', subs: 'Freight • Fleet • Courier', count: 28 },
  { emoji: '🏗️', title: 'Construction Services', subs: 'Civil • Electrical • Plumbing', count: 35 },
  { emoji: '🧹', title: 'General Services', subs: 'Cleaning • Security • Catering', count: 41 },
  { emoji: '👔', title: 'Professional Services', subs: 'Legal • Audit • Consulting', count: 29 },
  { emoji: '⚡', title: 'Utilities & Energy', subs: 'Solar • Generators • Fuel', count: 18 },
  { emoji: '🖨️', title: 'Office & Stationery', subs: 'Supplies • Equipment • Print', count: 33 },
  { emoji: '🚗', title: 'Vehicles & Equipment', subs: 'Fleet • Spare Parts • Tyres', count: 22 },
  { emoji: '🏥', title: 'Safety & Uniforms', subs: 'PPE • Uniforms • Medical', count: 19 },
  { emoji: '🌿', title: 'Environment Services', subs: 'Waste • Landscaping • Audit', count: 15 },
]

export default function Procure() {
  return (
    <section id="categories" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Our Categories
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-ink">What We Procure</h2>
          <p className="mt-3 text-[16px] text-ink-muted">
            We source across 12 major categories for our operations
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 70}>
              <Link
                to="/register/step-1"
                className="group block h-full bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] p-6 transition-all duration-200 hover:border-accent hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1.5"
              >
                <span className="w-14 h-14 rounded-[12px] bg-surface group-hover:bg-accent/10 flex items-center justify-center text-[28px] transition-colors">
                  <span aria-hidden>{c.emoji}</span>
                </span>
                <h3 className="mt-4 font-semibold text-[16px] text-ink group-hover:text-accent-hover transition-colors">
                  {c.title}
                </h3>
                <p className="mt-1 text-[13px] text-ink-muted">{c.subs}</p>
                <p className="mt-3 text-[13px] font-bold text-accent">{c.count} suppliers</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
