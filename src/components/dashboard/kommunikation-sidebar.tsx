"use client"

import { useState } from "react"
import { MoreHorizontal, X, Settings } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Nachricht {
  id: string
  text: string
}

const INITIAL_NACHRICHTEN: Nachricht[] = [
  {
    id: "1",
    text: "Der Zeitsaldo des Mitarbeitenden ML Caudhari Ali überschreitet 50 Stunden.",
  },
  {
    id: "2",
    text: "Der Zeitsaldo des Mitarbeitenden ML Baumann Adjoa überschreitet 50 Stunden.",
  },
  {
    id: "3",
    text: 'Bei ML98765 Baumann Sarah läuft die Qualifikation "Ausweise / Bescheinigung RLC" am 01.04.2026 ab',
  },
  {
    id: "4",
    text: 'Bei ML34567 Pescara Nicole läuft die Qualifikation "Ausweise / Bescheinigung RLC" am 01.04.2026 ab',
  },
]

interface KommunikationSidebarProps {
  className?: string
}

export const KommunikationSidebar = ({ className }: KommunikationSidebarProps) => {
  const [nachrichten, setNachrichten] = useState<Nachricht[]>(INITIAL_NACHRICHTEN)

  const handleDismiss = (id: string) => {
    setNachrichten((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Section header */}
      <div className="flex items-center justify-between shrink-0">
        <h2 className="font-normal text-[22px]">Kommunikation</h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Mehr Optionen für Kommunikation"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      {/* System announcement */}
      <Card className="shrink-0" style={{ backgroundColor: "#D0D9E9" }}>
        <CardContent className="py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold leading-snug" style={{ color: "#174693" }}>
              Softwareupdate am So, 15. November 2024
            </p>
            <Settings
              className="size-6 shrink-0"
              style={{ color: "#174693" }}
              aria-hidden
            />
          </div>
        </CardContent>
      </Card>

      {/* Nachrichten – flex-1 so it fills remaining height on desktop */}
      <Card className="flex-1 min-h-0 flex flex-col">
        <CardHeader className="shrink-0">
          <CardTitle>Nachrichten</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Mehr Optionen für Nachrichten"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col overflow-y-auto">
          {nachrichten.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Keine Nachrichten
            </p>
          ) : (
            <>
              <ul
                className="divide-y divide-border"
                role="list"
                aria-label="Nachrichten"
              >
                {nachrichten.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 py-3 first:pt-0">
                    <p className="flex-1 text-sm leading-snug">{n.text}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 mt-0.5"
                      onClick={() => handleDismiss(n.id)}
                      aria-label="Nachricht schliessen"
                    >
                      <X className="size-5" />
                    </Button>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 text-sm text-muted-foreground">
                + 3 weitere Nachrichten
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
