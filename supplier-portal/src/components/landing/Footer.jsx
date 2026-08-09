import React from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook, Linkedin, Twitter, Phone, Mail, MapPin, Clock, Heart,
} from 'lucide-react'
import Logo from '../ui/Logo'
import { usePrivacyPolicy } from './PrivacyPolicy'
import { useTerms } from './TermsOfService'
import { useSitemap } from './Sitemap'
import { useLanguage } from '../../i18n/LanguageContext'

const quickHrefs = ['/register/step-1', '/register/step-1', '/register/step-6', '/register/step-5', '#contact']

export default function Footer() {
  const { t } = useLanguage()
  const { openPrivacyPolicy } = usePrivacyPolicy()
  const { openTerms } = useTerms()
  const { openSitemap } = useSitemap()
  const quickLinks = t('footer.quick')
  const infoLinks = t('footer.info')
  const isPrivacy = (label) => label === infoLinks[4]
  const isTerms = (label) => label === infoLinks[5]
  return (
    <footer id="contact" className="relative lp-bg-deep text-white">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[320px] lp-aurora-orange opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company */}
        <div>
          <Logo dark size="sm" brand="VENDIORA" />
          <p className="mt-5 text-[14px] text-white/60 leading-relaxed">
            {t('footer.about')}
          </p>
          <div className="mt-5 flex gap-2.5">
            {[Facebook, Linkedin, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={t('footer.social')}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-accent hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-white/40">{t('footer.copyright')}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-semibold text-white text-[16px] mb-5">{t('footer.quickTitle')}</h3>
          <ul className="space-y-3">
            {quickLinks.map((label, i) => (
              <li key={label}>
                <Link to={quickHrefs[i]} className="text-[14px] text-white/60 hover:text-accent transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-heading font-semibold text-white text-[16px] mb-5">{t('footer.infoTitle')}</h3>
          <ul className="space-y-3">
            {infoLinks.map((label, i) => (
              <li key={label}>
                {isPrivacy(label) ? (
                  <button
                    onClick={openPrivacyPolicy}
                    className="text-[14px] text-white/60 hover:text-accent transition-colors"
                  >
                    {label}
                  </button>
                ) : isTerms(label) ? (
                  <button
                    onClick={openTerms}
                    className="text-[14px] text-white/60 hover:text-accent transition-colors"
                  >
                    {label}
                  </button>
                ) : (
                  <a href="#" className="text-[14px] text-white/60 hover:text-accent transition-colors">
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading font-semibold text-white text-[16px] mb-5">{t('footer.contactTitle')}</h3>
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
                <p className="font-semibold text-white/80">{t('footer.helpdesk')}</p>
                <p>{t('footer.monFri')}</p>
                <p>{t('footer.sat')}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/40">
          <div className="flex gap-6">
            <button onClick={openPrivacyPolicy} className="hover:text-accent transition-colors">{t('footer.info')[4]}</button>
            <button onClick={openTerms} className="hover:text-accent transition-colors">{t('footer.info')[5]}</button>
            <button onClick={openSitemap} className="hover:text-accent transition-colors">{t('sitemap.title')}</button>
          </div>
          <p className="inline-flex items-center gap-1.5">
            {t('footer.madeWith')} <Heart size={14} className="text-accent" fill="currentColor" /> {t('footer.inSriLanka')} 🇱🇰
          </p>
        </div>
      </div>
    </footer>
  )
}
