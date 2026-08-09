import { jsPDF } from 'jspdf'
import { en } from '../i18n/translations'

const W = 794
const PAGE_H = 1123
const M = 48
const CONTENT_W = W - M * 2

const COLORS = {
  navy: '#0b1322',
  dark: '#141e2d',
  gray: '#5a6473',
  accent: '#f18f01',
  accentSoft: '#ffd296',
  white: '#ffffff',
  line: '#e6e8ec',
}

const FONTS = {
  si: { name: 'NotoVendioraSinhala', url: '/fonts/NotoSansSinhala-Regular.ttf' },
  ta: { name: 'NotoVendioraTamil', url: '/fonts/NotoSansTamil-Regular.ttf' },
}

const fontPromises = {}

function ensureFont(font) {
  if (!font) return Promise.resolve(null)
  if (!fontPromises[font.name]) {
    fontPromises[font.name] = (async () => {
      const f = new FontFace(font.name, `url(${font.url})`)
      await f.load()
      document.fonts.add(f)
      return font.name
    })().catch(() => null)
  }
  return fontPromises[font.name]
}

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

function wrap(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function downloadChecklistPdf({ t, lang }) {
  const font = FONTS[lang] || null
  const fontName = await ensureFont(font)
  const useEn = lang !== 'en' && !fontName
  const tr = (path) => (useEn ? getPath(en, path) ?? path : t(path))

  const base = document.createElement('canvas')
  base.width = W
  base.height = 20000
  const ctx = base.getContext('2d')
  const family = fontName ? `${fontName}, 'Segoe UI', sans-serif` : "'Segoe UI', 'Noto Sans', sans-serif"

  const setFont = (size, weight, color) => {
    ctx.font = `${weight} ${size}px ${family}`
    ctx.fillStyle = color
  }

  let y = 0

  setFont(24, '700', COLORS.white)
  ctx.fillText('VENDIORA', M, 52)
  setFont(12, '400', COLORS.accentSoft)
  ctx.fillText(tr('pdf.subtitle'), M, 72)
  ctx.fillStyle = COLORS.accent
  ctx.fillRect(M, 88, CONTENT_W, 3)
  y = 124

  setFont(26, '700', COLORS.dark)
  const titleLines = wrap(ctx, tr('pdf.title'), CONTENT_W)
  titleLines.forEach((l, i) => ctx.fillText(l, M, y + i * 30))
  y += titleLines.length * 30 + 6
  setFont(12, '400', COLORS.gray)
  const introLines = wrap(ctx, tr('pdf.intro'), CONTENT_W)
  introLines.forEach((l, i) => ctx.fillText(l, M, y + i * 18))
  y += introLines.length * 18 + 14

  const section = (text, hint) => {
    ctx.fillStyle = COLORS.accent
    ctx.fillRect(M, y, 4, 22)
    setFont(16, '700', COLORS.dark)
    ctx.fillText(text, M + 14, y + 16)
    y += 26
    if (hint) {
      setFont(11, '400', COLORS.gray)
      ctx.fillText(hint, M + 14, y + 4)
      y += 20
    }
    y += 4
  }

  section(tr('pdf.roadmap'), tr('pdf.roadmapHint'))
  const steps = tr('how.steps')
  steps.forEach((s, i) => {
    const cy = y + 13
    ctx.beginPath()
    ctx.arc(M + 10, cy, 10, 0, Math.PI * 2)
    ctx.strokeStyle = COLORS.accent
    ctx.lineWidth = 1.5
    ctx.stroke()
    setFont(11, '700', COLORS.accent)
    ctx.textAlign = 'center'
    ctx.fillText(String(i + 1), M + 10, cy + 4)
    ctx.textAlign = 'left'
    setFont(13, '700', COLORS.dark)
    ctx.fillText(s.title, M + 30, cy)
    setFont(11, '400', COLORS.gray)
    const descLines = wrap(ctx, s.desc, CONTENT_W - 30)
    descLines.forEach((l, idx) => ctx.fillText(l, M + 30, cy + 16 + idx * 16))
    y += 30 + descLines.length * 16 + 10
  })

  y += 8
  section(tr('pdf.docsTitle'), tr('pdf.docsHint'))
  const docs = tr('req.docs')
  docs.forEach((d) => {
    ctx.strokeStyle = COLORS.accent
    ctx.lineWidth = 1.5
    ctx.strokeRect(M, y, 12, 12)
    setFont(12, '400', COLORS.dark)
    const lines = wrap(ctx, d, CONTENT_W - 22)
    lines.forEach((l, idx) => ctx.fillText(l, M + 22, y + 10 + idx * 16))
    y += 16 + lines.length * 16 + 6
  })

  y += 10
  ctx.fillStyle = COLORS.line
  ctx.fillRect(M, y, CONTENT_W, 1)
  y += 26
  setFont(11, '400', COLORS.gray)
  ctx.fillText(tr('pdf.contact') + ' helpdesk@vendiora.lk', M, y)
  y += 16
  ctx.fillText(tr('pdf.helpdeskHours'), M, y)
  y += 30

  const pages = Math.max(1, Math.ceil(y / PAGE_H))
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  for (let p = 0; p < pages; p++) {
    if (p > 0) pdf.addPage()

    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = W * 2
    pageCanvas.height = PAGE_H * 2
    const pctx = pageCanvas.getContext('2d')
    pctx.fillStyle = COLORS.white
    pctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
    pctx.scale(2, 2)
    pctx.drawImage(base, 0, p * PAGE_H, W, PAGE_H, 0, 0, W, PAGE_H)

    const fy = PAGE_H - 60
    pctx.strokeStyle = COLORS.line
    pctx.lineWidth = 1
    pctx.beginPath()
    pctx.moveTo(M, fy - 6)
    pctx.lineTo(W - M, fy - 6)
    pctx.stroke()
    pctx.font = `400 9.5px ${family}`
    pctx.fillStyle = COLORS.gray
    pctx.textAlign = 'left'
    pctx.fillText(`${tr('pdf.contact')} helpdesk@vendiora.lk  |  ${tr('pdf.helpdeskHours')}`, M, fy + 12)
    pctx.fillText(`${tr('pdf.generatedOn')}: ${dateStr}`, M, fy + 28)
    pctx.textAlign = 'right'
    pctx.fillText(`${p + 1} / ${pages}`, W - M, fy + 28)

    pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, 210, 297, undefined, 'FAST')
  }

  pdf.save('VENDIORA-Supplier-Registration-Guide.pdf')
}
