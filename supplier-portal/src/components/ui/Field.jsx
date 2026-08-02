import React from 'react'

const stateBorder = {
  default: 'border-line focus:border-secondary focus:shadow-[var(--shadow-input)]',
  valid: 'border-success focus:border-success focus:shadow-[0_0_0_3px_rgba(40,167,69,0.15)]',
  error: 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(220,53,69,0.15)]',
}

export default function Field({
  label,
  required,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  rightIconLabel,
  helper,
  error,
  valid,
  state,
  placeholder,
  value,
  onChange,
  type = 'text',
  maxLength,
  prefix,
  as: Tag = 'input',
  className = '',
  wrapperClass = '',
  textareaRows,
  inputClassName = '',
  children,
  ...props
}) {
  const resolved =
    state || (error ? 'error' : valid ? 'valid' : 'default')
  const showError = error

  const baseInput = `w-full h-[48px] bg-white rounded-[8px] border-[1.5px] ${stateBorder[resolved]} px-4 text-sm text-ink placeholder:text-ink-faint transition-all duration-200 focus:outline-none ${Icon ? 'pl-[44px]' : ''} ${RightIcon || prefix ? 'pr-[44px]' : ''} ${className}`

  const inputProps = {
    placeholder,
    value,
    onChange,
    maxLength,
    type,
    'aria-invalid': !!error,
    'aria-required': required,
    ...props,
  }

  return (
    <div className={`${wrapperClass}`}>
      {label && (
        <label className="block text-[13px] font-semibold text-ink mb-1.5">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
              showError ? 'text-danger' : 'text-ink-faint'
            }`}
          >
            <Icon size={18} />
          </span>
        )}
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        {Tag === 'textarea' ? (
          <textarea
            rows={textareaRows || 4}
            className={`${baseInput} h-auto py-3 resize-y`}
            {...inputProps}
          />
        ) : Tag === 'select' ? (
          <select className={`${baseInput} cursor-pointer`} {...inputProps}>
            {children}
          </select>
        ) : (
          <input className={baseInput} {...inputProps} />
        )}
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            aria-label={rightIconLabel}
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              showError ? 'text-danger' : 'text-ink-muted'
            } hover:text-ink transition-colors`}
          >
            <RightIcon size={18} />
          </button>
        )}
        {valid && !showError && !RightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-success pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        )}
      </div>
      {helper && !showError && (
        <p className="mt-1.5 text-xs text-ink-muted">{helper}</p>
      )}
      {showError && (
        <p className="mt-1.5 text-xs font-medium text-danger anim-fade-up" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
