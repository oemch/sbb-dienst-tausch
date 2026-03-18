"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProfileSheet from "../components/ProfileSheet";

type TauschAnfrage = {
  dienst: string;
  tag: string;
  datum: string;
  status?: string;
};

export default function DashboardMiaPage() {
  const today = new Intl.DateTimeFormat("de-CH", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const [anfrage, setAnfrage] = useState<TauschAnfrage | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("diensttausch_anfrage");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAnfrage(parsed);
        // Wenn Mia das Ergebnis sieht, Flag setzen → beim nächsten Login wird geleert
        if (parsed.status === "approved" || parsed.status === "denied") {
          localStorage.setItem("mia_result_acknowledged", "true");
        }
      } catch { /* ignore */ }
    }
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start bg-white">

      {/* Header */}
      <header className="relative z-[550] w-full shrink-0">
        <div className="flex h-12 w-full items-center justify-center px-6">
          <div className="flex min-h-px min-w-px flex-1 flex-col items-start justify-center">
            <Link
              href="/sbb-dashboard-mia"
              className="text-xs font-normal leading-normal text-[#100c08] hover:underline"
            >
              ZESAM
            </Link>
            <Link
              href="/sbb-dashboard-mia"
              className="-mt-1 text-base font-bold leading-normal text-[#100c08] hover:underline"
            >
              Mitarbeiterportal
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <div className="relative ml-3 size-6 shrink-0">
              <Image
                src="/images/icon-email.svg"
                alt="E-Mail"
                width={25}
                height={19}
                className="h-full w-full"
              />
            </div>
            <ProfileSheet />
          </div>
        </div>
        <div className="h-1 w-full bg-[#e7e6e5]" />
      </header>

      {/* Hauptinhalt */}
      <main className="flex w-full flex-1 shrink-0 flex-col items-start justify-between bg-[#f6f5f5] px-6 pb-6 pt-6">

        {/* Datum + Karten */}
        <div className="relative w-full shrink-0">
          <div className="relative flex w-full flex-col items-start gap-2 pb-4">

            {/* Name */}
            <p className="text-[13px] font-normal leading-normal text-black -mb-1">Luca Meier</p>

            {/* Datum-Zeile */}
            <div className="relative h-10 w-full shrink-0">
              <p className="absolute left-0 top-0 text-[22px] font-normal leading-normal text-black">
                {today}
              </p>
              <div className="absolute right-0 top-0 flex size-6 items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Weitere Optionen">
                  <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="#100c08" />
                </svg>
              </div>
            </div>

            {/* Karten */}
            <div className="flex w-full shrink-0 flex-col items-start gap-2">

              {/* Dienst-Tausch Status-Card (angenommen / abgelehnt) */}
              {(anfrage?.status === "approved" || anfrage?.status === "denied") && (
                <Link
                  href={anfrage.status === "approved" ? "/sbb-dienstplanung-mia" : "#"}
                  className="flex w-full shrink-0 items-center gap-3 rounded-lg pl-4 pr-5 py-3 shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: anfrage.status === "approved" ? "#AFE7B2" : "#FFD09D" }}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-clip rounded-[32px] bg-white">
                    <Image src="/images/icon-tausch.svg" alt="Tausch" width={16} height={16} className="size-4" />
                  </div>
                  <div className="flex flex-1 min-w-0 flex-col items-start justify-center">
                    <p className="text-base font-bold leading-[1.4] text-[#100c08]">
                      {anfrage.status === "approved" ? "Einsatz tauschen" : "Dienst tauschen"}
                    </p>
                    <p className="text-sm font-normal leading-[1.4] text-[#100c08]">
                      Jonas Baumgartner hat{" "}
                      <span className="font-bold">{anfrage.dienst}</span>
                      {` (${anfrage.tag}, ${anfrage.datum}. April) `}
                      {anfrage.status === "approved" ? "angenommen." : "abgelehnt."}
                    </p>
                  </div>
                </Link>
              )}

              {/* BE Mo-Do (15) */}
              <div className="relative flex w-full shrink-0 flex-col items-start gap-2 overflow-clip rounded-lg bg-white pb-5 pl-4 pt-2 shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="relative flex w-full shrink-0 items-start pr-3">
                  <div className="relative flex min-h-px min-w-px flex-1 items-center pt-3">
                    <div className="relative flex min-h-px min-w-px flex-1 items-center justify-center gap-3">
                      <div className="flex shrink-0 items-start pt-[3px]">
                        <div className="rounded-[32px] size-10 shrink-0" style={{ backgroundColor: "#FFD09D" }} />
                      </div>
                      <div className="relative flex min-h-px min-w-px flex-1 flex-col items-start justify-center">
                        <p className="relative shrink-0 text-sm font-normal leading-[1.4] text-[#100c08]">07:00 – 16:30</p>
                        <p className="relative min-h-px min-w-px flex-1 shrink-0 text-base font-bold leading-[1.4] text-[#100c08]">BE Mo-Do (15)</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex size-12 shrink-0 items-center justify-end py-2 pl-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90" aria-hidden="true">
                      <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="#100c08" />
                    </svg>
                  </div>
                </div>
                <div className="relative flex w-full shrink-0 flex-row items-start gap-2 pl-2 pr-6">
                  <p className="relative shrink-0 text-[13px] font-normal leading-[1.4] text-[#100c08]">Dauer: 8:00 h</p>
                  <p className="relative shrink-0 text-[13px] font-normal leading-[1.4] text-[#100c08]">Pause: 0:20 h</p>
                </div>
              </div>

              {/* Einsatzplanung + Ferien */}
              <div className="relative flex w-full shrink-0 items-start gap-2">
                <Link href="/sbb-dienstplanung-mia" className="flex flex-1 shrink-0 flex-col items-start gap-3 self-stretch rounded-xl bg-white p-5 shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                  <Image src="/images/icon-calendar.svg" alt="Kalender" width={24} height={24} className="relative shrink-0" />
                  <p className="relative shrink-0 text-base font-bold leading-[1.4] text-[#100c08]">Einsatzplanung</p>
                </Link>
                <div className="flex flex-1 shrink-0 flex-col items-start gap-3 rounded-xl bg-white p-5 shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                  <Image src="/images/icon-ferien.svg" alt="Ferien" width={24} height={24} className="relative shrink-0" />
                  <p className="relative min-w-full shrink-0 text-base font-bold leading-[1.4] text-[#100c08]">Ferien und Absenzen</p>
                </div>
              </div>

              {/* Feriensaldo */}
              <div className="flex w-full shrink-0 flex-col items-start gap-4 overflow-clip rounded-lg bg-white px-5 py-[18px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <p className="relative w-full shrink-0 text-base font-bold leading-normal text-[#100c08]">Feriensaldo</p>
                <div className="relative flex w-full shrink-0 items-center gap-2">
                  <div className="flex shrink-0 items-center justify-end overflow-clip rounded bg-[#174693] px-2 py-1 w-[calc((100%-16px)*18/31)]">
                    <p className="relative shrink-0 text-sm font-bold leading-normal text-white">18</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-center overflow-clip rounded border-2 border-dashed border-[#174693] bg-white px-2 py-1 w-[calc((100%-16px)*5/31)]">
                    <p className="relative shrink-0 text-sm font-bold leading-normal text-black">5</p>
                  </div>
                  <div className="flex min-h-px min-w-px flex-1 items-center justify-end overflow-clip rounded bg-[#AFE7B2] px-2 py-1">
                    <p className="relative shrink-0 text-sm font-bold leading-normal text-black">8</p>
                  </div>
                </div>
                <div className="relative flex w-full shrink-0 items-center justify-between">
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="h-3 w-5 shrink-0 rounded-sm bg-[#174693]" />
                    <p className="relative shrink-0 text-xs font-normal leading-[1.4] text-[#100c08]">Bewilligt</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="h-3 w-5 shrink-0 rounded-sm border-2 border-dashed border-[#174693] bg-white" />
                    <p className="relative shrink-0 text-xs font-normal leading-[1.4] text-[#100c08]">Beantragt</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="h-3 w-5 shrink-0 rounded-sm bg-[#AFE7B2]" />
                    <p className="relative shrink-0 text-xs font-normal leading-[1.4] text-[#100c08]">Verfügbar</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Ereignisse */}
        <div className="relative mt-auto w-full shrink-0">
          <div className="relative flex w-full flex-col items-start gap-4">
            <div className="relative flex w-full shrink-0 items-center gap-2">
              <div className="relative size-6 shrink-0 overflow-clip">
                <Image src="/images/icon-alert.svg" alt="Alert" width={24} height={24} className="h-full w-full" />
              </div>
              <p className="relative min-h-px min-w-px flex-1 text-base font-bold leading-[1.4] text-[#100c08]">Ereignisse</p>
            </div>
            <div className="flex w-full items-stretch gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x">
              <div className="flex w-[264px] min-w-[264px] shrink-0 flex-col items-start gap-2 overflow-clip rounded-xl bg-white pb-8 pl-5 pr-6 pt-6 shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="relative flex w-full shrink-0 items-center justify-center gap-2">
                  <Image src="/images/icon-warning.svg" alt="Warnung" width={18} height={18} className="relative shrink-0" />
                  <p className="relative min-h-px min-w-px flex-1 text-sm font-bold leading-[1.4] text-[#100c08]">Achtung, Planungsänderung</p>
                </div>
                <div className="relative w-full shrink-0 text-sm font-normal leading-[1.4] text-[#100c08]">
                  <p>Ihre Planung in der KW 52</p>
                  <p>wurde geändert.</p>
                </div>
              </div>
              <div className="flex w-[264px] min-w-[264px] shrink-0 flex-col items-start gap-2 rounded-xl bg-white pb-8 pl-5 pr-6 pt-6 text-sm text-[#100c08] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <p className="relative h-5 shrink-0 font-bold">Ferien 2025 eintragen</p>
                <div className="relative w-full shrink-0 font-normal leading-[1.4]">
                  <p>Sie haben noch</p>
                  <p>10/30 Tage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
