"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- Typen & Hilfsdaten ---

type DiensttauschAnfrage = {
  tag: string; datum: string; dienst: string; uhrzeit: string;
  gewDatum: string; gewDienst: string; gewPerson: string;
};

const DIENST_ZEITEN: Record<string, string> = {
  "Frühdienst":    "06:00 – 15:00",
  "BE Mo-Do (15)": "07:00 – 16:30",
  "BE Fr-Sa (5)":  "06:30 – 16:30",
  "BE So (2)":     "07:00 – 16:30",
  "Nachtdienst":   "22:00 – 06:00",
};

const TAG_ABKUERZ: Record<string, string> = {
  "Montag": "MO", "Dienstag": "DI", "Mittwoch": "MI",
  "Donnerstag": "DO", "Freitag": "FR", "Samstag": "SA", "Sonntag": "SO",
};

// "Mittwoch, 08. April 2026" → "MI, 08. April"
function formatGewDatum(d: string): string {
  const [wochentag, rest] = d.split(", ");
  const tag = TAG_ABKUERZ[wochentag] ?? wochentag.slice(0, 2).toUpperCase();
  const datum = rest?.replace(" 2026", "") ?? "";
  return `${tag}, ${datum}`;
}

// Tageszahl aus "Mittwoch, 08. April 2026" → "08"
function extractDatumNr(d: string): string {
  return d.split(", ")[1]?.split(".")[0]?.trim() ?? "";
}

// --- Sub-Komponenten ---

function TagDatum({ tag, datum }: { tag: string; datum: string }) {
  return (
    <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
      <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center w-full">{tag}</p>
      <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">{datum}</p>
    </div>
  );
}

function KwHeader({ zeitraum, stunden }: { zeitraum: string; stunden: string }) {
  return (
    <div className="flex items-center justify-between relative shrink-0 w-full pt-[4px] pb-[4px]">
      <p className="font-bold leading-normal not-italic text-[#100c08] text-[16px]">{zeitraum}</p>
      <div className="flex items-center gap-[8px]">
        <div className="bg-[#e7e6e5] flex items-center justify-center px-[12px] py-[4px] relative rounded-[8px] shrink-0">
          <p className="font-normal text-[#55514d] text-[14px]">{stunden}</p>
        </div>
        <button className="flex items-center justify-center shrink-0" aria-label="Optionen">
          <span className="material-symbols-rounded select-none" style={{ fontSize: "20px", color: "#55514d", fontVariationSettings: "'wght' 600" }}>more_vert</span>
        </button>
      </div>
    </div>
  );
}

function IconFrei() {
  return (
    <div className="bg-[#bacbed] flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]">
      <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center w-full">11</p>
    </div>
  );
}

function IconFruehdienst() {
  return (
    <div className="flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#F4A428" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" fill="white" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function IconNachtdienst() {
  return (
    <div className="flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#5B1F8A" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="white" />
      </svg>
    </div>
  );
}

function MenuDots({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Aktionen öffnen"
      className="self-start -mt-[2px] flex items-center justify-center cursor-pointer"
    >
      <span
        className="material-symbols-rounded select-none"
        style={{ fontSize: "24px", color: "#100c08", fontVariationSettings: "'wght' 600" }}
        aria-hidden="true"
      >
        more_horiz
      </span>
    </button>
  );
}

// --- DienstIcon Helper ---

function DienstIcon({ dienst }: { dienst: string }) {
  if (dienst === "Nachtdienst") return <IconNachtdienst />;
  if (dienst === "Frühdienst") return <IconFruehdienst />;
  if (dienst === "BE Mo-Do (15)") return <div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} />;
  if (dienst === "BE Fr-Sa (5)") return <div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FCEEA8" }} />;
  return (
    <Image src="/images/icon-spaetschicht.svg" alt={dienst} width={40} height={40} className="size-[40px]" />
  );
}

// --- AnfrageCard (gelb, mit Ablehnen/Annehmen) ---

function AnfrageCard({
  anfrage,
  onAblehnen,
  onAnnehmen,
}: {
  anfrage: DiensttauschAnfrage;
  onAblehnen: () => void;
  onAnnehmen: () => void;
}) {
  const gewZeit = DIENST_ZEITEN[anfrage.gewDienst] ?? "";
  const datumFormatiert = formatGewDatum(anfrage.gewDatum);
  return (
    <div
      className="flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px]"
      style={{
        backgroundColor: "#FEFBE9",
        border: "2px solid #F7D526",
        boxShadow: "2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      {/* Neu-Badge */}
      <div className="absolute z-20 bg-[#F7D526] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[16px]">
        <p className="font-normal text-[14px] text-black whitespace-nowrap">Neu</p>
      </div>

      {/* Mia's abzugebender Dienst: Icon, Zeit, Diensttyp */}
      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
            <DienstIcon dienst={anfrage.dienst} />
          </div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-normal leading-[1.4] text-[#100c08] text-[16px]">{anfrage.uhrzeit}</p>
          <p className="font-bold leading-[1.4] text-[#100c08] text-[16px]">{anfrage.dienst}</p>
        </div>
      </div>
      {/* Dauer / Pause */}
      <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
        <p className="font-normal leading-[1.4] min-w-full text-black text-[12px]">
          Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h
        </p>
      </div>

      {/* Tausch-Info */}
      <div className="flex flex-col gap-[2px] overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundColor: "#FDF2BE" }}>
        <p className="font-normal leading-[1.4] text-[16px] text-black">
          Luca Meier übernimmt dafür:
        </p>
        <p className="font-normal leading-[1.4] text-[16px] text-black">
          <span className="font-bold">{anfrage.gewDienst}</span>
          {gewZeit ? ` (${gewZeit})` : ""} vom {datumFormatiert}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-[12px] items-start relative shrink-0 w-full">
        <button
          onClick={onAblehnen}
          className="bg-white border-[#100c08] border-[1.5px] flex flex-[1_0_0] h-[40px] items-center justify-center rounded-[8px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <p className="font-bold text-[14px] text-[#100c08]">Ablehnen</p>
        </button>
        <button
          onClick={onAnnehmen}
          className="bg-white border-[#100c08] border-[1.5px] flex flex-[1_0_0] h-[40px] items-center justify-center rounded-[8px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <p className="font-bold text-[14px] text-[#100c08]">Annehmen</p>
        </button>
      </div>
    </div>
  );
}

// --- FreiKachel (Standard-Freikarte, ersetzt Dienst-Kachel wenn anfrageDatum passt) ---

function FreiKachel() {
  return (
    <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
            <IconFrei />
          </div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
          <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
        </div>
      </div>
    </div>
  );
}

// --- ApprovedDienstCard (weiss, nach Annehmen – bei anfrageDatum) ---

function ApprovedDienstCard({ dienst, uhrzeit }: { dienst: string; uhrzeit: string }) {
  return (
    <div
      className="flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px]"
      style={{
        backgroundColor: "white",
        boxShadow: "2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      <div className="absolute z-20 bg-[#174693] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[16px]">
        <p className="font-normal text-[14px] text-white whitespace-nowrap">Neu</p>
      </div>
      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
            <DienstIcon dienst={dienst} />
          </div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-normal leading-[1.4] text-[#100c08] text-[16px]">{uhrzeit}</p>
          <p className="font-bold leading-[1.4] text-[#100c08] text-[16px]">{dienst}</p>
        </div>
      </div>
      <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
        <p className="font-normal leading-[1.4] min-w-full text-black text-[12px]">
          Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h
        </p>
      </div>
      <div className="flex gap-[16px] items-start w-full p-[8px] rounded-[4px]" style={{ backgroundColor: "#F3F2F2" }}>
        <Image src="/images/icon-tausch.svg" alt="Tausch" width={16} height={16} className="shrink-0 mt-[2px]" />
        <div className="flex flex-col gap-0 min-w-0 flex-1">
          <p className="font-normal leading-[1.4] text-black text-[16px]">Dienst übernommen</p>
          <p className="font-normal leading-[1.4] text-black text-[16px]">(für Luca Meier)</p>
        </div>
      </div>
    </div>
  );
}

// --- ApprovedFreiCard (weiss, Frei nach Annehmen – anderer Tag als anfrageDatum) ---

function ApprovedFreiCard() {
  return (
    <div
      className="flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px]"
      style={{
        backgroundColor: "white",
        boxShadow: "2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      <div className="absolute z-20 bg-[#174693] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[16px]">
        <p className="font-normal text-[14px] text-white whitespace-nowrap">Neu</p>
      </div>
      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
            <IconFrei />
          </div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-bold leading-[1.4] text-[#100c08] text-[16px]">Kein Einsatz</p>
          <p className="font-normal leading-[1.4] text-[#100c08] text-[16px]">Ganzer Tag</p>
        </div>
      </div>
      <div className="flex gap-[16px] items-start w-full p-[8px] rounded-[4px]" style={{ backgroundColor: "#F3F2F2" }}>
        <Image src="/images/icon-tausch.svg" alt="Tausch" width={16} height={16} className="shrink-0 mt-[2px]" />
        <div className="flex flex-col gap-0 min-w-0 flex-1">
          <p className="font-normal leading-[1.4] text-black text-[16px]">Kein Dienst</p>
          <p className="font-normal leading-[1.4] text-black text-[16px]">(von Luca Meier übernommen)</p>
        </div>
      </div>
    </div>
  );
}

// --- EntfaelltCard (grau, Dienst der Mia übernehmen will) ---

function EntfaelltCard({
  dienst,
  uhrzeit,
  dauer,
  pause,
  icon,
}: {
  dienst: string;
  uhrzeit: string;
  dauer?: string;
  pause?: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px]"
      style={{
        backgroundColor: "#BEBAB6",
        boxShadow: "2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      {/* Entfällt-Badge */}
      <div className="absolute z-20 bg-[#696561] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[14px]">
        <p className="font-normal text-[13px] text-white whitespace-nowrap">Entfällt</p>
      </div>

      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
            {icon}
          </div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-normal leading-[1.4] text-[#55514d] text-[16px]">{uhrzeit}</p>
          <p className="font-bold leading-[1.4] text-[#55514d] text-[16px]">{dienst}</p>
        </div>
      </div>
      {dauer && (
        <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
          <p className="font-normal leading-[1.4] min-w-full text-[#55514d] text-[12px]">
            Dauer: {dauer}&nbsp;&nbsp;&nbsp;&nbsp;Pause: {pause}
          </p>
        </div>
      )}
      {/* Info-Box analog sbb-cal MI 08 */}
      <div
        className="flex flex-col gap-[2px] overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full"
        style={{ backgroundColor: "#CFCBC7" }}
      >
        <p className="font-normal leading-[1.4] text-black text-[16px]">
          Wird von Luca Meier übernommen.
        </p>
      </div>
    </div>
  );
}

// --- Haupt-Komponente ---

export default function DienstplanungJonasPage() {
  const router = useRouter();
  const [sheetOffen, setSheetOffen] = useState(false);
  const [anfrage, setAnfrage] = useState<DiensttauschAnfrage | null>(null);
  const [requestState, setRequestState] = useState<"pending" | "approved" | "denied">("pending");

  useEffect(() => {
    const raw = localStorage.getItem("diensttausch_anfrage");
    if (raw) {
      try { setAnfrage(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  // Tageszahl von Mia's abzugebendem Dienst → gelbe AnfrageCard erscheint bei diesem Datum
  const anfrageDatum = anfrage?.datum ?? "";
  // Tageszahl des Datums das Mia übernehmen will → wird zur grauen EntfaelltCard
  const gewDatumNr = anfrage ? extractDatumNr(anfrage.gewDatum) : "";
  // Dynamische Daten für die EntfaelltCard aus Mia's Auswahl
  const entfaelltDienst = anfrage?.gewDienst ?? "";
  const entfaelltZeit = DIENST_ZEITEN[entfaelltDienst] ?? "";
  // Sind gelbe AnfrageCard und graue EntfaelltCard am selben Tag?
  const gleichesDatum = anfrageDatum !== "" && anfrageDatum === gewDatumNr;

  // Zur AnfrageCard scrollen sobald Datum bekannt
  useEffect(() => {
    if (!anfrageDatum || requestState !== "pending") return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`tag-${anfrageDatum}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    return () => clearTimeout(timer);
  }, [anfrageDatum]);

  const handleMenuClick = () => {
    requestAnimationFrame(() => setSheetOffen(true));
  };

  const handleSchliessen = () => {
    setSheetOffen(false);
  };

  const handleAnnehmen = () => {
    setRequestState("approved");
    const raw = localStorage.getItem("diensttausch_anfrage");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        localStorage.setItem("diensttausch_anfrage", JSON.stringify({ ...data, status: "approved" }));
      } catch { /* ignore */ }
    }
  };

  const handleAblehnen = () => {
    setRequestState("denied");
    const raw = localStorage.getItem("diensttausch_anfrage");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        localStorage.setItem("diensttausch_anfrage", JSON.stringify({ ...data, status: "denied" }));
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="bg-white flex flex-col items-start min-h-screen w-full relative">

      {/* Header – sticky */}
      <div className="bg-[#f3f2f2] flex flex-col items-start overflow-clip sticky top-0 shrink-0 w-full z-[550]">
        <div className="flex flex-col items-start overflow-clip relative shrink-0 w-full">
          <div className="bg-white flex flex-col items-start justify-center overflow-clip relative shrink-0 w-full">
            <div className="flex h-[48px] items-center px-[24px] relative shrink-0 w-full gap-[8px]">
              {/* Links: Pfeil + Titel */}
              <button
                onClick={() => router.push("/demo-dashboard")}
                aria-label="Zurück"
                className="flex items-center justify-center shrink-0 size-[24px]"
              >
                <Image src="/images/icon-pfeil-links.svg" alt="Zurück" width={24} height={24} className="w-full h-full" />
              </button>
              <p className="font-bold leading-normal text-[16px]" style={{ color: "#04775B" }}>
                Einsatzplanung
              </p>
              {/* Rechts: Name + Sprachauswahl */}
              <div className="flex items-center gap-[10px] ml-auto shrink-0">
                <p className="text-[14px] font-normal text-[#100c08] whitespace-nowrap">Jonas Baumgartner</p>
                <button className="flex items-center gap-[3px] shrink-0 bg-[#f0efee] rounded-[6px] px-[8px] py-[5px]">
                  <span className="text-[13px] font-bold text-[#100c08]">DE</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="#100c08" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-[#e7e6e5] h-[4px] shrink-0 w-full" />
        </div>
      </div>

      {/* Inhalt */}
      <div className="bg-[#f3f2f2] flex flex-col gap-[12px] items-start pb-[80px] pt-[16px] px-[24px] relative shrink-0 w-full flex-1">

        {/* Shared helpers */}
        {/* Jede Zeile: <TagDatum> + <div flex-col> mit Original-Card + optional AnfrageCard */}

        {/* ── KW 15 ── */}
        <KwHeader zeitraum="06. – 12. April 2026 (KW 15)" stunden="32.00 h" />

        {/* MO 06 – BE Mo-Do (15) */}
        <div id="tag-06" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="MO" datum="06" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "06" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : anfrageDatum === "06" && anfrage && requestState !== "denied" ? (
              requestState === "pending" ? <FreiKachel /> : null
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
                  </div>
                  <MenuDots onClick={handleMenuClick} />
                </div>
                <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
                </div>
              </div>
            )}
            {anfrageDatum === "06" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* DI 07 – Frei */}
        <div id="tag-07" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="DI" datum="07" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "07" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "07" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* MI 08 – BE Mo-Do (15) */}
        <div id="tag-08" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="MI" datum="08" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "08" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : anfrageDatum === "08" && anfrage && requestState !== "denied" ? (
              requestState === "pending" ? <FreiKachel /> : null
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
                  </div>
                  <MenuDots onClick={handleMenuClick} />
                </div>
                <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
                </div>
              </div>
            )}
            {anfrageDatum === "08" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* DO 09 – BE Mo-Do (15) */}
        <div id="tag-09" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="DO" datum="09" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "09" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : anfrageDatum === "09" && anfrage && requestState !== "denied" ? (
              requestState === "pending" ? <FreiKachel /> : null
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
                  </div>
                  <MenuDots onClick={handleMenuClick} />
                </div>
                <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
                </div>
              </div>
            )}
            {anfrageDatum === "09" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* FR 10 – BE Fr-Sa (5) */}
        <div id="tag-10" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="FR" datum="10" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "10" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : anfrageDatum === "10" && anfrage && requestState !== "denied" ? (
              requestState === "pending" ? <FreiKachel /> : null
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FCEEA8" }} /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">06:30 – 16:30</p>
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Fr-Sa (5)</p>
                  </div>
                  <MenuDots onClick={handleMenuClick} />
                </div>
                <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
                </div>
              </div>
            )}
            {anfrageDatum === "10" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* SA 11 – Frei */}
        <div id="tag-11" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="SA" datum="11" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "11" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "11" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* SO 12 – Frei */}
        <div id="tag-12" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="SO" datum="12" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "12" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "12" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* ── KW 16 ── */}
        <KwHeader zeitraum="13. – 19. April 2026 (KW 16)" stunden="16.00 h" />

        {/* MO 13 – BE Mo-Do (15) */}
        <div id="tag-13" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="MO" datum="13" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "13" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : anfrageDatum === "13" && anfrage && requestState !== "denied" ? (
              requestState === "pending" ? <FreiKachel /> : null
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
                  </div>
                  <MenuDots onClick={handleMenuClick} />
                </div>
                <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
                </div>
              </div>
            )}
            {anfrageDatum === "13" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* DI 14 – BE Mo-Do (15) */}
        <div id="tag-14" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="DI" datum="14" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "14" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : anfrageDatum === "14" && anfrage && requestState !== "denied" ? (
              requestState === "pending" ? <FreiKachel /> : null
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
                  </div>
                  <MenuDots onClick={handleMenuClick} />
                </div>
                <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
                </div>
              </div>
            )}
            {anfrageDatum === "14" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* MI 15 – Frei (Fixer freier Tag) */}
        <div id="tag-15" className="flex items-start relative shrink-0 w-full mt-[6px] scroll-mt-[64px]">
          <TagDatum tag="MI" datum="15" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "15" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Ganzer Tag</p>
                  </div>
                  <MenuDots onClick={handleMenuClick} />
                </div>
                <div className="flex flex-col gap-[2px] items-start pl-[8px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#55514d] text-[12px]">&ldquo;Fixer freier Tag&rdquo;</p>
                  <div className="flex gap-[6px] items-center relative shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17.65 6.35A8 8 0 1 0 19.73 13H17.65A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#55514d" /></svg>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#55514d] text-[12px]">Wiederholung: Jede Woche</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "15" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* DO 16 – Frei */}
        <div id="tag-16" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="DO" datum="16" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "16" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "16" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* FR 17 – Frei */}
        <div id="tag-17" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="FR" datum="17" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "17" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "17" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* SA 18 – Frei */}
        <div id="tag-18" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="SA" datum="18" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "18" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "18" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* SO 19 – Frei */}
        <div id="tag-19" className="flex items-start relative shrink-0 w-full scroll-mt-[64px]">
          <TagDatum tag="SO" datum="19" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {gewDatumNr === "19" && anfrage && requestState !== "denied" ? (
              requestState === "pending"
                ? <EntfaelltCard dienst={entfaelltDienst} uhrzeit={entfaelltZeit} dauer="8:00 h" pause="1:00 h" icon={<DienstIcon dienst={entfaelltDienst} />} />
                : gleichesDatum ? null : <ApprovedFreiCard />
            ) : (
              <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch"><div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div></div>
                  <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
                  </div>
                </div>
              </div>
            )}
            {anfrageDatum === "19" && anfrage && (
              requestState === "pending" ? (
                <AnfrageCard anfrage={anfrage} onAblehnen={handleAblehnen} onAnnehmen={handleAnnehmen} />
              ) : requestState === "approved" ? (
                <ApprovedDienstCard dienst={anfrage.dienst} uhrzeit={anfrage.uhrzeit} />
              ) : null
            )}
          </div>
        </div>

        {/* Link: Nächste 2 Wochen */}
        <div className="pt-[24px] pb-[24px] w-full text-center">
          <button className="text-[14px] font-normal text-[#174693] cursor-pointer">
            Nächste 2 Wochen anzeigen
          </button>
        </div>

      </div>

      {/* ── Action Sheet ── */}
      {sheetOffen && (
        <>
          <div
            className={`fixed inset-0 z-[600] bg-black/40 transition-opacity duration-300 ${sheetOffen ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={handleSchliessen}
          />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[700] w-full max-w-[390px]">
            <div
              className={`bg-white rounded-t-[16px] px-[24px] pb-[40px] pt-[16px] transition-transform duration-300 ease-out ${sheetOffen ? "translate-y-0" : "translate-y-full"}`}
            >
              <div className="w-[40px] h-[4px] rounded-full bg-[#e7e6e5] mx-auto mb-[20px]" />
              <button
                onClick={handleSchliessen}
                className="flex items-center gap-[12px] w-full py-[14px] text-left hover:bg-[#f3f2f2] rounded-[8px] px-[8px] transition-colors cursor-pointer"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "22px", color: "#100c08" }}>calendar_today</span>
                <span className="text-[16px] font-normal text-[#100c08]">Tageskalender anzeigen</span>
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
