import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  footer,
  closeOnOverlay = true,
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 'max-w-[480px]', md: 'max-w-[640px]', lg: 'max-w-[800px]' }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[4px]"
      onMouseDown={() => closeOnOverlay && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${widths[size]} bg-white rounded-[16px] shadow-[var(--shadow-modal)] anim-modal-in flex flex-col max-h-[90vh]`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-line-soft">
            <div>
              <h3 className="text-[20px] font-semibold font-heading text-ink">{title}</h3>
              {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-ink-muted hover:bg-surface hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-line-soft flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
