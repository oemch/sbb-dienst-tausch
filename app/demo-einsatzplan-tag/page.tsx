"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const TAG_KURZ: Record<string, string> = {
  MO: "Mo", DI: "Di", MI: "Mi", DO: "Do", FR: "Fr", SA: "Sa", SO: "So",
};

const DIENST_INFO: Record<string, { dauer: string; pause: string }> = {
  "Frühschicht": { dauer: "8:00 h", pause: "0:20 h" },
  "Spätschicht": { dauer: "8:00 h", pause: "0:20 h" },
  "Nachtschicht": { dauer: "8:00 h", pause: "0:30 h" },
};

// Icon je Einsatztyp (konsistent mit Wochenplan)
function ShiftIcon({ dienst }: { dienst: string }) {
  if (dienst === "Spätschicht") {
    return <Image src="/images/icon-spaetschicht.svg" alt="" width={36} height={36} className="size-[36px] shrink-0" />;
  }
  if (dienst === "Nachtschicht") {
    return (
      <div className="flex items-center justify-center rounded-[32px] shrink-0 size-[36px]" style={{ backgroundColor: "#5B1F8A" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="white" />
        </svg>
      </div>
    );
  }
  // Frühschicht (Default)
  return (
    <div className="flex items-center justify-center rounded-[32px] shrink-0 size-[36px]" style={{ backgroundColor: "#FFD09D" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" fill="#100c08" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#100c08" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function EinsatzplanTagInner() {
  const router = useRouter();
  const p = useSearchParams();

  const tag = p.get("tag") ?? "MI";
  const datum = p.get("datum") ?? "08";
  const dienst = p.get("dienst") ?? "Spätschicht";
  const uhrzeit = p.get("uhrzeit") ?? "14:00 – 22:00";

  const info = DIENST_INFO[dienst] ?? { dauer: "8:00 h", pause: "0:20 h" };
  const tagKurz = TAG_KURZ[tag] ?? tag;
  const datumLabel = `${tagKurz}, ${parseInt(datum, 10)}.4.`;

  // Zeiten parsen ("14:00 – 22:00" → 14, 22)
  const [startStr, endStr] = uhrzeit.split("–").map((s) => s.trim());
  const startHour = parseInt(startStr, 10) || 6;
  const endHour = parseInt(endStr, 10) || startHour + 8;

  // Timeline 06:00 – 23:00
  const START = 6;
  const END = 23;
  const H = 53; // px pro Stunde (30% kompakter → mehr vom Tag sichtbar)
  const hours = Array.from({ length: END - START + 1 }, (_, i) => START + i);
  const cardTop = (startHour - START) * H;
  const cardHeight = (endHour - startHour) * H;

  const [sheetOffen, setSheetOffen] = useState(false);
  const oeffneSheet = () => requestAnimationFrame(() => setSheetOffen(true));
  const schliesse = () => setSheetOffen(false);

  const starteTausch = () => {
    const params = new URLSearchParams({ tag, datum, dienst, uhrzeit });
    setSheetOffen(false);
    router.push(`/demo-dienst-tausch?${params.toString()}`);
  };

  return (
    <div className="bg-white flex flex-col items-start min-h-screen w-full relative">

      {/* Header */}
      <div className="bg-white sticky top-0 z-[550] w-full shadow-[0_1px_0_0_#e7e6e5]">
        <div className="flex h-[48px] items-center px-[16px] relative w-full">
          <button onClick={() => router.back()} aria-label="Zurück" className="flex items-center justify-center size-[40px] cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="absolute left-1/2 -translate-x-1/2 font-bold text-[17px] text-[#100c08]">Dienstplan</p>
          <div className="ml-auto flex items-center justify-center size-[40px] text-[#100c08]" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
          </div>
        </div>
      </div>

      {/* Tageszeile */}
      <div className="w-full border-b border-[#e7e6e5]">
        <div className="flex items-center gap-[12px] px-[20px] py-[12px]">
          <button aria-label="Vorheriger Tag" className="flex items-center justify-center size-[28px] text-[#100c08] cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <p className="text-[22px] font-bold" style={{ color: "#04775B" }}>{datumLabel}</p>
          <div className="bg-[#e7e6e5] flex items-center justify-center px-[12px] py-[4px] rounded-[8px]">
            <p className="text-[14px] text-[#55514d]">{info.dauer}</p>
          </div>
          <button aria-label="Nächster Tag" className="ml-auto flex items-center justify-center size-[28px] text-[#100c08] cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="w-full flex-1 px-[20px] pt-[16px] pb-[40px]">
        <div className="relative w-full" style={{ height: (END - START) * H + 24 }}>
          {/* Stunden-Raster */}
          {hours.map((h, i) => (
            <div key={h} className="absolute left-0 right-0" style={{ top: i * H }}>
              <span className="absolute -translate-y-1/2 left-0 text-[15px] text-[#9b9894]">
                {String(h).padStart(2, "0")}:00
              </span>
              <div className="absolute left-[64px] right-0 top-0 h-px bg-[#e7e6e5]" />
            </div>
          ))}

          {/* Schicht-Karte auf der Timeline */}
          <div className="absolute left-[64px] right-0" style={{ top: cardTop, height: cardHeight }}>
            <div
              className="relative h-full w-full rounded-[8px] px-[16px] pt-[14px]"
              style={{ backgroundColor: "#FEFBE9", border: "1px solid #EFE7B0" }}
            >
              {/* Kopf: Icon + Titel/Zeit + i + … */}
              <div className="flex items-start gap-[12px]">
                <div className="pt-[2px]"><ShiftIcon dienst={dienst} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[18px] font-bold text-[#100c08] leading-[1.3]">{dienst}</p>
                  <p className="text-[16px] font-normal text-[#100c08] leading-[1.3]">{uhrzeit}</p>
                </div>
                <div className="flex items-center gap-[10px] shrink-0">
                  <div className="flex items-center justify-center size-[24px] rounded-full bg-[#174693]" aria-hidden="true">
                    <span className="text-white text-[14px] font-bold italic leading-none">i</span>
                  </div>
                  <button onClick={oeffneSheet} aria-label="Aktionen öffnen" className="flex items-center justify-center size-[28px] text-[#100c08] cursor-pointer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
                  </button>
                </div>
              </div>
              {/* Dauer / Pause */}
              <p className="mt-[10px] pl-[48px] text-[14px] text-[#100c08]">
                Dauer: {info.dauer}&nbsp;&nbsp;&nbsp;&nbsp;Pause: {info.pause}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Aktionen-Sheet ── */}
      {sheetOffen && (
        <>
          <div className="fixed inset-0 z-[600] bg-black/40" onClick={schliesse} aria-hidden="true" />
          <div className="fixed inset-x-0 bottom-0 z-[700] mx-auto max-w-[390px] bg-white rounded-t-[20px] px-[24px] pb-[40px] pt-[16px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
            <div className="mx-auto mb-[16px] h-[4px] w-[40px] rounded-full bg-[#cfcbc7]" />
            <p className="text-[18px] font-bold text-[#100c08] mb-[8px]">Aktionen</p>
            <button className="flex items-center gap-[16px] w-full py-[16px] text-left" onClick={starteTausch}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M7 16H3m0 0l3-3m-3 3l3 3" />
                <path d="M17 8h4m0 0l-3-3m3 3l-3 3" />
                <path d="M3 8h13a1 1 0 0 1 1 1v4" />
                <path d="M21 16H8a1 1 0 0 1-1-1v-4" />
              </svg>
              <span className="text-[16px] text-[#100c08]">Dienst tauschen</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function EinsatzplanTagPage() {
  return (
    <Suspense>
      <EinsatzplanTagInner />
    </Suspense>
  );
}
