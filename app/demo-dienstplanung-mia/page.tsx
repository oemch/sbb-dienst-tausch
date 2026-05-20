"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type DiensttauschAnfrage = {
  tag: string;
  datum: string;
  dienst: string;
  uhrzeit: string;
  person: string;
  gewDienst: string;
  gewDatum: string;
  gewDatumNr: string;
  status?: "pending" | "approved" | "denied";
};

type Dienstdaten = {
  tag: string;
  datum: string;
  dienst: string;
  uhrzeit: string;
  relevant: boolean;
};

// --- Wiederverwendbare Sub-Komponenten ---

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

function IconFerien() {
  return (
    <div className="bg-[#174693] flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]">
      <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-white text-[14px] text-center w-full">37</p>
    </div>
  );
}

function IconFruehdienst() {
  return (
    <div className="flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: '#F4A428' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" fill="white" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="white" strokeWidth="2" strokeLinecap="round" />
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

function TauschNotiz({ person }: { person: string }) {
  return (
    <div className="flex gap-[12px] items-start overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundColor: "#CFCBC7" }}>
      <Image src="/images/icon-tausch.svg" alt="Tausch" width={16} height={16} className="shrink-0 mt-[2px]" />
      <p className="font-normal leading-[1.4] not-italic relative min-w-0 text-black text-[16px]">
        Abgabe an {person} angefragt.
      </p>
    </div>
  );
}

const DIENST_INFO: Record<string, { zeit: string; dauer: string; pause: string }> = {
  "Frühdienst":    { zeit: "06:00 – 15:00", dauer: "8:00 h", pause: "1:00 h" },
  "BE Mo-Do (15)": { zeit: "07:00 – 16:30", dauer: "8:00 h", pause: "0:20 h" },
  "BE Fr-Sa (5)":  { zeit: "06:30 – 16:30", dauer: "8:00 h", pause: "1:00 h" },
  "Nachtdienst":   { zeit: "22:00 – 06:00", dauer: "8:00 h", pause: "0:30 h" },
};

function IconNachtdienst() {
  return (
    <div className="flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#5B1F8A" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="white" />
      </svg>
    </div>
  );
}

function DienstIcon({ dienst }: { dienst: string }) {
  if (dienst === "BE Mo-Do (15)") {
    return (
      <div className="flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} />
    );
  }
  if (dienst === "BE Fr-Sa (5)") {
    return (
      <div className="flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FCEEA8" }} />
    );
  }
  if (dienst === "Nachtdienst") {
    return <IconNachtdienst />;
  }
  return <IconFruehdienst />;
}

function NeueKachel({ dienst }: { dienst: string }) {
  const info = DIENST_INFO[dienst] ?? { zeit: "", dauer: "8:00 h", pause: "1:00 h" };
  return (
    <div
      className="flex w-full flex-col gap-[8px] items-start p-[16px] relative rounded-[8px]"
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
      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
            <DienstIcon dienst={dienst} />
          </div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">{info.zeit}</p>
          <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">{dienst}</p>
        </div>
      </div>
      <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
        <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">
          Dauer: {info.dauer}&nbsp;&nbsp;&nbsp;&nbsp;Pause: {info.pause}
        </p>
      </div>
      <div className="flex flex-col gap-[2px] overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundColor: "#FDF2BE" }}>
        <p className="font-normal leading-[1.4] text-black text-[16px]">
          Übernahme durch mich.
        </p>
      </div>
    </div>
  );
}

function ApprovedNeueKachel({ dienst }: { dienst: string }) {
  const info = DIENST_INFO[dienst] ?? { zeit: "", dauer: "8:00 h", pause: "1:00 h" };
  return (
    <div
      className="bg-white flex w-full flex-col gap-[8px] items-start p-[16px] relative rounded-[8px]"
      style={{ boxShadow: "2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)", boxSizing: "border-box" }}
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
          <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">{info.zeit}</p>
          <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">{dienst}</p>
        </div>
      </div>
      <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
        <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">
          Dauer: {info.dauer}&nbsp;&nbsp;&nbsp;&nbsp;Pause: {info.pause}
        </p>
      </div>
      <div className="flex gap-[16px] items-start w-full p-[8px] rounded-[4px]" style={{ backgroundColor: "#F3F2F2" }}>
        <Image src="/images/icon-tausch.svg" alt="Tausch" width={16} height={16} className="shrink-0 mt-[2px]" />
        <p className="font-normal leading-[1.4] text-black text-[16px]">Dienst übernommen</p>
      </div>
    </div>
  );
}

function FreiKachelApproved() {
  return (
    <div className="bg-white flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
      <div className="absolute z-20 bg-[#174693] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[16px]">
        <p className="font-normal text-[14px] text-white whitespace-nowrap">Neu</p>
      </div>
      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
          <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
        </div>
      </div>
      <div className="flex gap-[16px] items-start w-full p-[8px] rounded-[4px]" style={{ backgroundColor: "#F3F2F2" }}>
        <Image src="/images/icon-tausch.svg" alt="Tausch" width={16} height={16} className="shrink-0 mt-[2px]" />
        <p className="font-normal leading-[1.4] text-black text-[16px]">Kein Dienst (abgegeben)</p>
      </div>
    </div>
  );
}

function DienstKachel({
  dienst, uhrzeit, isTausch, tauschPerson, onMenuClick,
}: {
  dienst: string; uhrzeit: string;
  isTausch: boolean; tauschPerson?: string;
  onMenuClick: () => void;
}) {
  const textColor = isTausch ? "#55514d" : "#100c08";
  return (
    <div
      className="flex flex-col gap-[8px] items-start w-full p-[16px] relative rounded-[8px]"
      style={{
        backgroundColor: isTausch ? "#BEBAB6" : "white",
        boxShadow: "2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      {isTausch && (
        <div className="absolute z-20 bg-[#696561] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[14px]">
          <p className="font-normal text-[13px] text-white whitespace-nowrap">Entfällt</p>
        </div>
      )}
      <div className="flex gap-[12px] items-center relative shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
            <DienstIcon dienst={dienst} />
          </div>
        </div>
        <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
          <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[16px]" style={{ color: textColor }}>{uhrzeit}</p>
          <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[16px]" style={{ color: textColor }}>{dienst}</p>
        </div>
        <MenuDots onClick={onMenuClick} />
      </div>
      <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
        <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[12px]" style={{ color: textColor }}>
          Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h
        </p>
      </div>
      {isTausch && tauschPerson && <TauschNotiz person={tauschPerson} />}
    </div>
  );
}

// --- Haupt-Komponente ---

function EinsatzplanungInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tauschTag    = searchParams.get("tauschTag")    ?? "";
  const tauschDatum  = searchParams.get("tauschDatum")  ?? "";
  const tauschPerson = searchParams.get("tauschPerson") ?? "";
  const gewDatum     = searchParams.get("gewDatum")     ?? "";
  const gewDienst    = searchParams.get("gewDienst")    ?? "";

  const [anfrage, setAnfrage] = useState<DiensttauschAnfrage | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("diensttausch_anfrage");
    if (raw) {
      try { setAnfrage(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  // URL-Params haben Priorität; Fallback auf localStorage
  const effTauschTag    = tauschTag    || anfrage?.tag    || "";
  const effTauschDatum  = tauschDatum  || anfrage?.datum  || "";
  const effTauschPerson = tauschPerson || anfrage?.person || "";
  const effGewDatum     = gewDatum     || anfrage?.gewDatum  || "";
  const effGewDienst    = gewDienst    || anfrage?.gewDienst || "";

  const requestState: "pending" | "approved" | "denied" | "" =
    anfrage?.status ?? (effTauschTag ? "pending" : "");

  const isTauschKarte = (tag: string, datum: string) =>
    effTauschTag === tag && effTauschDatum === datum;

  // Tagesnummer aus "Mittwoch, 08. April 2026" extrahieren → "08"
  const neuesKachelDatum = effGewDatum
    ? (effGewDatum.split(", ")[1]?.split(".")[0]?.trim() ?? "")
    : "";

  const gleichesDatum = effTauschDatum === neuesKachelDatum;

  // Hilfe: rendert NeueKachel oder ApprovedNeueKachel je nach Status
  const renderNeueKachel = (datum: string) => {
    if (neuesKachelDatum !== datum || !effGewDienst) return null;
    return requestState === "approved"
      ? <ApprovedNeueKachel dienst={effGewDienst} />
      : <NeueKachel dienst={effGewDienst} />;
  };

  const [aktiveKarte, setAktiveKarte] = useState<Dienstdaten | null>(null);
  const [sheetOffen, setSheetOffen] = useState(false);
  const handleMenuClick = (daten: Dienstdaten) => {
    setAktiveKarte(daten);
    requestAnimationFrame(() => setSheetOffen(true));
  };

  const handleSchliessen = () => {
    setSheetOffen(false);
    setTimeout(() => setAktiveKarte(null), 300);
  };

  const handleDienstTauschen = () => {
    if (aktiveKarte?.relevant) {
      const params = new URLSearchParams({
        tag: aktiveKarte.tag,
        datum: aktiveKarte.datum,
        dienst: aktiveKarte.dienst,
        uhrzeit: aktiveKarte.uhrzeit,
      });
      setAktiveKarte(null);
      setSheetOffen(false);
      router.push(`/demo-dienst-tausch?${params.toString()}`);
    } else {
      handleSchliessen();
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
                onClick={() => router.push("/demo-dashboard-mia")}
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
                <p className="text-[14px] font-normal text-[#100c08] whitespace-nowrap">Luca Meier</p>
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

        {/* ── KW 15 ── */}
        <KwHeader zeitraum="06. – 12. April 2026 (KW 15)" stunden="24.00 h" />

        {/* MO 06 – Frei */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="MO" datum="06" />
          {neuesKachelDatum === "06" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
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
          )}
        </div>

        {/* DI 07 – Ferien */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="DI" datum="07" />
          {neuesKachelDatum === "07" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                  <IconFerien />
                </div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Ferien</p>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* MI 08 – BE Mo-Do (15) (relevant für Dienst tauschen) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="MI" datum="08" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {/* Gray/Frei card */}
            {isTauschKarte("MI","08") && requestState === "approved" && !gleichesDatum && <FreiKachelApproved />}
            {isTauschKarte("MI","08") && requestState !== "approved" && !(neuesKachelDatum === "08" && effGewDienst && !isTauschKarte("MI","08")) && (
              <DienstKachel dienst="BE Mo-Do (15)" uhrzeit="07:00 – 16:30" isTausch={true} tauschPerson={effTauschPerson}
                onMenuClick={() => handleMenuClick({ tag: "MI", datum: "08", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: true })} />
            )}
            {!isTauschKarte("MI","08") && !(neuesKachelDatum === "08" && effGewDienst) && (
              <DienstKachel dienst="BE Mo-Do (15)" uhrzeit="07:00 – 16:30" isTausch={false} tauschPerson={effTauschPerson}
                onMenuClick={() => handleMenuClick({ tag: "MI", datum: "08", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: true })} />
            )}
            {/* New card */}
            {neuesKachelDatum === "08" && effGewDienst && (
              requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />
            )}
          </div>
        </div>

        {/* DO 09 – BE Mo-Do (15) (relevant für Dienst tauschen) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="DO" datum="09" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {isTauschKarte("DO","09") && requestState === "approved" && !gleichesDatum && <FreiKachelApproved />}
            {isTauschKarte("DO","09") && requestState !== "approved" && !(neuesKachelDatum === "09" && effGewDienst && !isTauschKarte("DO","09")) && (
              <DienstKachel dienst="BE Mo-Do (15)" uhrzeit="07:00 – 16:30" isTausch={true} tauschPerson={effTauschPerson}
                onMenuClick={() => handleMenuClick({ tag: "DO", datum: "09", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: true })} />
            )}
            {!isTauschKarte("DO","09") && !(neuesKachelDatum === "09" && effGewDienst) && (
              <DienstKachel dienst="BE Mo-Do (15)" uhrzeit="07:00 – 16:30" isTausch={false} tauschPerson={effTauschPerson}
                onMenuClick={() => handleMenuClick({ tag: "DO", datum: "09", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: true })} />
            )}
            {neuesKachelDatum === "09" && effGewDienst && (
              requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />
            )}
          </div>
        </div>

        {/* FR 10 – BE Fr-Sa (5) (relevant für Dienst tauschen) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="FR" datum="10" />
          <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
            {isTauschKarte("FR","10") && requestState === "approved" && !gleichesDatum && <FreiKachelApproved />}
            {isTauschKarte("FR","10") && requestState !== "approved" && !(neuesKachelDatum === "10" && effGewDienst && !isTauschKarte("FR","10")) && (
              <DienstKachel dienst="BE Fr-Sa (5)" uhrzeit="06:30 – 16:30" isTausch={true} tauschPerson={effTauschPerson}
                onMenuClick={() => handleMenuClick({ tag: "FR", datum: "10", dienst: "BE Fr-Sa (5)", uhrzeit: "06:30 – 16:30", relevant: true })} />
            )}
            {!isTauschKarte("FR","10") && !(neuesKachelDatum === "10" && effGewDienst) && (
              <DienstKachel dienst="BE Fr-Sa (5)" uhrzeit="06:30 – 16:30" isTausch={false} tauschPerson={effTauschPerson}
                onMenuClick={() => handleMenuClick({ tag: "FR", datum: "10", dienst: "BE Fr-Sa (5)", uhrzeit: "06:30 – 16:30", relevant: true })} />
            )}
            {neuesKachelDatum === "10" && effGewDienst && (
              requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />
            )}
          </div>
        </div>

        {/* SA 11 – Frei */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="SA" datum="11" />
          {neuesKachelDatum === "11" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* SO 12 – Frei */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="SO" datum="12" />
          {neuesKachelDatum === "12" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* ── KW 16 ── */}
        <KwHeader zeitraum="13. – 19. April 2026 (KW 16)" stunden="40.00 h" />

        {/* MO 13 – BE Mo-Do (15) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="MO" datum="13" />
          {neuesKachelDatum === "13" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
              </div>
              <MenuDots onClick={() => handleMenuClick({ tag: "MO", datum: "13", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: false })} />
            </div>
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
            </div>
          </div>
          )}
        </div>

        {/* DI 14 – BE Mo-Do (15) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="DI" datum="14" />
          {neuesKachelDatum === "14" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
              </div>
              <MenuDots onClick={() => handleMenuClick({ tag: "DI", datum: "14", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: false })} />
            </div>
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
            </div>
          </div>
          )}
        </div>

        {/* MI 15 – BE Mo-Do (15) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="MI" datum="15" />
          {neuesKachelDatum === "15" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
              </div>
              <MenuDots onClick={() => handleMenuClick({ tag: "MI", datum: "15", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: false })} />
            </div>
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 0:20 h</p>
            </div>
          </div>
          )}
        </div>

        {/* DO 16 – BE Mo-Do (15) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="DO" datum="16" />
          {neuesKachelDatum === "16" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FFD09D" }} /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">07:00 – 16:30</p>
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Mo-Do (15)</p>
              </div>
              <MenuDots onClick={() => handleMenuClick({ tag: "DO", datum: "16", dienst: "BE Mo-Do (15)", uhrzeit: "07:00 – 16:30", relevant: false })} />
            </div>
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h</p>
            </div>
          </div>
          )}
        </div>

        {/* FR 17 – BE Mo-Do (15) */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="FR" datum="17" />
          {neuesKachelDatum === "17" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><div className="rounded-[32px] shrink-0 size-[40px]" style={{ backgroundColor: "#FCEEA8" }} /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">06:30 – 16:30</p>
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">BE Fr-Sa (5)</p>
              </div>
              <MenuDots onClick={() => handleMenuClick({ tag: "FR", datum: "17", dienst: "BE Fr-Sa (5)", uhrzeit: "06:30 – 16:30", relevant: false })} />
            </div>
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 0:20 h</p>
            </div>
          </div>
          )}
        </div>

        {/* SA 18 – Frei */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="SA" datum="18" />
          {neuesKachelDatum === "18" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* SO 19 – Frei */}
        <div className="flex items-start relative shrink-0 w-full">
          <TagDatum tag="SO" datum="19" />
          {neuesKachelDatum === "19" && effGewDienst ? (requestState === "approved" ? <ApprovedNeueKachel dienst={effGewDienst} /> : <NeueKachel dienst={effGewDienst} />) : (
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0"><IconFrei /></div>
              </div>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">Kein Einsatz</p>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">ganzer Tag</p>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Link: Nächste 2 Wochen */}
        <div className="pt-[24px] pb-[24px] w-full text-center">
          <button className="text-[14px] font-normal text-[#174693] cursor-pointer">
            Nächste 2 Wochen anzeigen
          </button>
        </div>

      </div>

      {/* ── Action Sheet – Kartenmenü ── */}
      {aktiveKarte && (
        <>
          {/* Transparentes Overlay */}
          <div
            className={`fixed inset-0 z-[600] bg-black/40 transition-opacity duration-300 ${sheetOffen ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={handleSchliessen}
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <div className={`fixed inset-x-0 bottom-0 z-[700] mx-auto max-w-[390px] bg-white rounded-t-[20px] px-[24px] pb-[40px] pt-[16px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${sheetOffen ? "translate-y-0" : "translate-y-full"}`}>
            {/* Handle */}
            <div className="mx-auto mb-[16px] h-[4px] w-[40px] rounded-full bg-[#cfcbc7]" />

            <p className="text-[18px] font-bold text-[#100c08] mb-[8px]">Aktionen</p>

            {/* Tageskalender anzeigen */}
            <button
              className="flex items-center gap-[16px] w-full py-[16px] border-b border-[#e7e6e5] text-left"
              onClick={handleSchliessen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
                <rect x="4" y="5" width="16" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M4 11h16" />
                <path d="M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01" strokeWidth="2.5" />
              </svg>
              <span className="text-[16px] text-[#100c08]">Tageskalender anzeigen</span>
            </button>

            {/* Dienst tauschen / Diensttausch zurückziehen */}
            {aktiveKarte && isTauschKarte(aktiveKarte.tag, aktiveKarte.datum) ? (
              <button
                className="flex items-center gap-[16px] w-full py-[16px] text-left"
                onClick={handleSchliessen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                <span className="text-[16px] text-[#100c08]">Diensttausch zurückziehen</span>
              </button>
            ) : (
              <button
                className="flex items-center gap-[16px] w-full py-[16px] text-left"
                onClick={handleDienstTauschen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                  <path d="M7 16H3m0 0l3-3m-3 3l3 3" />
                  <path d="M17 8h4m0 0l-3-3m3 3l-3 3" />
                  <path d="M3 8h13a1 1 0 0 1 1 1v4" />
                  <path d="M21 16H8a1 1 0 0 1-1-1v-4" />
                </svg>
                <span className="text-[16px] text-[#100c08]">Einsatz tauschen</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function EinsatzplanungPage() {
  return (
    <Suspense>
      <EinsatzplanungInner />
    </Suspense>
  );
}
