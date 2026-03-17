import { MoreHorizontal, X, Check } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Antrag {
  id: string
  name: string
  photo: string
  label: string
  date: string
}

const ANTRAEGE: Antrag[] = [
  {
    id: "1",
    name: "Lee Eva",
    photo: "https://i.pravatar.cc/80?img=5",
    label: "Lee Eva hat Ferien angefragt",
    date: "MO, 17. – FR, 28. März 2026",
  },
  {
    id: "2",
    name: "Muster Dave",
    photo: "https://i.pravatar.cc/80?img=52",
    label: "Muster Dave hat Ferien angefragt",
    date: "DO, 02. – MI, 08. April 2026",
  },
  {
    id: "3",
    name: "Rocconi Andrea",
    photo: "https://i.pravatar.cc/80?img=29",
    label: "Rocconi Andrea hat Ferien angefragt",
    date: "MO, 27. April – FR, 01. Mai 2026",
  },
]

export const OffeneAntraegeCard = () => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Offene Anträge</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Mehr Optionen für offene Anträge"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ul
          className="divide-y divide-border"
          role="list"
          aria-label="Offene Ferienanträge"
        >
          {ANTRAEGE.map((antrag) => (
            <li key={antrag.id} className="flex items-start gap-3 py-3 first:pt-0">
              <img
                src={antrag.photo}
                alt={antrag.name}
                className="size-10 rounded-full shrink-0 object-cover"
              />

              <p className="flex-1 text-sm leading-snug">
                <span>{antrag.label}</span>
                <br />
                <span style={{ color: "#767676" }}>{antrag.date}</span>
              </p>

              <div className="flex gap-2 shrink-0 mt-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Antrag von ${antrag.name} ablehnen`}
                >
                  <X className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  aria-label={`Antrag von ${antrag.name} genehmigen`}
                >
                  <Check className="size-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-auto pt-6 text-sm text-muted-foreground">
          + 10 weitere Anträge
        </p>
      </CardContent>
    </Card>
  )
}
