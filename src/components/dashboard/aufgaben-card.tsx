import { MoreHorizontal, ExternalLink, AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type AufgabeVariant = "task" | "alert"

interface Aufgabe {
  id: string
  text: string
  variant: AufgabeVariant
  details?: string[]
  warning?: string
}

const AUFGABEN: Aufgabe[] = [
  {
    id: "1",
    text: "Periode abschliessen",
    variant: "task",
  },
  {
    id: "2",
    text: "Austritte & Vertragswechsel von dem Periodenabschluss bearbeiten",
    variant: "task",
  },
  {
    id: "3",
    text: "Für folgende Mitarbeitende ist für mehr als 30 Tage kein Einsatz geplant:",
    variant: "alert",
    details: ["ML12345 Baroch Rickie"],
    warning:
      "Der Unfallversicherungsschutz des Mitarbeitenden ist dann nicht mehr sichergestellt. Ändern Sie die Planung oder kontaktieren Sie die Personalabteilung",
  },
  {
    id: "4",
    text: "Nicht eingeteile Mitarbeiter:innen vorhanden",
    variant: "task",
  },
]

export const AufgabenCard = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aufgaben</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Mehr Optionen für Aufgaben"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ul className="divide-y divide-border" role="list" aria-label="Aufgabenliste">
          {AUFGABEN.map((aufgabe) => (
            <li key={aufgabe.id} className="py-3 first:pt-0">
              {aufgabe.variant === "alert" ? (
                <div className="flex gap-2">
                  <AlertCircle
                    className="size-4 text-destructive mt-0.5 shrink-0"
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{aufgabe.text}</p>
                    {aufgabe.details && (
                      <ul className="mt-1.5 space-y-0.5" role="list">
                        {aufgabe.details.map((d) => (
                          <li key={d} className="text-sm pl-2 flex gap-1.5 items-start">
                            <span className="text-destructive shrink-0">•</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                    {aufgabe.warning && (
                      <p className="mt-1.5 text-sm text-muted-foreground leading-snug">
                        {aufgabe.warning}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 self-start"
                    aria-label={`Aktion: ${aufgabe.text}`}
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-sm leading-snug">{aufgabe.text}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label={`Aktion: ${aufgabe.text}`}
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-auto pt-6 text-sm text-muted-foreground">+ 2 weitere Aufgaben</p>
      </CardContent>
    </Card>
  )
}
