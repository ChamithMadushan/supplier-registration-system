import React from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import TrustMarquee from '../components/landing/TrustMarquee'
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
import PrivacyPolicyProvider from '../components/landing/PrivacyPolicy'
import TermsProvider from '../components/landing/TermsOfService'
import SitemapProvider from '../components/landing/Sitemap'
import LanguageProvider from '../i18n/LanguageContext'

export default function Landing() {
  return (
    <LanguageProvider>
      <PrivacyPolicyProvider>
        <TermsProvider>
          <SitemapProvider>
            <div className="lp-bg-base min-h-screen pb-[76px] lg:pb-0 antialiased">
              <Navbar />
              <Hero />
              <TrustMarquee />
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
          </SitemapProvider>
        </TermsProvider>
      </PrivacyPolicyProvider>
    </LanguageProvider>
  )
}
