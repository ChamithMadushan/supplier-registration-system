import React from 'react'

const appStatus = {
  new: { label: 'NEW', bg: 'bg-info-light text-info', dot: 'bg-info' },
  screening: { label: 'SCREENING', bg: 'bg-purple-light text-purple', dot: 'bg-purple' },
  verification: { label: 'VERIFYING', bg: 'bg-warning-light text-warning-dark', dot: 'bg-warning' },
  evaluation: { label: 'EVALUATING', bg: 'bg-accent/15 text-accent-hover', dot: 'bg-accent' },
  ready: { label: 'READY TO APPROVE', bg: 'bg-info-light text-info', dot: 'bg-info' },
  approved: { label: 'APPROVED', bg: 'bg-success-light text-success-dark', dot: 'bg-success' },
  conditional: { label: 'CONDITIONAL', bg: 'bg-teal-light text-teal', dot: 'bg-teal' },
  probationary: { label: 'PROBATIONARY', bg: 'bg-[#E9ECEF] text-[#6C757D]', dot: 'bg-[#6C757D]' },
  suspended: { label: 'SUSPENDED', bg: 'bg-danger-light text-danger-dark', dot: 'bg-danger' },
  blacklisted: { label: 'BLACKLISTED', bg: 'bg-[#DEE2E6] text-[#212529]', dot: 'bg-[#212529]' },
  rejected: { label: 'REJECTED', bg: 'bg-danger-light text-danger-dark', dot: 'bg-danger' },
}

export function AppStatusBadge({ status, dot = true }) {
  const s = appStatus[status] || { label: status, bg: 'bg-table-header text-admin-medium', dot: 'bg-admin-muted' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${s.bg}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {s.label}
    </span>
  )
}

const supplierStatus = {
  strategic: { label: '⭐ STRATEGIC', bg: 'bg-accent/15 text-accent-hover' },
  preferred: { label: '🟢 PREFERRED', bg: 'bg-success-light text-success-dark' },
  approved: { label: '✅ APPROVED', bg: 'bg-info-light text-info' },
  conditional: { label: '⚠️ CONDITIONAL', bg: 'bg-warning-light text-warning-dark' },
  probationary: { label: '🔄 PROBATIONARY', bg: 'bg-[#E9ECEF] text-[#6C757D]' },
  suspended: { label: '❌ SUSPENDED', bg: 'bg-danger-light text-danger-dark' },
}

export function SupplierStatusBadge({ status }) {
  const s = supplierStatus[status] || { label: status, bg: 'bg-table-header text-admin-medium' }
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${s.bg}`}>{s.label}</span>
}

const priorities = {
  critical: { label: 'Critical', color: 'text-danger', bg: 'bg-danger-light', dot: 'bg-danger' },
  high: { label: 'High', color: 'text-accent-hover', bg: 'bg-accent/15', dot: 'bg-accent' },
  medium: { label: 'Medium', color: 'text-warning-dark', bg: 'bg-warning-light', dot: 'bg-warning' },
  low: { label: 'Low', color: 'text-success-dark', bg: 'bg-success-light', dot: 'bg-success' },
}

export function PriorityBadge({ priority, pill = true }) {
  const p = priorities[priority] || { label: priority, color: 'text-admin-medium', bg: 'bg-table-header', dot: 'bg-admin-muted' }
  if (!pill) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${p.color}`}>
        <span className={`w-2 h-2 rounded-full ${p.dot}`} /> {p.label}
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${p.bg} ${p.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} /> {p.label}
    </span>
  )
}

const docStatus = {
  pending: { label: '⏳ Pending Review', bg: 'bg-table-header text-admin-medium' },
  review: { label: '🔄 Under Review', bg: 'bg-info-light text-info' },
  accepted: { label: '✅ Accepted', bg: 'bg-success-light text-success-dark' },
  rejected: { label: '❌ Rejected', bg: 'bg-danger-light text-danger-dark' },
  reupload: { label: '🔄 Re-upload Requested', bg: 'bg-accent/15 text-accent-hover' },
}

export function DocStatusBadge({ status }) {
  const s = docStatus[status] || { label: status, bg: 'bg-table-header text-admin-medium' }
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${s.bg}`}>{s.label}</span>
}

export const actionColors = {
  create: 'bg-success-light text-success-dark',
  view: 'bg-info-light text-info',
  update: 'bg-warning-light text-warning-dark',
  delete: 'bg-danger-light text-danger-dark',
  approve: 'bg-accent/15 text-accent-hover',
  login: 'bg-[#E9ECEF] text-[#495057]',
  security: 'bg-danger-light text-danger-dark',
}
