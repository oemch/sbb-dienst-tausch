import { MoreHorizontal, ChevronDown } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const MONTHS = [
  "JAN", "FEB", "MÄR", "APR", "MAI", "JUN",
  "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ",
]

// ─── Mock data ───────────────────────────────────────────────────────────────
// Über-/Unterplanung (%)
// Curves cross ~7×: Ist starts clearly below, overtakes in spring,
// dips again in summer, overshoots in late autumn.
const SOLL_PLAN = [25, 40, 52, 58, 72, 88, 92, 86, 70, 78, 82, 75]
const IST_PLAN  = [12, 38, 62, 50, 80, 82, 86, 96, 60, 72, 90, 68]

// Personalkosten (Tsd. CHF)
// IST values kept near original but shifted off exact equality with SOLL
// to ensure correct crossing detection (no d0*d1=0 edge cases).
const SOLL_COST = [13, 32, 30, 30, 45, 46, 62, 62, 52, 58, 35, 30]
const IST_COST  = [10, 30, 28, 27, 44, 60, 58, 35, 55, 56, 34, 33]

// ─── SVG geometry ───────────────────────────────────────────────────────────
const SVG_W  = 560
const SVG_H  = 130
const CH_L   = 38   // left (y-axis label space)
const CH_R   = 554  // right
const CH_T   = 10   // top
const CH_B   = 108  // bottom (baseline = 0)
const CH_H   = CH_B - CH_T

// OKT = index 9 → marks "current" period
const CURRENT_MONTH_IDX = 9

type Point = { x: number; y: number }

const xFor = (i: number) => CH_L + (i / 11) * (CH_R - CH_L)
const yFor  = (v: number, max: number) => CH_B - (v / max) * CH_H

// ── Catmull-Rom → Cubic Bezier (tension = default 1/6) ────────────────────
const buildSmoothPath = (pts: Point[]): string => {
  if (pts.length === 0) return ""
  if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`

  const p = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2)

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return d
}

// ── Conditional area fill ────────────────────────────────────────────────
// Rules (same for both charts):
//   Ist < Soll → fill from x-axis (CH_B) up to Ist line   (orange under Ist)
//   Ist > Soll → fill from Soll line up to Ist line        (orange between curves)
//
// Approach: insert linearly-interpolated crossing points, then build one
// polygon per segment between consecutive crossings.
interface KP { x: number; ist: number; soll: number; cross: boolean }

const buildConditionalAreaPaths = (
  istData: number[],
  sollData: number[],
  max: number,
): string[] => {
  const n = istData.length
  const kps: KP[] = []

  for (let i = 0; i < n; i++) {
    kps.push({ x: xFor(i), ist: istData[i], soll: sollData[i], cross: false })

    if (i < n - 1) {
      const d0 = istData[i]     - sollData[i]
      const d1 = istData[i + 1] - sollData[i + 1]
      if (d0 * d1 < 0) {                              // sign change → crossing
        const t  = d0 / (d0 - d1)
        const cx = xFor(i) + t * (xFor(i + 1) - xFor(i))
        const cv = istData[i] + t * (istData[i + 1] - istData[i])
        kps.push({ x: cx, ist: cv, soll: cv, cross: true })
      }
    }
  }

  // Split into segments at crossing points (crossings are shared endpoints)
  const segments: KP[][] = []
  let curr: KP[] = []
  for (const kp of kps) {
    curr.push(kp)
    if (kp.cross && curr.length > 1) {
      segments.push(curr)
      curr = [kp]
    }
  }
  if (curr.length > 1) segments.push(curr)

  return segments.flatMap((seg) => {
    const ref = seg.find((kp) => !kp.cross)   // first non-crossing point
    if (!ref) return []
    const istAbove = ref.ist > ref.soll

    const top = seg
      .map((kp) => `${kp.x.toFixed(1)} ${yFor(kp.ist, max).toFixed(1)}`)
      .join(' L ')

    if (!istAbove) {
      // Ist below Soll: fill from x-axis to Ist
      const x0 = seg[0].x.toFixed(1)
      const x1 = seg[seg.length - 1].x.toFixed(1)
      return [`M ${top} L ${x1} ${CH_B} L ${x0} ${CH_B} Z`]
    } else {
      // Ist above Soll: fill between Soll and Ist
      const bot = [...seg]
        .reverse()
        .map((kp) => `${kp.x.toFixed(1)} ${yFor(kp.soll, max).toFixed(1)}`)
        .join(' L ')
      return [`M ${top} L ${bot} Z`]
    }
  })
}

// ── Vertical boundary lines at fill-segment edges ────────────────────────
// At each segment start/end, draw a 1px vertical line tracing the polygon edge.
// At crossing points ist === soll, so the extent is 0 and no line is emitted.
interface BoundaryLine { x: number; y1: number; y2: number }

const buildBoundaryLines = (
  istData: number[],
  sollData: number[],
  max: number,
): BoundaryLine[] => {
  const n = istData.length
  const kps: KP[] = []

  for (let i = 0; i < n; i++) {
    kps.push({ x: xFor(i), ist: istData[i], soll: sollData[i], cross: false })
    if (i < n - 1) {
      const d0 = istData[i]     - sollData[i]
      const d1 = istData[i + 1] - sollData[i + 1]
      if (d0 * d1 < 0) {
        const t  = d0 / (d0 - d1)
        const cx = xFor(i) + t * (xFor(i + 1) - xFor(i))
        const cv = istData[i] + t * (istData[i + 1] - istData[i])
        kps.push({ x: cx, ist: cv, soll: cv, cross: true })
      }
    }
  }

  const segments: KP[][] = []
  let curr: KP[] = []
  for (const kp of kps) {
    curr.push(kp)
    if (kp.cross && curr.length > 1) { segments.push(curr); curr = [kp] }
  }
  if (curr.length > 1) segments.push(curr)

  const lines: BoundaryLine[] = []

  for (const seg of segments) {
    const ref = seg.find((kp) => !kp.cross)
    if (!ref) continue
    const istAbove = ref.ist > ref.soll

    const edgeY = (kp: KP) => ({
      top:   yFor(kp.ist,  max),
      floor: istAbove ? yFor(kp.soll, max) : CH_B,
    })

    for (const kp of [seg[0], seg[seg.length - 1]]) {
      const { top, floor } = edgeY(kp)
      if (Math.abs(floor - top) > 0.5) {
        lines.push({ x: kp.x, y1: Math.min(top, floor), y2: Math.max(top, floor) })
      }
    }
  }

  return lines
}

// ── Line path (smooth) ───────────────────────────────────────────────────
const buildLinePath = (data: number[], max: number): string => {
  const pts = data.map((v, i): Point => ({ x: xFor(i), y: yFor(v, max) }))
  return buildSmoothPath(pts)
}

// ─── Chart component ────────────────────────────────────────────────────────
interface LineChartProps {
  title: string
  yLabel: string
  yMax: number
  ySteps: number[]
  sollData: number[]
  istData: number[]
  sollLegend: string
  istLegend: string
}

const LineChart = ({
  title,
  yLabel,
  yMax,
  ySteps,
  sollData,
  istData,
  sollLegend,
  istLegend,
}: LineChartProps) => {
  const areaPaths    = buildConditionalAreaPaths(istData, sollData, yMax)
  const boundaryLines = buildBoundaryLines(istData, sollData, yMax)
  const sollPath     = buildLinePath(sollData, yMax)
  const istPath      = buildLinePath(istData,  yMax)
  const currentX     = xFor(CURRENT_MONTH_IDX)

  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-foreground/70">{title}</p>
      <p className="text-[12px] mt-2 mb-4" style={{ color: "#767676" }}>{yLabel}</p>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        role="img"
        aria-label={`Liniendiagramm: ${title}`}
        overflow="visible"
      >
        <defs>
          {/* Gradient: white at x-axis (CH_B), full orange at 50 % of chart height */}
          <linearGradient
            id="areaGradient"
            x1="0" y1={CH_B}
            x2="0" y2={CH_T}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="white"   />
            <stop offset="100%" stopColor="#FFAB4A" />
          </linearGradient>
        </defs>

        {/* Grid lines + Y-axis value labels */}
        {ySteps.map((val) => {
          const y = yFor(val, yMax)
          return (
            <g key={val}>
              <line
                x1={CH_L} y1={y} x2={CH_R} y2={y}
                stroke="currentColor" strokeOpacity={0.1} strokeWidth={1}
              />
              <text
                x={CH_L - 4} y={y + 4}
                textAnchor="end"
                fill="#767676"
                style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* Conditional fill with gradient: white → #FFAB4A */}
        {areaPaths.map((d, i) => (
          <path key={`area${i}`} d={d} fill="url(#areaGradient)" />
        ))}

        {/* Vertical boundary lines at fill segment edges */}
        {boundaryLines.map((l, i) => (
          <line
            key={`bl${i}`}
            x1={l.x.toFixed(1)} y1={l.y1.toFixed(1)}
            x2={l.x.toFixed(1)} y2={l.y2.toFixed(1)}
            stroke="#FFB15C"
            strokeWidth={1}
          />
        ))}

        {/* Soll line – dark green solid */}
        <path
          d={sollPath}
          fill="none"
          stroke="#16A34A"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Ist line – black dashed, drawn on top */}
        <path
          d={istPath}
          fill="none"
          stroke="#111827"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data dots – Soll */}
        {sollData.map((v, i) => (
          <circle
            key={`s${i}`}
            cx={xFor(i)}
            cy={yFor(v, yMax)}
            r={2.5}
            fill="#16A34A"
          />
        ))}

        {/* Data dots – Ist */}
        {istData.map((v, i) => (
          <circle
            key={`t${i}`}
            cx={xFor(i)}
            cy={yFor(v, yMax)}
            r={2.5}
            fill="#111827"
          />
        ))}

        {/* Vertical current-period marker at OKT */}
        <line
          x1={currentX} y1={CH_T}
          x2={currentX} y2={CH_B}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeWidth={1}
        />

        {/* X-axis month labels */}
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={xFor(i)}
            y={SVG_H - 2}
            textAnchor="middle"
            fill="#767676"
            style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
          >
            {m}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div
            className="size-3 rounded-sm shrink-0"
            style={{ background: "#16A34A" }}
            aria-hidden
          />
          <span>{sollLegend}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="size-3 rounded-sm shrink-0"
            style={{ background: "#111827" }}
            aria-hidden
          />
          <span>{istLegend}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="size-3 rounded-sm shrink-0"
            style={{ background: "#FFAB4A", opacity: 0.7 }}
            aria-hidden
          />
          <span>Über-/Unterplanung</span>
        </div>
      </div>
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export const GeplantEinsaetzeCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 flex-wrap">
          <CardTitle>Geplante Einsätze</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1 font-normal"
            aria-label="Zeitraum wählen: JAN – DEZ 2025"
            >
            JAN – DEZ 2025
            <ChevronDown className="size-3 text-muted-foreground" />
          </Button>
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Mehr Optionen für Geplante Einsätze"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {/*
          Mobile / Tablet (< lg): charts stack vertically.
          Desktop (lg+):          side by side with divider.
        */}
        <div className="flex flex-col lg:flex-row gap-8">
          <LineChart
            title="Über-/Unterplanung"
            yLabel="%"
            yMax={100}
            ySteps={[100, 75, 50, 25, 0]}
            sollData={SOLL_PLAN}
            istData={IST_PLAN}
            sollLegend="Soll-Zeit"
            istLegend="Ist-Zeit"
          />

          <div className="w-px bg-border shrink-0 hidden lg:block" aria-hidden />

          <LineChart
            title="Personalkosten"
            yLabel="Tsd. (CHF)"
            yMax={60}
            ySteps={[60, 45, 30, 15, 0]}
            sollData={SOLL_COST}
            istData={IST_COST}
            sollLegend="Soll-Wert"
            istLegend="Ist-Wert"
          />
        </div>
      </CardContent>
    </Card>
  )
}
