"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TRIGGER_CLASSES =
  "h-8 text-sm font-semibold bg-muted border-muted hover:bg-muted/80 text-foreground"

export const AppHeader = () => {
  const [genossenschaft, setGenossenschaft] = useState(
    "11719 Muster Filiale A"
  )
  const [pee, setPee]   = useState("Alle PEEs")
  const [lang, setLang] = useState("DE")

  const handleGenossenschaft = (v: string | null) => { if (v) setGenossenschaft(v) }
  const handlePee            = (v: string | null) => { if (v) setPee(v) }
  const handleLang           = (v: string | null) => { if (v) setLang(v) }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="h-12 flex items-center gap-2 px-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          aria-label="Menü öffnen"
        >
          <Menu className="size-4" />
        </Button>

        <span
          className="text-sm font-semibold shrink-0"
          style={{ color: "#04775B" }}
        >
          Mitarbeiterportal
        </span>

        {/* Genossenschaft select – ab 768px sichtbar */}
        <div className="hidden md:flex items-center ml-1">
          <Select value={genossenschaft} onValueChange={handleGenossenschaft}>
            <SelectTrigger className={TRIGGER_CLASSES} aria-label="Genossenschaft wählen">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="11719 Muster Filiale A">11719 Muster Filiale A</SelectItem>
              <SelectItem value="22845 Muster Filiale B">22845 Muster Filiale B</SelectItem>
              <SelectItem value="33621 Muster Filiale C">33621 Muster Filiale C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PEE select – ab 880px sichtbar, blendet früher aus um Overflow zu vermeiden */}
        <div className="hidden min-[880px]:flex items-center ml-1">
          <Select value={pee} onValueChange={handlePee}>
            <SelectTrigger className={TRIGGER_CLASSES} aria-label="PEEs wählen">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alle PEEs">Alle PEEs</SelectItem>
              <SelectItem value="PEE 1">PEE 1</SelectItem>
              <SelectItem value="PEE 2">PEE 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        <span className="text-sm hidden lg:block shrink-0 text-muted-foreground mr-16">
          Anna Sanchez
        </span>

        {/* Quick links – unter 400px ausgeblendet */}
        <nav className="hidden min-[400px]:flex items-center gap-2.5" aria-label="Schnellzugriff">
          <Button
            variant="ghost"
            className="!p-0 shrink-0 rounded-lg hover:opacity-90 flex items-center justify-center border border-transparent"
            style={{ backgroundColor: "#E5F1EE", height: "calc(2rem + 2px)", width: "calc(2rem + 2px)" }}
            aria-label="Startseite"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#home-clip)">
                <path
                  d="M1.21143 21.1029V8.96571C1.21143 8.53866 1.30695 8.13409 1.498 7.752C1.68904 7.3699 1.95314 7.05524 2.29028 6.808L10.3817 0.739426C10.8537 0.379806 11.3931 0.199997 12 0.199997C12.6069 0.199997 13.1463 0.379806 13.6183 0.739426L21.7097 6.808C22.0469 7.05524 22.311 7.3699 22.502 7.752C22.693 8.13409 22.7886 8.53866 22.7886 8.96571V21.1029C22.7886 21.8446 22.5245 22.4795 21.9963 23.0077C21.4681 23.5359 20.8331 23.8 20.0914 23.8H16.0457C15.6636 23.8 15.3433 23.6708 15.0849 23.4123C14.8264 23.1538 14.6971 22.8335 14.6971 22.4514V15.7086C14.6971 15.3265 14.5679 15.0062 14.3094 14.7477C14.051 14.4892 13.7307 14.36 13.3486 14.36H10.6514C10.2693 14.36 9.94905 14.4892 9.69057 14.7477C9.43209 15.0062 9.30285 15.3265 9.30285 15.7086V22.4514C9.30285 22.8335 9.17362 23.1538 8.91514 23.4123C8.65666 23.6708 8.33638 23.8 7.95428 23.8H3.90857C3.16685 23.8 2.5319 23.5359 2.00371 23.0077C1.47552 22.4795 1.21143 21.8446 1.21143 21.1029Z"
                  fill="#04775B"
                />
              </g>
              <defs>
                <clipPath id="home-clip">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Button>

          <Button
            variant="ghost"
            className="!p-0 shrink-0 text-[11px] font-bold bg-muted hover:bg-[#E5F1EE] rounded-lg flex items-center justify-center border border-transparent"
            style={{ height: "calc(2rem + 2px)", width: "calc(2rem + 2px)" }}
            aria-label="PEP"
            onClick={() => window.open("http://www.ergon.ch/", "_blank", "noopener,noreferrer")}
          >
            PEP
          </Button>

          <Button
            variant="ghost"
            className="!p-0 shrink-0 text-[11px] font-bold bg-muted hover:bg-[#E5F1EE] rounded-lg flex items-center justify-center border border-transparent"
            style={{ height: "calc(2rem + 2px)", width: "calc(2rem + 2px)" }}
            aria-label="SP"
          >
            SP
          </Button>

          <Button
            variant="ghost"
            className="!p-0 shrink-0 text-[11px] font-bold bg-muted hover:bg-[#E5F1EE] rounded-lg flex items-center justify-center border border-transparent"
            style={{ height: "calc(2rem + 2px)", width: "calc(2rem + 2px)" }}
            aria-label="RP"
          >
            RP
          </Button>

          <Button
            variant="ghost"
            className="!p-0 shrink-0 text-[11px] font-bold bg-muted hover:bg-[#E5F1EE] rounded-lg flex items-center justify-center border border-transparent"
            style={{ height: "calc(2rem + 2px)", width: "calc(2rem + 2px)" }}
            aria-label="ZE"
          >
            ZE
          </Button>

          <Button
            variant="ghost"
            className="!p-0 shrink-0 text-[11px] font-bold bg-muted hover:bg-[#E5F1EE] rounded-lg flex items-center justify-center border border-transparent"
            style={{ height: "calc(2rem + 2px)", width: "calc(2rem + 2px)" }}
            aria-label="AP"
          >
            AP
          </Button>
        </nav>

        {/* Divider + Sprachauswahl – unter 400px ausgeblendet */}
        <div className="hidden min-[400px]:block w-px h-5 bg-border shrink-0" aria-hidden />

        <div className="hidden min-[400px]:block">
          <Select value={lang} onValueChange={handleLang}>
            <SelectTrigger className={`${TRIGGER_CLASSES} w-16`} aria-label="Sprache wählen">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DE">DE</SelectItem>
              <SelectItem value="FR">FR</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  )
}
