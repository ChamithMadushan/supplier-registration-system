import React, { useState } from 'react'
import {
  TrendingUp, Award, PackageCheck, Truck, ThumbsUp, AlertTriangle, Download,
  CalendarCheck2, ChevronDown, BarChart3, CheckCircle2, Star, LineChart, Gauge as GaugeIcon,
} from 'lucide-react'
import Gauge from '../../components/portal/Gauge'
import StatCard from '../../components/portal/StatCard'
import Button from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'

const scores = [
  { label: 'Quality Systems', score: 4.8, max: 5 },
  { label: 'Delivery Performance', score: 4.6, max: 5 },
  { label: 'Financial Stability', score: 4.2, max: 5 },
  { label: 'Compliance & Governance', score: 4.5, max: 5 },
  { label: 'Responsiveness', score: 4.0, max: 5 },
]

const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
const onTime = [82, 86, 84, 90, 92, 96]
const target = 90

const heat = [
  ['Jan', [5, 5, 4, 5, 5, 4, 5]],
  ['Feb', [5, 5, 5, 4, 5, 5, 4]],
  ['Mar', [4, 5, 5, 5, 5, 5, 5]],
  ['Apr', [5, 5, 4, 5, 5, 4, 5]],
  ['May', [5, 5, 5, 5, 5, 5, 4]],
  ['Jun', [5, 5, 5, 4, 5, 5, 5]],
  ['Jul', [5, 5, 5, 5, 5, 5, 5]],
  ['Aug', [5, 5, 4, 5, 5, 5, 5]],
  ['Sep', [5, 5, 5, 5, 5, 5, 5]],
  ['Oct', [5, 5, 5, 5, 5, 4, 5]],
  ['Nov', [5, 5, 5, 5, 5, 5, 5]],
  ['Dec', [5, 5, 5, 5, 5, 5, 5]],
]

const heatColor = {
  3: 'bg-warning-light',
  4: 'bg-warning/40',
  5: 'bg-success',
}

export default function Performance() {
  const [toast, setToast] = useState(null)
  const [period, setPeriod] = useState('Last 6 Months')

  return (
    <div className="anim-fade-up">
      <Toast open={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold font-heading text-ink">Performance Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">Your live score and delivery performance</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none rounded-[8px] border border-line-soft bg-white pl-4 pr-9 py-2.5 text-[13px] font-semibold text-ink hover:border-ink-faint focus:border-secondary focus:outline-none transition-colors cursor-pointer"
            >
              {['Last 6 Months', 'Last 12 Months', 'All Time'].map((p) => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          </div>
          <Button variant="secondary" size="sm" onClick={() => setToast({ type: 'info', message: 'Report downloading as PDF' })}>
            <Download size={15} /> Report
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={PackageCheck} accent="success" label="On-Time Deliveries" value="96%" bar barValue={96} sub="Last 6 months" />
        <StatCard icon={Truck} accent="info" label="Orders Completed" value="124" sub="12 avg / month" />
        <StatCard icon={ThumbsUp} accent="success" label="Defect Rate" value="0.8%" sub="Target < 2%" />
        <StatCard icon={AlertTriangle} accent="danger" label="Complaints" value="2" sub="Last 6 months" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Score gauge */}
        <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
              <Award size={18} className="text-accent" /> Supplier Score
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-dark bg-success-light px-2.5 py-1 rounded-full">
              <TrendingUp size={11} /> +0.3 vs last review
            </span>
          </div>
          <div className="flex justify-center py-4">
            <Gauge value={4.5} max={5} size={190} sublabel="Excellent" />
          </div>
          <p className="text-center text-[11px] text-ink-muted">Last reviewed: 15 December 2024</p>
          <div className="mt-5 space-y-3.5">
            {scores.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-medium text-ink">{s.label}</span>
                  <span className="font-mono font-bold text-ink-muted">{s.score.toFixed(1)}</span>
                </div>
                <div className="h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-secondary to-info" style={{ width: `${(s.score / s.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery chart */}
        <div className="bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
              <BarChart3 size={18} className="text-secondary" /> On-Time Delivery Rate
            </p>
            <div className="flex items-center gap-3 text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-r from-secondary to-info inline-block" /> On-time %</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent inline-block" /> Target {target}%</span>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-3 sm:gap-4 h-[240px]">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-mono font-bold text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity">{onTime[i]}%</span>
                <div className="relative w-full flex justify-center" style={{ height: '210px' }}>
                  <div className="absolute bottom-0 w-full max-w-[38px] bg-[#E9ECEF] rounded-t-[8px]" style={{ height: '100%' }} />
                  <div
                    className="absolute bottom-0 w-full max-w-[38px] rounded-t-[8px] transition-all duration-500 hover:brightness-110"
                    style={{ height: `${onTime[i]}%`, background: 'linear-gradient(180deg, var(--color-secondary, #2E86AB), #3FA3C9)' }}
                  />
                </div>
                <span className="text-[11px] text-ink-muted font-medium">{m}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-surface border border-line-soft px-4 py-3">
            <p className="text-[13px] text-ink-muted">Average on-time rate</p>
            <p className="text-lg font-bold font-heading text-success">88.3%</p>
          </div>
        </div>
      </div>

      {/* Compliance heatmap */}
      <div className="mt-6 bg-white rounded-[16px] border border-line-soft shadow-[var(--shadow-card)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <p className="flex items-center gap-2 font-heading font-semibold text-[15px] text-ink">
            <CalendarCheck2 size={18} className="text-accent" /> Compliance &amp; On-time Record
          </p>
          <div className="flex items-center gap-3 text-[11px] text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success inline-block" /> On time</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-warning/40 inline-block" /> Late</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-warning-light inline-block" /> Not applicable</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[52px_repeat(7,minmax(30px,1fr))] gap-1.5 min-w-[420px]">
            <div />
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-ink-muted uppercase">{d}</div>
            ))}
            {heat.map(([month, days]) => (
              <React.Fragment key={month}>
                <div className="text-[11px] font-semibold text-ink-muted self-center">{month}</div>
                {days.map((v, i) => (
                  <div
                    key={i}
                    title={`${month} week ${i + 1}: ${v === 5 ? 'On time' : v === 4 ? 'Late' : 'N/A'}`}
                    className={`h-9 rounded-[8px] ${heatColor[v]} flex items-center justify-center cursor-default transition-transform hover:scale-105`}
                  >
                    {v === 5 && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-6 rounded-[12px] bg-secondary/5 border border-secondary/20 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <GaugeIcon size={20} className="text-secondary shrink-0" />
        <p className="text-[13px] text-ink-muted flex-1">
          Scores update after each review cycle. Contact your account manager to discuss improvements.
        </p>
        <Button size="sm" variant="secondary" onClick={() => setToast({ type: 'info', message: 'Opening improvement suggestions' })}>
          View Suggestions
        </Button>
      </div>
    </div>
  )
}
