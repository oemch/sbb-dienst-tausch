import {
  ExternalLink,
  HelpCircle,
  LogOut,
  Maximize2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface FooterItem {
  id: string
  label: string
  icon: LucideIcon
  ariaLabel: string
  bgColor?: string
}

const MAIN_ITEMS: FooterItem[] = [
  {
    id: "leistung",
    label: "Leistungsübersicht",
    icon: Maximize2,
    ariaLabel: "Leistungsübersicht öffnen",
  },
  {
    id: "absenzen",
    label: "Absenzen",
    icon: ExternalLink,
    ariaLabel: "Absenzen öffnen",
  },
  {
    id: "mitarbeiter",
    label: "Mitarbeiterverwaltung",
    icon: ExternalLink,
    ariaLabel: "Mitarbeiterverwaltung öffnen",
  },
  {
    id: "reports",
    label: "Reports",
    icon: ExternalLink,
    ariaLabel: "Reports öffnen",
  },
  {
    id: "einsatz",
    label: "Einsatzeinteilung",
    icon: ExternalLink,
    ariaLabel: "Einsatzeinteilung öffnen",
  },
  {
    id: "monatsjournal",
    label: "Monatsjournal",
    icon: ExternalLink,
    ariaLabel: "Monatsjournal öffnen",
  },
]

const SEC_ITEMS: FooterItem[] = [
  {
    id: "hilfe",
    label: "Hilfe",
    icon: HelpCircle,
    ariaLabel: "Hilfe öffnen",
    bgColor: "#EDEDED",
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
    ariaLabel: "Abmelden",
    bgColor: "#EDEDED",
  },
]

const FooterCard = ({ item }: { item: FooterItem }) => {
  const Icon = item.icon
  return (
    <button
      tabIndex={0}
      aria-label={item.ariaLabel}
      className="flex flex-col items-center justify-center gap-2.5 rounded-xl px-3 py-5 text-center shadow-[0_4px_24px_0_rgba(16,12,8,0.24)] transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      style={{ backgroundColor: item.bgColor ?? "var(--card)" }}
    >
      <Icon className="size-5 text-muted-foreground" aria-hidden />
      <span className="text-[0.8125rem] leading-tight">{item.label}</span>
    </button>
  )
}

export const FooterNav = () => {
  return (
    <nav
      aria-label="Schnellnavigation"
      className="pt-6 pb-8"
    >
      {/* 2 cols xs → 4 cols sm → 8 cols lg – tiles wrap before text overflows */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {MAIN_ITEMS.map((item) => (
          <FooterCard key={item.id} item={item} />
        ))}
        {SEC_ITEMS.map((item) => (
          <FooterCard key={item.id} item={item} />
        ))}
      </div>
    </nav>
  )
}
