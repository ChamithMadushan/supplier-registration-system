import React, { useState } from 'react'
import {
  Settings as SettingsIcon, Building2, ListChecks, Users, Bell, ShieldCheck, Save, Plus,
  ChevronDown, PencilLine, Trash2, KeyRound, RefreshCw, Server, Globe, Database, Eye, X,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'

const tabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'categories', label: 'Categories', icon: Building2 },
  { id: 'workflow', label: 'Approval Workflow', icon: ListChecks },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'notifications', label: 'Notification Settings', icon: Bell },
  { id: 'security', label: 'Security & Backup', icon: ShieldCheck },
]

const categories = [
  { id: 1, name: 'Raw Materials', active: true, suppliers: 122, products: '18' },
  { id: 2, name: 'IT & Technology', active: true, suppliers: 98, products: '24' },
  { id: 3, name: 'Services', active: true, suppliers: 88, products: '31' },
  { id: 4, name: 'Construction', active: true, suppliers: 73, products: '16' },
  { id: 5, name: 'Logistics', active: true, suppliers: 59, products: '12' },
  { id: 6, name: 'Food & Beverage', active: true, suppliers: 41, products: '9' },
  { id: 7, name: 'Healthcare', active: false, suppliers: 22, products: '7' },
  { id: 8, name: 'Education', active: false, suppliers: 15, products: '4' },
]

const users = [
  { id: 1, name: 'Kamal Perera', email: 'kamal@company.lk', role: 'Procurement Manager', status: 'active', last: 'Just now' },
  { id: 2, name: 'Anuja Dias', email: 'anuja@company.lk', role: 'Procurement Officer', status: 'active', last: '2h ago' },
  { id: 3, name: 'Saman Fernando', email: 'saman@company.lk', role: 'Verification Officer', status: 'active', last: 'Yesterday' },
  { id: 4, name: 'Nuwan Jay', email: 'nuwan@company.lk', role: 'System Admin', status: 'active', last: '3d ago' },
  { id: 5, name: 'Roshan Silva', email: 'roshan@company.lk', role: 'Procurement Officer', status: 'disabled', last: '12 Jan' },
]

function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-[42px] h-[24px] rounded-full transition-colors ${on ? 'bg-success' : 'bg-[#CBD5E0]'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${on ? 'left-[21px]' : 'left-[3px]'}`} />
    </button>
  )
}

export default function Settings() {
  const [tab, setTab] = useState('general')
  const [toast, setToast] = useState(null)

  return (
    <div>
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <PageHeader
        title="System Settings"
        subtitle="Configure the Supplier Registration System"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'System' }, { label: 'System Settings' }]}
        actions={
          <Button onClick={() => setToast({ type: 'success', message: 'Settings saved successfully' })}><Save size={15} /> Save Changes</Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-5 items-start">
        {/* Tab nav */}
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-3 xl:sticky xl:top-[76px]">
          <div className="flex gap-1 overflow-x-auto xl:flex-col">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[8px] text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  tab === t.id ? 'bg-primary text-white' : 'text-admin-medium hover:bg-table-header'
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0">
          {/* GENERAL */}
          {tab === 'general' && (
            <div className="space-y-5">
              <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-10 h-10 rounded-[10px] bg-accent/15 text-accent-hover flex items-center justify-center"><Globe size={18} /></span>
                  <div>
                    <p className="text-[15px] font-semibold font-heading text-admin-text">Organization Details</p>
                    <p className="text-[11px] text-admin-muted">Shown on all supplier-facing communications</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[['Organization Name', 'Company (Pvt) Ltd'], ['System Portal Name', 'Supplier Registration System'], ['Support Email', 'suppliers@company.lk'], ['Support Phone', '+94 11 234 5678'], ['Website', 'www.company.lk'], ['Address', '12 Corporate Drive, Colombo 02']].map(([l, v]) => (
                    <div key={l}>
                      <label className="block text-[12px] font-semibold text-admin-text mb-1.5">{l}</label>
                      <input defaultValue={v} className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border px-3 text-[13px] focus:border-primary focus:outline-none transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-10 h-10 rounded-[10px] bg-info-light text-info flex items-center justify-center"><Server size={18} /></span>
                  <div>
                    <p className="text-[15px] font-semibold font-heading text-admin-text">Registration Window</p>
                    <p className="text-[11px] text-admin-muted">Control when new applications are accepted</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-[10px] border border-admin-border px-4 py-3">
                    <div>
                      <p className="text-[13px] font-semibold text-admin-text">Accept New Registrations</p>
                      <p className="text-[11px] text-admin-muted">Allow suppliers to submit new applications</p>
                    </div>
                    <Toggle defaultOn />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-admin-text mb-1.5">Opening Date</label>
                      <input type="date" defaultValue="2025-01-01" className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border px-3 text-[13px] focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-admin-text mb-1.5">Closing Date</label>
                      <input type="date" defaultValue="2025-12-31" className="w-full h-[40px] rounded-[8px] border-[1.5px] border-admin-border px-3 text-[13px] focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {tab === 'categories' && (
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
                <div>
                  <p className="text-[15px] font-semibold font-heading text-admin-text">Supply Categories</p>
                  <p className="text-[11px] text-admin-muted">8 categories · 6 active</p>
                </div>
                <Button size="sm" onClick={() => setToast({ type: 'info', message: 'New category form' })}><Plus size={14} /> Add Category</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                      <th className="px-6 py-3">Category</th>
                      <th className="px-4 py-3">Suppliers</th>
                      <th className="px-4 py-3">Product Lines</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                        <td className="px-6 py-3.5">
                          <span className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-[9px] bg-table-header text-admin-medium flex items-center justify-center"><Building2 size={16} /></span>
                            <span className="text-[13px] font-semibold text-admin-text">{c.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-admin-medium">{c.suppliers}</td>
                        <td className="px-4 py-3.5 text-[12px] text-admin-medium">{c.products}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${c.active ? 'bg-success-light text-success-dark' : 'bg-table-header text-admin-muted'}`}>{c.active ? 'Active' : 'Disabled'}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setToast({ type: 'info', message: `Editing ${c.name}` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors" title="Edit"><PencilLine size={14} /></button>
                            <button onClick={() => setToast({ type: 'danger', message: `${c.name} deleted` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-danger-light hover:text-danger transition-colors" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WORKFLOW */}
          {tab === 'workflow' && (
            <div className="space-y-5">
              <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-[15px] font-semibold font-heading text-admin-text mb-5">Approval Stages</p>
                <div className="space-y-3">
                  {[
                    { stage: '1. Initial Screening', assignee: 'Procurement Officer', sla: '3 days', active: true },
                    { stage: '2. Document Verification', assignee: 'Verification Officer', sla: '5 days', active: true },
                    { stage: '3. Technical Evaluation', assignee: 'Evaluation Panel', sla: '7 days', active: true },
                    { stage: '4. Financial Review', assignee: 'Finance Division', sla: '5 days', active: true },
                    { stage: '5. Committee Review', assignee: 'Procurement Committee', sla: '3 days', active: true },
                    { stage: '6. Final Approval', assignee: 'Head of Procurement', sla: '2 days', active: true },
                  ].map((s) => (
                    <div key={s.stage} className="flex flex-wrap items-center gap-3 rounded-[10px] border border-admin-border px-4 py-3">
                      <span className="text-[13px] font-semibold text-admin-text flex-1 min-w-[180px]">{s.stage}</span>
                      <span className="text-[12px] text-admin-medium">Assignee: <span className="font-semibold text-admin-text">{s.assignee}</span></span>
                      <span className="text-[12px] text-admin-medium">SLA: <span className="font-mono font-bold text-admin-text">{s.sla}</span></span>
                      <Toggle defaultOn />
                      <button onClick={() => setToast({ type: 'info', message: `Editing ${s.stage}` })} className="w-7 h-7 rounded-[7px] flex items-center justify-center text-admin-medium hover:bg-info-light hover:text-info transition-colors"><PencilLine size={14} /></button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full h-[40px] rounded-[8px] border border-dashed border-admin-border-dark text-[12px] font-semibold text-admin-light hover:text-admin-text hover:border-secondary transition-colors">
                  + Add Stage
                </button>
              </div>
              <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-[15px] font-semibold font-heading text-admin-text mb-4">SLA & Escalation</p>
                <div className="space-y-4">
                  {[
                    ['Escalate when application exceeds SLA by', '2 days'],
                    ['Auto-reassign overdue to manager', 'Enabled'],
                    ['Notify committee of pending decisions', 'Enabled'],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between rounded-[10px] border border-admin-border px-4 py-3">
                      <span className="text-[13px] font-medium text-admin-text">{l}</span>
                      <div className="flex items-center gap-3">
                        <button className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium">{v} <ChevronDown size={13} className="text-admin-muted" /></button>
                        <Toggle defaultOn />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
                <div>
                  <p className="text-[15px] font-semibold font-heading text-admin-text">System Users</p>
                  <p className="text-[11px] text-admin-muted">5 users · 4 active</p>
                </div>
                <Button size="sm" onClick={() => setToast({ type: 'info', message: 'Invite user form' })}><Plus size={14} /> Invite User</Button>
              </div>
              <div className="divide-y divide-[#F0F0F0]">
                {users.map((u) => (
                  <div key={u.id} className="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-table-header transition-colors">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[12px] font-bold">
                      {u.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-admin-text">{u.name}</p>
                      <p className="text-[11px] text-admin-muted">{u.email} · Last active {u.last}</p>
                    </div>
                    <span className="text-[12px] font-medium text-admin-medium">{u.role}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${u.status === 'active' ? 'bg-success-light text-success-dark' : 'bg-table-header text-admin-muted'}`}>{u.status === 'active' ? 'Active' : 'Disabled'}</span>
                    <button onClick={() => setToast({ type: 'info', message: `Managing ${u.name}` })} className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[15px] font-semibold font-heading text-admin-text mb-1">Notification Preferences</p>
              <p className="text-[11px] text-admin-muted mb-5">Configure how the system notifies your team</p>
              <div className="space-y-2.5">
                {[
                  ['New application submitted', 'Notify assigned officers instantly', true],
                  ['Application over SLA', 'Escalation alert to managers', true],
                  ['Document expiry alerts', 'Daily digest of expiring documents', true],
                  ['Bulk email confirmation', 'Confirm before sending campaigns', true],
                  ['System security events', 'Alert on failed logins and access', true],
                  ['Daily summary digest', 'End-of-day activity digest', false],
                ].map(([t, d, on]) => (
                  <div key={t} className="flex items-center gap-4 rounded-[10px] border border-admin-border px-4 py-3">
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-admin-text">{t}</p>
                      <p className="text-[11px] text-admin-muted">{d}</p>
                    </div>
                    <Toggle defaultOn={on} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {tab === 'security' && (
            <div className="space-y-5">
              <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-10 h-10 rounded-[10px] bg-danger-light text-danger flex items-center justify-center"><KeyRound size={18} /></span>
                  <div>
                    <p className="text-[15px] font-semibold font-heading text-admin-text">Password Policy</p>
                    <p className="text-[11px] text-admin-muted">Security requirements for all user accounts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ['Minimum password length', '12 characters'],
                    ['Password expiry period', '90 days'],
                    ['Login attempts before lockout', '5 attempts'],
                    ['Two-factor authentication', 'Required for all admins'],
                    ['Session timeout', '15 minutes'],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between rounded-[10px] border border-admin-border px-4 py-3">
                      <span className="text-[13px] font-medium text-admin-text">{l}</span>
                      <button className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[7px] border border-admin-border text-[12px] font-semibold text-admin-medium">{v} <ChevronDown size={13} className="text-admin-muted" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-10 h-10 rounded-[10px] bg-info-light text-info flex items-center justify-center"><Database size={18} /></span>
                  <div>
                    <p className="text-[15px] font-semibold font-heading text-admin-text">Backup & Maintenance</p>
                    <p className="text-[11px] text-admin-muted">Data protection and system health</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-[10px] border border-admin-border p-4">
                    <p className="text-[12px] text-admin-muted mb-1.5">Backup Frequency</p>
                    <button className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">Daily · 02:00 AM <ChevronDown size={13} className="text-admin-muted" /></button>
                  </div>
                  <div className="rounded-[10px] border border-admin-border p-4">
                    <p className="text-[12px] text-admin-muted mb-1.5">Retention Period</p>
                    <button className="w-full h-[38px] rounded-[8px] border border-admin-border px-3 text-left text-[13px] font-semibold text-admin-text flex items-center justify-between">12 months <ChevronDown size={13} className="text-admin-muted" /></button>
                  </div>
                  <div className="rounded-[10px] border border-admin-border p-4">
                    <p className="text-[12px] text-admin-muted mb-1.5">Last Backup</p>
                    <p className="text-[13px] font-semibold text-success-dark">✓ 15 Jan 2025 · 02:00 AM · 1.2 GB</p>
                  </div>
                  <div className="rounded-[10px] border border-admin-border p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-admin-muted">Backup Now</p>
                      <p className="text-[11px] text-admin-muted">Create on-demand backup</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => setToast({ type: 'success', message: 'Backup started' })}><RefreshCw size={13} /> Start Backup</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
