import React, { useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Accordion({
  title,
  icon: Icon,
  subtitle,
  meta,
  defaultOpen = false,
  children,
  activeColor = 'text-accent',
}) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    if (open && bodyRef.current) setHeight(bodyRef.current.scrollHeight)
  }, [open, children])

  return (
    <div className="bg-white rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface/60"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {Icon && (
          <span className={`${open ? activeColor : 'text-ink-muted'}`}>
            <Icon size={20} />
          </span>
        )}
        <span className="flex-1">
          <span className="block font-semibold text-[15px] text-ink">{title}</span>
          {subtitle && <span className="block text-xs text-ink-muted mt-0.5">{subtitle}</span>}
        </span>
        {meta}
        <ChevronDown
          size={20}
          className={`text-ink-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        ref={bodyRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: open ? height : 0 }}
      >
        <div className="px-5 pb-5 pt-1 border-t border-line-soft">{children}</div>
      </div>
    </div>
  )
}
