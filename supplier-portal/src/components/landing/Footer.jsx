import React from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook, Linkedin, Twitter, Phone, Mail, MapPin, Clock, Heart,
} from 'lucide-react'
import Logo from '../ui/Logo'

const quickLinks = [
  { label: 'Register as Supplier', to: '/register/step-1' },
  { label: 'Login to Portal', to: '/register/step-1' },
  { label: 'Check Application Status', to: '/register/step-6' },
  { label: 'Download Checklist', to: '/register/step-5' },
  { label: 'Contact Support', href: '#contact' },
]

const infoLinks = [
  'About the Program',
  'Supply Categories',
  'Evaluation Criteria',
  'Supplier Code of Conduct',
  'Privacy Policy',
  'Terms & Conditions',
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-primary-dark text-white">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company */}
        <div>
          <Logo dark size="sm" />
          <p className="mt-5 text-[14px] text-white/60 leading-relaxed">
            Connecting Sri Lankan businesses with trusted procurement
            opportunities since 2005. Your reliable partner for supplier
            registration and vendor management.
          </p>
          <div className="mt-5 flex gap-2.5">
            {[Facebook, Linkedin, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media link"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-accent hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-white/40">© 2024 [Company Name]. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-semibold text-white text-[16px] mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((l) =>
              l.to ? (
                <li key={l.label}>
                  <Link to={l.to} className="text-[14px] text-white/60 hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.label}>
                  <a href={l.href} className="text-[14px] text-white/60 hover:text-accent transition-colors">
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-heading font-semibold text-white text-[16px] mb-5">Information</h3>
          <ul className="space-y-3">
            {infoLinks.map((l) => (
              <li key={l}>
                <a href="#" className="text-[14px] text-white/60 hover:text-accent transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading font-semibold text-white text-[16px] mb-5">Contact</h3>
          <ul className="space-y-3.5 text-[14px] text-white/60">
            <li className="flex items-start gap-3">
              <Phone size={17} className="text-accent shrink-0 mt-0.5" />
              <span>+94 11 XXX XXXX</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={17} className="text-accent shrink-0 mt-0.5" />
              <span>suppliers@company.lk</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={17} className="text-accent shrink-0 mt-0.5" />
              <span>123 Main Street,<br />Colombo 03, Sri Lanka</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={17} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white/80">Helpdesk Hours</p>
                <p>Mon–Fri: 8:30 AM – 5:00 PM</p>
                <p>Sat: 9:00 AM – 1:00 PM</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/40">
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Sitemap</a>
          </div>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart size={14} className="text-accent" fill="currentColor" /> in Sri Lanka 🇱🇰
          </p>
        </div>
      </div>
    </footer>
  )
}
