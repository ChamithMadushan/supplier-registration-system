import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Reveal from '../ui/Reveal'

const faqs = [
  {
    q: 'How long does registration take?',
    a: 'The full review process takes 15–25 working days from the date of submission. Simple applications with complete documents can be processed faster.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No. Registration is completely free. There are no hidden fees at any stage of the registration or evaluation process.',
  },
  {
    q: 'What documents are required?',
    a: 'You need your business registration certificate, VAT/TIN documents, audited financial statements, bank reference letter, and company profile. Download the full checklist from the Requirements section.',
  },
  {
    q: 'Can I apply from outside Colombo?',
    a: 'Yes, we accept applications from suppliers across the entire country. Our portal is fully online and you can complete everything remotely.',
  },
  {
    q: 'How will I know if I\u2019m approved?',
    a: 'You will receive an email notification and can also track your application status in real time through the portal dashboard.',
  },
  {
    q: 'Can I register for multiple categories?',
    a: 'Yes, you can select multiple supply categories during Step 3 of registration. This helps us invite you to relevant tenders.',
  },
  {
    q: 'What if my application is rejected?',
    a: 'We will clearly explain the reasons for rejection. Most issues can be resolved by correcting documents, and you may reapply after 30 days.',
  },
  {
    q: 'How do I renew my registration?',
    a: 'Registration is valid for one year. An annual renewal notice is sent to your registered email, and renewal takes about 5 working days.',
  },
  {
    q: 'Is my information confidential?',
    a: 'Yes, all information you provide is fully confidential and protected with 256-bit SSL encryption. We never share your data with third parties.',
  },
  {
    q: 'How do I update my information?',
    a: 'Login to your portal and submit a change request. Minor changes are updated automatically; major changes may require re-verification.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[860px] px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Need Help?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-heading text-ink">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const open = openIdx === i
            return (
              <Reveal key={f.q} delay={Math.min(i * 40, 300)}>
                <div className="bg-white rounded-[12px] border border-line-soft overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 px-5 sm:px-6 py-4.5 text-left hover:bg-surface/50 transition-colors"
                    onClick={() => setOpenIdx(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        open ? 'bg-accent text-white' : 'bg-surface text-ink-muted'
                      }`}
                    >
                      {open ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                    <span className={`font-semibold text-[15px] flex-1 ${open ? 'text-accent-hover' : 'text-ink'}`}>
                      {f.q}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                    style={{ maxHeight: open ? 400 : 0 }}
                  >
                    <p className="px-5 sm:px-6 pb-5 pl-[60px] sm:pl-[68px] text-[14px] text-ink-muted leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                  <div className="mx-5 sm:mx-6 border-t border-line-soft" />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
