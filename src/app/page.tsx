import { Calendar, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/dashboard/app-header"
import { AufgabenCard } from "@/components/dashboard/aufgaben-card"
import { OffeneAntraegeCard } from "@/components/dashboard/offene-antraege-card"
import { PersonalCard } from "@/components/dashboard/personal-card"
import { GeplantEinsaetzeCard } from "@/components/dashboard/geplante-einsaetze-card"
import { KommunikationSidebar } from "@/components/dashboard/kommunikation-sidebar"
import { FooterNav } from "@/components/dashboard/footer-nav"

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export default function DashboardPage() {
  const todayLabel = formatDate(new Date())

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <AppHeader />

      <main>
        <div className="px-4 pt-6 pb-8 flex flex-col gap-6">

          <div className="flex items-center justify-between">
            <h1
              className="font-semibold text-black"
              style={{ fontSize: "22px" }}
            >
              {todayLabel}
            </h1>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Kalender öffnen"
              >
                <Calendar className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Mehr Optionen"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <AufgabenCard />
            <OffeneAntraegeCard />
            <PersonalCard />
          </div>

          <KommunikationSidebar />

          <GeplantEinsaetzeCard />

          <FooterNav />
        </div>
      </main>
    </div>
  )
}
