"use client"

import { useState } from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type View = "allgemein" | "abwesenheiten"

interface DayData {
  day: string
  nr: number
  anwesend: number
  abwesend: number
}

interface AbsenceDay {
  day: string
  nr: number
  ferien: number
  krankheit: number
  langfristig: number
}

interface Attendee {
  id: string
  photo: string
  name: string
}

const WEEK_DATA: DayData[] = [
  { day: "MO", nr: 7,  anwesend: 9,  abwesend: 5 },
  { day: "DI", nr: 8,  anwesend: 10, abwesend: 4 },
  { day: "MI", nr: 9,  anwesend: 11, abwesend: 3 },
  { day: "DO", nr: 10, anwesend: 12, abwesend: 4 },
  { day: "FR", nr: 11, anwesend: 9,  abwesend: 5 },
  { day: "SA", nr: 12, anwesend: 5,  abwesend: 2 },
  { day: "SO", nr: 13, anwesend: 2,  abwesend: 0 },
]

const ABSENCE_DATA: AbsenceDay[] = [
  { day: "MO", nr: 7,  ferien: 7,  krankheit: 2,  langfristig: 1 },
  { day: "DI", nr: 8,  ferien: 7,  krankheit: 11, langfristig: 1 },
  { day: "MI", nr: 9,  ferien: 6,  krankheit: 9,  langfristig: 1 },
  { day: "DO", nr: 10, ferien: 10, krankheit: 3,  langfristig: 1 },
  { day: "FR", nr: 11, ferien: 14, krankheit: 6,  langfristig: 1 },
  { day: "SA", nr: 12, ferien: 10, krankheit: 5,  langfristig: 1 },
  { day: "SO", nr: 13, ferien: 0,  krankheit: 0,  langfristig: 0 },
]

const ATTENDEES: Attendee[] = [
  { id: "1",  photo: "https://i.pravatar.cc/80?img=12", name: "ML12563 Huber Thomas" },
  { id: "2",  photo: "https://i.pravatar.cc/80?img=36", name: "ML12564 Bauer Sandra" },
  { id: "3",  photo: "https://i.pravatar.cc/80?img=67", name: "ML12565 Keller Marco" },
  { id: "4",  photo: "https://i.pravatar.cc/80?img=9",  name: "ML12566 Fischer Anna" },
  { id: "5",  photo: "https://i.pravatar.cc/80?img=15", name: "ML12567 Weber Jonas" },
  { id: "6",  photo: "https://i.pravatar.cc/80?img=47", name: "ML12568 Müller Petra" },
  { id: "7",  photo: "https://i.pravatar.cc/80?img=33", name: "ML12569 Schmidt Lars" },
  { id: "8",  photo: "https://i.pravatar.cc/80?img=20", name: "ML12570 Zimmermann Lisa" },
  { id: "9",  photo: "https://i.pravatar.cc/80?img=57", name: "ML12571 Braun Stefan" },
  { id: "10", photo: "https://i.pravatar.cc/80?img=26", name: "ML12572 Hoffmann Maria" },
]

const SICK_TODAY: Attendee[] = [
  { id: "1", photo: "https://i.pravatar.cc/80?img=49", name: "ML54321 Andrea Costa" },
  { id: "2", photo: "https://i.pravatar.cc/80?img=13", name: "ML76543 Meyer Rob" },
  { id: "3", photo: "https://i.pravatar.cc/80?img=19", name: "ML98765 Nina Fischer" },
  { id: "4", photo: "https://i.pravatar.cc/80?img=60", name: "ML34567 Huber Klaus" },
]

// ── SVG chart constants ──────────────────────────────────────────────────────
const SVG_W   = 390
const CHART_L = 28
const CHART_R = 382
const CHART_T = 8
const CHART_B = 108
const CHART_H = CHART_B - CHART_T
const Y_MAX   = 20
const BAR_W   = 13
const GROUP_W = (CHART_R - CHART_L) / 7

const yPos = (v: number) => CHART_B - (v / Y_MAX) * CHART_H
const Y_LABELS = [20, 15, 10, 5, 0]

// ── Allgemein chart ──────────────────────────────────────────────────────────
const PersonalBarChart = ({ activeDayIndex }: { activeDayIndex: number }) => (
  <svg
    viewBox={`0 -16 ${SVG_W} 158`}
    className="w-full"
    role="img"
    aria-label="Balkendiagramm Anwesenheit pro Wochentag"
  >
    <text
      x={12} y={-4}
      textAnchor="start" fill="#767676"
      style={{ fontSize: 9, fontFamily: "var(--font-sans, system-ui)" }}
    >Anzahl</text>

    {Y_LABELS.map((val) => {
      const y = yPos(val)
      return (
        <g key={val}>
          <text
            x={CHART_L - 4} y={y + 4}
            textAnchor="end" fill="#767676"
            style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
          >{val}</text>
          <line x1={CHART_L} y1={y} x2={CHART_R} y2={y}
            stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
        </g>
      )
    })}

    {WEEK_DATA.map((d, i) => {
      const groupX  = CHART_L + i * GROUP_W
      const centerX = groupX + GROUP_W / 2
      const hAnw    = (d.anwesend / Y_MAX) * CHART_H
      const hAbw    = (d.abwesend / Y_MAX) * CHART_H
      const isActive = i === activeDayIndex

      return (
        <g key={d.day}>
          {isActive && (
            <rect x={centerX - BAR_W - 4} y={CHART_T}
              width={BAR_W * 2 + 11} height={CHART_H}
              rx={3} fill="currentColor" fillOpacity={0.04} />
          )}
          <rect x={centerX - BAR_W - 1.5} y={CHART_B - hAnw}
            width={BAR_W} height={hAnw} rx={2}
            fill={isActive ? "#047857" : "#34D399"} />
          <rect x={centerX + 1.5} y={CHART_B - hAbw}
            width={BAR_W} height={hAbw} rx={2} fill="#CBD5E1" />
          <text x={centerX} y={CHART_B + 14} textAnchor="middle"
            fill="#767676" fontWeight={isActive ? 700 : 400}
            style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
          >{d.day}</text>
          <text x={centerX} y={CHART_B + 25} textAnchor="middle"
            fill="#767676"
            style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
          >{d.nr}</text>
        </g>
      )
    })}
  </svg>
)

// ── Abwesenheiten chart ──────────────────────────────────────────────────────
// 3 bars per day: Ferien (blue), Krankheit (pink/red), Langfristig (purple)
// Bar width 9px, gap 2px → total 31px per group, centered
const BAR_W3 = 9
const GAP3   = 2

const AbwesenheitenBarChart = ({ activeDayIndex }: { activeDayIndex: number }) => (
  <svg
    viewBox={`0 -16 ${SVG_W} 158`}
    className="w-full"
    role="img"
    aria-label="Balkendiagramm Abwesenheiten pro Wochentag"
  >
    {/* Y-axis label */}
    <text
      x={12} y={-4}
      textAnchor="start" fill="#767676"
      style={{ fontSize: 9, fontFamily: "var(--font-sans, system-ui)" }}
    >Anzahl</text>

    {Y_LABELS.map((val) => {
      const y = yPos(val)
      return (
        <g key={val}>
          <text x={CHART_L - 4} y={y + 4} textAnchor="end" fill="#767676"
            style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
          >{val}</text>
          <line x1={CHART_L} y1={y} x2={CHART_R} y2={y}
            stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
        </g>
      )
    })}

    {ABSENCE_DATA.map((d, i) => {
      const groupX  = CHART_L + i * GROUP_W
      const centerX = groupX + GROUP_W / 2
      const isActive = i === activeDayIndex

      const hF = (d.ferien     / Y_MAX) * CHART_H
      const hK = (d.krankheit  / Y_MAX) * CHART_H
      const hL = (d.langfristig / Y_MAX) * CHART_H

      // x positions: 3 bars centered
      const x1 = centerX - BAR_W3 - GAP3 - BAR_W3 / 2  // Ferien
      const x2 = centerX - BAR_W3 / 2                    // Krankheit
      const x3 = centerX + GAP3 + BAR_W3 / 2             // Langfristig

      return (
        <g key={d.day}>
          {isActive && (
            <rect
              x={x1 - 3} y={CHART_T}
              width={BAR_W3 * 3 + GAP3 * 2 + 6} height={CHART_H}
              rx={3} fill="currentColor" fillOpacity={0.04}
            />
          )}

          {/* Ferien – blau */}
          <rect x={x1} y={CHART_B - hF} width={BAR_W3} height={hF} rx={2}
            fill={isActive ? "#3B82F6" : "#93C5FD"} />

          {/* Krankheit – pink/rot */}
          <rect x={x2} y={CHART_B - hK} width={BAR_W3} height={hK} rx={2}
            fill={isActive ? "#EF4444" : "#FCA5A5"} />

          {/* Langfristig – lila */}
          <rect x={x3} y={CHART_B - hL} width={BAR_W3} height={hL} rx={2}
            fill={isActive ? "#8B5CF6" : "#C4B5FD"} />

          <text x={centerX} y={CHART_B + 14} textAnchor="middle"
            fill="#767676" fontWeight={isActive ? 700 : 400}
            style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
          >{d.day}</text>
          <text x={centerX} y={CHART_B + 25} textAnchor="middle"
            fill="#767676"
            style={{ fontSize: 10, fontFamily: "var(--font-sans, system-ui)" }}
          >{d.nr}</text>
        </g>
      )
    })}
  </svg>
)

// ── Card ─────────────────────────────────────────────────────────────────────
export const PersonalCard = () => {
  const [view, setView] = useState<View>("allgemein")
  const [kw, setKw]     = useState(46)

  const handleViewChange = (v: View) => setView(v)
  const handleKwPrev     = () => setKw((k) => k - 1)
  const handleKwNext     = () => setKw((k) => k + 1)

  const isAbsence = view === "abwesenheiten"

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Personal</CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon" className="size-8"
            aria-label="Mehr Optionen für Personal">
            <MoreHorizontal className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex rounded-md overflow-hidden border border-border text-xs"
            role="group" aria-label="Ansicht wählen">
            <button
              onClick={() => handleViewChange("allgemein")}
              className={cn(
                "px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                view === "allgemein" ? "bg-emerald-700 text-white" : "bg-background hover:bg-muted"
              )}
              aria-pressed={view === "allgemein"}
            >Allgemein</button>
            <button
              onClick={() => handleViewChange("abwesenheiten")}
              className={cn(
                "px-3 py-1.5 border-l border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                view === "abwesenheiten" ? "bg-emerald-700 text-white" : "bg-background hover:bg-muted"
              )}
              aria-pressed={view === "abwesenheiten"}
            >Abwesenheiten</button>
          </div>

          <div className="flex items-center gap-0.5" aria-label="Kalenderwoche wählen">
            <Button variant="ghost" size="icon" className="size-7"
              onClick={handleKwPrev} aria-label="Vorherige Woche">
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="text-xs font-medium min-w-[44px] text-center tabular-nums">
              KW {kw}
            </span>
            <Button variant="ghost" size="icon" className="size-7"
              onClick={handleKwNext} aria-label="Nächste Woche">
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        {isAbsence ? (
          <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-sm bg-blue-300 shrink-0" aria-hidden />
              <span>Ferien</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-sm bg-red-300 shrink-0" aria-hidden />
              <span>Krankheit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-sm bg-violet-300 shrink-0" aria-hidden />
              <span>Langfristig</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-sm bg-emerald-400 shrink-0" aria-hidden />
              <span>Anwesend</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-sm bg-slate-200 shrink-0" aria-hidden />
              <span>Abwesend</span>
            </div>
          </div>
        )}

        {/* Chart */}
        {isAbsence
          ? <AbwesenheitenBarChart activeDayIndex={3} />
          : <PersonalBarChart activeDayIndex={3} />
        }

        {/* Divider – red in Abwesenheiten view */}
        <div className="relative flex items-center" aria-hidden>
          <div className={cn("flex-1 h-px", isAbsence ? "bg-red-400" : "bg-border")} />
          <div className={cn(
            "mx-1 size-2.5 rotate-45 border-r border-b bg-card",
            isAbsence ? "border-red-400" : "border-border"
          )} />
          <div className={cn("flex-1 h-px", isAbsence ? "bg-red-400" : "bg-border")} />
        </div>

        {/* List */}
        {isAbsence ? (
          <div>
            <p className="text-xs font-semibold mb-3">
              Krank Heute ({SICK_TODAY.length}):
            </p>
            <ul className="space-y-2.5 max-h-[130px] overflow-y-auto pr-1"
              role="list" aria-label="Kranke Mitarbeitende">
              {SICK_TODAY.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5">
                  <img src={p.photo} alt={p.name}
                    className="size-8 rounded-full shrink-0 object-cover" />
                  <span className="text-sm">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold mb-3">
              Anwesend Heute ({ATTENDEES.length}):
            </p>
            <ul className="space-y-2.5 max-h-[130px] overflow-y-auto pr-1"
              role="list" aria-label="Anwesende Mitarbeitende">
              {ATTENDEES.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5">
                  <img src={p.photo} alt={p.name}
                    className="size-8 rounded-full shrink-0 object-cover" />
                  <span className="text-sm">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
