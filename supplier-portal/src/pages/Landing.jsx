import React from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Stats from '../components/landing/Stats'
import HowItWorks from '../components/landing/HowItWorks'
import Procure from '../components/landing/Procure'
import Requirements from '../components/landing/Requirements'
import Journey from '../components/landing/Journey'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTABanner from '../components/landing/CTABanner'
import Footer from '../components/landing/Footer'
import { WhatsAppButton, BackToTop, CookieConsent, MobileCTABar } from '../components/landing/Floating'

export default function Landing() {
  return (
    <div className="bg-white min-h-screen pb-[76px] lg:pb-0">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Procure />
      <Requirements />
      <Journey />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <CookieConsent />
      <MobileCTABar />
    </div>
  )
}
