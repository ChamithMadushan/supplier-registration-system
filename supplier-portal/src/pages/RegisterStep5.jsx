import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Info, FileText, Wallet, Wrench, User, ClipboardList, ChevronDown,
  ArrowLeft, ArrowRight, Plus, X, Download, CheckCircle2,
} from 'lucide-react'
import RegistrationLayout from '../components/RegistrationLayout'
import DropZone, { UploadedRow } from '../components/upload/DropZone'
import UploadSummary from '../components/upload/UploadSummary'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { useSaveStep } from '../hooks/useSaveStep'

function Section({ letter, icon: Icon, title, meta, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] overflow-hidden">
      <button
        className="w-full flex items-center gap-3.5 px-5 sm:px-6 py-4 text-left hover:bg-surface/50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="w-9 h-9 rounded-[10px] bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <Icon size={18} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-[15px] text-ink">[{letter}] {title}</span>
          <span className="block text-xs text-ink-muted">{meta}</span>
        </span>
        <ChevronDown size={18} className={`text-ink-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-line-soft space-y-5 anim-fade-in">{children}</div>}
    </div>
  )
}

export default function RegisterStep5() {
  const navigate = useNavigate()
  const { save, saving, error } = useSaveStep(5)
  const [preview, setPreview] = useState(null)
  const [toast, setToast] = useState(null)
  const [noQuality, setNoQuality] = useState(false)

  const uploaded = 8
  const required = 12
  const rejected = 1
  const ready = uploaded === required

  const showToast = (message, type = 'success') => setToast({ message, type })

  return (
    <RegistrationLayout
      activeStep={5}
      title="Upload Documents"
      subtitle="Step 5 of 6 - Upload all required documents"
      progress={83}
      crumb="Step 5: Documents"
    >
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        size="lg"
        title="Document Preview"
        subtitle={preview?.name}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Close</Button>
            <Button variant="primary" size="sm" onClick={() => showToast('Download started')}>
              <Download size={15} /> Download
            </Button>
          </>
        }
      >
        <div className="rounded-[12px] bg-surface border border-line-soft flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <FileText size={44} className="mx-auto text-ink-faint" />
            <p className="mt-3 text-sm font-medium text-ink-muted">PDF / Image preview renderer</p>
            <p className="text-xs text-ink-faint mt-1">Zoom controls & page navigation would appear here</p>
          </div>
        </div>
      </Modal>

      {/* Guidelines */}
      <div className="mb-6 rounded-[16px] bg-primary text-white p-5 sm:p-6 flex gap-4">
        <Info size={22} className="text-accent shrink-0 mt-0.5" />
        <div>
          <h2 className="font-heading font-semibold text-[16px] mb-2">Upload Guidelines</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-[13px] text-white/80">
            <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Accepted: PDF, JPG, PNG, DOC, XLSX</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Max size: 10MB per file</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Files must be clear and legible</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Documents must be valid, not expired</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Upload certified copies where required</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main uploads */}
        <div className="space-y-5">
          <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-5 sm:p-6">
            <p className="text-sm font-semibold text-ink mb-1.5">Overall Progress</p>
            <div className="h-2.5 bg-[#E9ECEF] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover" style={{ width: '67%' }} />
            </div>
            <p className="mt-2 text-xs font-bold text-accent-hover">Documents: 8 of 12 uploaded (67%)</p>
          </div>

          <Section
            letter="A" icon={FileText} title="Legal Documents" defaultOpen
            meta="4 of 4 required"
          >
            <UploadedRow name="BizReg_Certificate.pdf" size="2.3 MB" uploadedAt="15 Jan 2025, 10:30 AM" onPreview={() => setPreview({ name: 'BizReg_Certificate.pdf' })} />
            <DropZone label="Certificate of Incorporation" required note="For companies - Private/Public Ltd" onPreview={(f) => setPreview(f)} />
            <div className="rounded-[12px] border-2 border-danger/40 bg-danger-light/30 p-4">
              <p className="text-[13px] font-semibold text-ink mb-1.5">VAT Registration Certificate</p>
              <p className="text-xs text-danger-dark mb-3 flex items-start gap-1">
                <X size={14} className="shrink-0 mt-0.5" />
                Rejection Reason: "Document is not readable. Please upload a clear, high-resolution copy."
              </p>
              <DropZone required />
            </div>
            <DropZone label="Tax Clearance Certificate" required note="Must be issued within last 3 months" />
          </Section>

          <Section
            letter="B" icon={Wallet} title="Financial Documents"
            meta="3 of 4 required"
          >
            <div>
              <p className="text-[13px] font-semibold text-ink mb-2">Audited Financial Statements <span className="text-danger">*</span></p>
              <p className="text-xs text-ink-muted mb-3 flex items-start gap-1"><Info size={13} className="shrink-0 mt-0.5" /> Upload 3 years separately OR as one PDF</p>
              <div className="space-y-2">
                <UploadedRow name="Audited_2022_2023.pdf" size="5.1 MB" uploadedAt="15 Jan 2025" />
                <UploadedRow name="Audited_2023_2024.pdf" size="4.8 MB" uploadedAt="15 Jan 2025" />
              </div>
              <div className="mt-3">
                <DropZone multiple />
              </div>
            </div>
            <DropZone label="Bank Reference Letter" required />
            <DropZone label="Bank Statement (6 months)" required note="Stamped and signed by bank" />
            <DropZone label="Insurance Certificates" multiple note="Upload all insurance policies" />
          </Section>

          <Section
            letter="C" icon={Wrench} title="Technical Documents"
            meta="2 of 3 required"
          >
            <DropZone label="Company Profile" required note="Include company overview, capabilities, clients" />
            <DropZone label="Organizational Chart" required note="Management structure chart" />
            <div>
              <DropZone label="Quality Certifications" multiple note="ISO, SLSI, or other quality certs" />
              <label className="mt-3 inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noQuality}
                  onChange={() => setNoQuality(!noQuality)}
                  className="w-4.5 h-4.5 accent-accent"
                />
                <span className="text-sm text-ink">I don't have quality certifications</span>
              </label>
            </div>
          </Section>

          <Section
            letter="D" icon={User} title="Director / Partner ID Documents"
            meta="Upload ID for each Director/Partner/Proprietor"
          >
            <div className="rounded-[12px] border border-line-soft p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-sm text-ink">Director 1</p>
                <span className="text-xs text-ink-muted">Kamal Perera • NIC 851234567V</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DropZone label="ID Copy - Front Side" required />
                <DropZone label="ID Copy - Back Side" required />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => showToast('Director form added')}>
              <Plus size={15} /> Add Another Director/Partner
            </Button>
          </Section>

          <Section
            letter="E" icon={ClipboardList} title="Company Policy Documents"
            meta="Health & Safety, Environmental, Anti-Bribery"
          >
            {['Health & Safety Policy', 'Environmental Policy', 'Anti-Bribery Policy'].map((p, i) => (
              <div key={p} className="rounded-[12px] border border-line-soft p-4">
                <p className="text-[13px] font-semibold text-ink mb-3">
                  {p} {i !== 1 && <span className="text-danger">*</span>}
                </p>
                <div className="flex gap-5 text-[13px] text-ink-muted">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={p} className="accent-accent" /> Upload our policy
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={p} className="accent-accent" /> Use template
                  </label>
                </div>
              </div>
            ))}
            <div className="rounded-[12px] border-2 border-dashed border-line p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <Download size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Supplier Code of Conduct</p>
                  <p className="text-xs text-ink-muted">Download, sign and upload the signed copy</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => showToast('Code of Conduct downloaded')}>
                <Download size={15} /> Download and Sign
              </Button>
            </div>
            <DropZone label="Upload Signed Copy" required />
          </Section>
        </div>

        {/* Summary sidebar */}
        <div className="lg:sticky lg:top-6 space-y-5">
          <UploadSummary uploaded={uploaded} required={required} rejected={rejected} />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-5 flex flex-col sm:flex-row justify-between gap-4">
        <Button variant="ghost" onClick={() => navigate('/register/step-4')}>
          <ArrowLeft size={17} /> Back
        </Button>
        <Button
          variant="primary"
          disabled={!ready || saving}
          onClick={() => {
            showToast(ready ? 'All documents verified!' : 'Upload all mandatory documents first', ready ? 'success' : 'warning')
            if (ready) save({}, '/register/step-6')
          }}
        >
          {saving ? (
            <>
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : ready ? (
            <>Next: Review & Submit <ArrowRight size={17} /></>
          ) : (
            'Complete Mandatory Documents'
          )}
        </Button>
      </div>
    </RegistrationLayout>
  )
}
