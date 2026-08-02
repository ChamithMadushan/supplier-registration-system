import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Star, TrendingUp, TrendingDown, Award, BarChart3, Download, Search, ChevronDown,
  ChevronLeft, ChevronRight, Eye, Plus, AlertTriangle, Trophy, Scale, Target, Timer, CheckCircle2,
} from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { SupplierStatusBadge } from '../../components/admin/Badges'
import { BarChart, HBarChart } from '../../components/admin/Charts'

const bands = [
  { label: 'A', range: '90 - 100', count: 36, color: 'bg-accent' },
  { label: 'B', range: '80 - 89', count: 128, color: 'bg-success' },
  { label: 'C', range: '70 - 79', count: 196, color: 'bg-info' },
  { label: 'D', range: '60 - 69', count: 42, color: 'bg-warning' },
  { label: 'E', range: 'Below 60', count: 10, color: 'bg-danger' },
]

const topSuppliers = [
  { rank: 1, company: 'ABC Trading', code: 'SRS-APR-001', score: 92, change: '+3', delta: 'up', band: 'A' },
  { rank: 2, company: 'PQR Manufacturing', code: 'SRS-APR-231', score: 90, change: '+1', delta: 'up', band: 'A' },
  { rank: 3, company: 'JKL Trading', code: 'SRS-APR-140', score: 88, change: '-2', delta: 'down', band: 'B' },
  { rank: 4, company: 'XYZ Supplies', code: 'SRS-APR-034', score: 84, change: '+4', delta: 'up', band: 'B' },
  { rank: 5, company: 'STU Engineering', code: 'SRS-APR-277', score: 82, change: '0', delta: 'flat', band: 'B' },
  { rank: 6, company: 'DEF Services', code: 'SRS-APR-067', score: 78, change: '-1', delta: 'down', band: 'C' },
  { rank: 7, company: 'VWX Food Products', code: 'SRS-APR-320', score: 75, change: '+2', delta: 'up', band: 'C' },
  { rank: 8, company: 'GHI Constructs', code: 'SRS-APR-102', score: 71, change: '-3', delta: 'down', band: 'C' },
]

const monthlyScores = [
  { label: 'Jan', value: 78 },
  { label: 'Feb', value: 80 },
  { label: 'Mar', value: 79 },
  { label: 'Apr', value: 82 },
  { label: 'May', value: 84 },
  { label: 'Jun', value: 83 },
  { label: 'Jul', value: 85 },
  { label: 'Aug', value: 84 },
  { label: 'Sep', value: 86 },
  { label: 'Oct', value: 88 },
  { label: 'Nov', value: 87 },
  { label: 'Dec', value: 89 },
]

const criteriaAvg = [
  { label: 'Quality', value: 92 },
  { label: 'Delivery', value: 88 },
  { label: 'Pricing', value: 76 },
  { label: 'Responsiveness', value: 84 },
  { label: 'Compliance', value: 90 },
  { label: 'Sustainability', value: 68 },
]

function Delta({ change, delta }) {
  if (delta === 'up') return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-dark"><TrendingUp size={12} /> {change}</span>
  if (delta === 'down') return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-danger"><TrendingDown size={12} /> {change}</span>
  return <span className="text-[11px] text-admin-muted">—</span>
}

export default function Performance() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  return (
    <div>
      <PageHeader
        title="Performance Management"
        subtitle="Annual review cycle 2024 · Last updated 15 Jan 2025"
        breadcrumb={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Performance' }, { label: 'Performance Management' }]}
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border border-admin-border text-[13px] font-semibold text-admin-medium hover:border-admin-border-dark hover:text-admin-text transition-colors">
              <Download size={15} /> Export Scorecard
            </button>
            <button onClick={() => navigate('/admin/reports')} className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-primary text-white text-[13px] font-semibold hover:bg-primary-light transition-colors">
              <BarChart3 size={15} /> Performance Report
            </button>
          </>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-1.5 mb-5">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'ranking', label: 'Supplier Rankings', icon: Trophy },
          { id: 'criteria', label: 'Criteria Analysis', icon: Scale },
          { id: 'reviews', label: 'Review Cycles', icon: Target },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] text-[13px] font-semibold whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-primary text-white' : 'text-admin-light hover:text-admin-text hover:bg-table-header'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
            <AdminStatCard icon={Award} iconBg="bg-accent/15 text-accent-hover" border="border-accent" label="Average Supplier Score" value="4.2 / 5" trend="+0.2" trendUp sub="Overall portfolio score" />
            <AdminStatCard icon={Trophy} iconBg="bg-success-light text-success-dark" border="border-success" label="Strategic Tier Suppliers" value="36" sub="Top performers (90+)" />
            <AdminStatCard icon={Timer} iconBg="bg-warning-light text-warning-dark" border="border-warning" label="Reviews In Progress" value="24" sub="Due this quarter" />
            <AdminStatCard icon={AlertTriangle} iconBg="bg-danger-light text-danger" border="border-danger" label="Underperformers" value="10" sub="Scored below 60" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[16px] font-semibold font-heading text-admin-text mb-5">Portfolio Score Trend (12 Months)</p>
              <BarChart data={monthlyScores} color="bg-gradient-to-t from-accent to-accent-hover" suffix="" />
            </div>
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[16px] font-semibold font-heading text-admin-text mb-5">Score Bands Distribution</p>
              <div className="space-y-4">
                {bands.map((b) => (
                  <div key={b.label}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`w-7 h-7 rounded-full ${b.color} text-white flex items-center justify-center text-[12px] font-bold`}>{b.label}</span>
                      <span className="text-[12px] text-admin-medium">Score {b.range}</span>
                      <span className="ml-auto text-[12px] font-bold text-admin-text">{b.count} suppliers</span>
                    </div>
                    <div className="h-2.5 bg-[#E9ECEF] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${b.color}`} style={{ width: `${(b.count / 412) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top suppliers */}
          <div className="mt-5 bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
              <div>
                <p className="text-[16px] font-semibold font-heading text-admin-text">Top Performers</p>
                <p className="text-[12px] text-admin-muted">Highest scoring suppliers this cycle</p>
              </div>
              <button onClick={() => setTab('ranking')} className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-primary">View Full Ranking</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                    <th className="px-6 py-3">Rank</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Band</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Change</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topSuppliers.slice(0, 5).map((s) => (
                    <tr key={s.rank} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                      <td className="px-6 py-3.5">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${s.rank <= 3 ? 'bg-accent text-white' : 'bg-table-header text-admin-medium'}`}>{s.rank}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-semibold text-admin-text">{s.company}</td>
                      <td className="px-4 py-3.5 text-[12px] font-mono text-secondary">{s.code}</td>
                      <td className="px-4 py-3.5"><span className={`text-[11px] font-bold w-6 h-6 rounded-full inline-flex items-center justify-center ${s.band === 'A' ? 'bg-accent/15 text-accent-hover' : 'bg-success-light text-success-dark'}`}>{s.band}</span></td>
                      <td className="px-4 py-3.5"><span className="text-[13px] font-bold font-mono text-admin-text">{s.score}</span></td>
                      <td className="px-4 py-3.5"><Delta delta={s.delta} change={s.change} /></td>
                      <td className="px-4 py-3.5 text-right">
                        <button onClick={() => navigate(`/admin/suppliers/1`)} className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RANKING */}
      {tab === 'ranking' && (
        <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-admin-border flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <p className="text-[16px] font-semibold font-heading text-admin-text">Supplier Rankings</p>
              <p className="text-[12px] text-admin-muted">Sorted by composite score · Cycle 2024</p>
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
                <input placeholder="Search supplier..." className="h-[36px] rounded-[8px] border border-admin-border pl-9 pr-3 text-[12px] focus:border-primary focus:outline-none" />
              </div>
              <button className="inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
                Cycle: 2024 <ChevronDown size={13} className="text-admin-muted" />
              </button>
              <button className="inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-[8px] border border-admin-border text-[12px] font-semibold text-admin-medium hover:border-admin-border-dark transition-colors">
                Category: All <ChevronDown size={13} className="text-admin-muted" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-light bg-table-header">
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Band</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Change</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topSuppliers.map((s) => (
                  <tr key={s.rank} className="border-t border-[#F0F0F0] hover:bg-table-header transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${s.rank <= 3 ? 'bg-accent text-white' : 'bg-table-header text-admin-medium'}`}>{s.rank}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => navigate('/admin/suppliers/1')} className="flex items-center gap-3 text-left group">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[10px] font-bold">
                          {s.company.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold text-admin-text group-hover:text-secondary transition-colors">{s.company}</p>
                          <p className="text-[11px] text-admin-muted font-mono">{s.code}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-admin-medium">Raw Materials</td>
                    <td className="px-4 py-3.5"><span className={`text-[11px] font-bold w-6 h-6 rounded-full inline-flex items-center justify-center ${s.band === 'A' ? 'bg-accent/15 text-accent-hover' : 'bg-success-light text-success-dark'}`}>{s.band}</span></td>
                    <td className="px-4 py-3.5"><span className="text-[13px] font-bold font-mono text-admin-text">{s.score}</span></td>
                    <td className="px-4 py-3.5"><Delta delta={s.delta} change={s.change} /></td>
                    <td className="px-4 py-3.5"><SupplierStatusBadge status={s.rank <= 3 ? 'strategic' : s.rank <= 5 ? 'preferred' : 'approved'} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => navigate('/admin/suppliers/1')} className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3.5 border-t border-admin-border flex items-center justify-between">
            <span className="text-[12px] text-admin-muted">Showing 1-8 of 412 suppliers</span>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium"><ChevronLeft size={14} /></button>
              {[1, 2, 3].map((p) => (
                <button key={p} className={`w-8 h-8 rounded-[8px] text-[12px] font-semibold ${p === 1 ? 'bg-accent text-white' : 'border border-admin-border text-admin-medium'}`}>{p}</button>
              ))}
              <button className="w-8 h-8 rounded-[8px] border border-admin-border flex items-center justify-center text-admin-medium"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* CRITERIA */}
      {tab === 'criteria' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <p className="text-[16px] font-semibold font-heading text-admin-text mb-5">Average Scores by Criterion</p>
            <HBarChart
              data={criteriaAvg.map((c) => ({ label: c.label, value: `${c.value}`, color: c.value >= 85 ? 'bg-gradient-to-r from-success to-teal' : c.value >= 75 ? 'bg-gradient-to-r from-info to-info' : 'bg-gradient-to-r from-warning to-accent' }))}
              max="100"
            />
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[16px] font-semibold font-heading text-admin-text mb-4">Scoring Weights</p>
              <div className="space-y-3">
                {[
                  { name: 'Technical & Quality', pct: 40, color: 'bg-gradient-to-r from-info to-info' },
                  { name: 'Financial Stability', pct: 30, color: 'bg-gradient-to-r from-success to-teal' },
                  { name: 'Compliance & Legal', pct: 20, color: 'bg-gradient-to-r from-accent to-accent-hover' },
                  { name: 'Management & Innovation', pct: 10, color: 'bg-gradient-to-r from-purple to-purple' },
                ].map((w) => (
                  <div key={w.name}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="font-medium text-admin-text">{w.name}</span>
                      <span className="font-mono font-bold text-admin-medium">{w.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-[#E9ECEF] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
              <p className="text-[16px] font-semibold font-heading text-admin-text mb-4">Notable Findings</p>
              <div className="space-y-2.5">
                <p className="flex items-start gap-2.5 text-[13px] text-admin-medium"><CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" /> Quality scores improved 4 pts across the portfolio</p>
                <p className="flex items-start gap-2.5 text-[13px] text-admin-medium"><CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" /> Compliance remains the strongest pillar (90 avg)</p>
                <p className="flex items-start gap-2.5 text-[13px] text-danger-dark"><AlertTriangle size={16} className="text-danger shrink-0 mt-0.5" /> Sustainability is the weakest area (68 avg) - prioritize improvement plans</p>
                <p className="flex items-start gap-2.5 text-[13px] text-danger-dark"><AlertTriangle size={16} className="text-danger shrink-0 mt-0.5" /> 10 suppliers below 60 require performance improvement plans</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS */}
      {tab === 'reviews' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              { label: 'Annual Review 2025', date: 'Opens 01 Feb 2025', count: 412, status: 'Upcoming', color: 'bg-info-light text-info' },
              { label: 'Annual Review 2024', date: 'Completed 15 Jan 2025', count: 405, status: 'Completed', color: 'bg-success-light text-success-dark' },
              { label: 'Quarterly Review Q4 2024', date: 'Completed 31 Dec 2024', count: 398, status: 'Completed', color: 'bg-success-light text-success-dark' },
            ].map((r) => (
              <div key={r.label} className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-start justify-between">
                  <span className="w-11 h-11 rounded-[10px] bg-table-header text-admin-medium flex items-center justify-center"><Target size={20} /></span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${r.color}`}>{r.status}</span>
                </div>
                <p className="mt-4 text-[15px] font-bold text-admin-text">{r.label}</p>
                <p className="text-[12px] text-admin-muted mt-1">{r.date}</p>
                <p className="text-[12px] text-admin-medium mt-2">{r.count} suppliers in scope</p>
                <button onClick={() => navigate('/admin/reports')} className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-secondary hover:text-primary">
                  View Report →
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[12px] border border-admin-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[16px] font-semibold font-heading text-admin-text">Reviews Awaiting Completion</p>
              <button className="inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-[8px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors"><Plus size={14} /> Start New Review</button>
            </div>
            <div className="space-y-3">
              {[
                { company: 'YZA Chemicals', code: 'SRS-APR-366', assigned: 'K. Perera', due: 'Due in 5 days', score: null },
                { company: 'MNO Services', code: 'SRS-APR-188', assigned: 'A. Dias', due: 'Due in 8 days', score: null },
                { company: 'GHI Constructs', code: 'SRS-APR-102', assigned: 'S. Fernando', due: 'Due in 12 days', score: null },
              ].map((r) => (
                <div key={r.code} className="flex flex-wrap items-center gap-4 rounded-[10px] border border-admin-border p-4">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[10px] font-bold">
                    {r.company.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-admin-text">{r.company}</p>
                    <p className="text-[11px] text-admin-muted font-mono">{r.code} · Assigned to {r.assigned}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-warning-dark bg-warning-light px-2.5 py-1 rounded-full">⏳ {r.due}</span>
                  <button className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-[7px] bg-primary text-white text-[12px] font-semibold hover:bg-primary-light transition-colors">
                    Start Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
