import React from 'react'

const statusStyles = {
  approved: 'bg-success-light text-success-dark',
  pending: 'bg-warning-light text-warning-dark',
  rejected: 'bg-danger-light text-danger-dark',
  new: 'bg-info-light text-info-dark',
  processing: 'bg-process text-process-dark',
  uploaded: 'bg-success-light text-success-dark',
  error: 'bg-danger-light text-danger-dark',
  info: 'bg-info-light text-info-dark',
}

export default function Badge({ status = 'info', children, className = '', icon: Icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusStyles[status] || statusStyles.info} ${className}`}
    >
      {Icon && <Icon size={13} strokeWidth={2.5} />}
      {children}
    </span>
  )
}
