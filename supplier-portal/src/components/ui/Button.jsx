import React from 'react'

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-hover shadow-[0_4px_12px_rgba(241,143,1,0.3)] hover:shadow-[0_6px_16px_rgba(241,143,1,0.4)]',
  secondary:
    'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
  white:
    'bg-white text-primary hover:bg-primary-light hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]',
  outlineWhite:
    'bg-transparent text-white border-2 border-white/70 hover:bg-white/10',
  danger: 'bg-danger text-white hover:bg-danger/85 shadow-[0_4px_12px_rgba(220,53,69,0.3)]',
  ghost:
    'bg-transparent text-ink-muted border border-line hover:bg-surface hover:text-ink',
  navy: 'bg-primary text-white hover:bg-primary-light shadow-[0_4px_12px_rgba(30,58,95,0.3)]',
}

const sizes = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-[15px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}) {
  const disabledStyle = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none'
    : ''
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-[8px] transition-all duration-200 ease hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 ${variants[variant]} ${sizes[size]} ${disabledStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
