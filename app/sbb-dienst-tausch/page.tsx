"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// --- Kalender-Hilfen ---
const MONATE_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
const WT_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WT_LANG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const TAG_LANG: Record<string, string> = {
  MO: "Montag", DI: "Dienstag", MI: "Mittwoch", DO: "Donnerstag",
  FR: "Freitag", SA: "Samstag", SO: "Sonntag",
};

function ersterWT(jahr: number, monat: number) {
  return (new Date(jahr, monat, 1).getDay() + 6) % 7;
}
function anzahlTage(jahr: number, monat: number) {
  return new Date(jahr, monat + 1, 0).getDate();
}
function datumLabel(tag: number, monat: number, jahr: number) {
  const wt = WT_LANG[new Date(jahr, monat, tag).getDay()];
  return `${wt}, ${String(tag).padStart(2, "0")}. ${MONATE_DE[monat]} ${jahr}`;
}

// --- Icons ---
function IconFruehdienst() {
  return (
    <div
      className="flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]"
      style={{ backgroundColor: "#F4A428" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" fill="white" />
        <path
          d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
          stroke="white" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

type SheetTyp = "kalender" | "dienst" | "person" | null;

// --- Hauptkomponente (braucht useSearchParams) ---
function DienstTauschInner() {
  const router = useRouter();
  const p = useSearchParams();

  const urlTag = p.get("tag") ?? "";
  const urlDatum = p.get("datum") ?? "";
  const dienst = p.get("dienst") ?? "Frühdienst";
  const uhrzeit = p.get("uhrzeit") ?? "06:00 – 15:00";

  const datumKopfzeile = urlTag
    ? `${TAG_LANG[urlTag] ?? urlTag}, ${urlDatum}. April 2026`
    : "";

  // Sheet-Steuerung
  const [aktivesSheet, setAktivesSheet] = useState<SheetTyp>(null);
  const [sheetSichtbar, setSheetSichtbar] = useState(false);
  const [suche, setSuche] = useState("");

  const oeffne = (typ: SheetTyp) => {
    setAktivesSheet(typ);
    setSuche("");
    requestAnimationFrame(() => setSheetSichtbar(true));
  };
  const schliesse = () => {
    setSheetSichtbar(false);
    setTimeout(() => setAktivesSheet(null), 300);
  };

  // Formular-Zustand
  const [gewDatum, setGewDatum] = useState<string | null>(null);
  const [gewDienst, setGewDienst] = useState<string | null>(null);
  const [gewPerson, setGewPerson] = useState<string | null>(null);

  // Kalender-Zustand
  const [kalJahr, setKalJahr] = useState(2026);
  const [kalMonat, setKalMonat] = useState(3); // April
  const [selTag, setSelTag] = useState<number | null>(null);
  const [selMonat, setSelMonat] = useState<number | null>(null);
  const [selJahr, setSelJahr] = useState<number | null>(null);

  const alleOk = gewDatum && gewDienst && gewPerson;

  const DIENSTE = [
    { label: "Frühdienst",  zeit: "06:00 – 15:00" },
    { label: "Spätdienst",  zeit: "13:00 – 22:00" },
    { label: "Nachtdienst", zeit: "22:00 – 06:00" },
  ];
  const PERSONEN = ["Jonas Baumgartner", "Sofia Novak", "Maximilian Schmidt"];
  const persGefiltert = PERSONEN.filter((n) =>
    n.toLowerCase().includes(suche.toLowerCase())
  );

  // Kalender aufbauen
  const erstWT = ersterWT(kalJahr, kalMonat);
  const anzTage = anzahlTage(kalJahr, kalMonat);
  const zellen: (number | null)[] = [
    ...Array(erstWT).fill(null),
    ...Array.from({ length: anzTage }, (_, i) => i + 1),
  ];

  const vorMonat = () => {
    if (kalMonat === 0) { setKalMonat(11); setKalJahr((j) => j - 1); }
    else setKalMonat((m) => m - 1);
  };
  const naechsterMonat = () => {
    if (kalMonat === 11) { setKalMonat(0); setKalJahr((j) => j + 1); }
    else setKalMonat((m) => m + 1);
  };

  return (
    <div className="bg-[#f3f2f2] flex flex-col min-h-screen w-full pb-[96px]">

      {/* Header */}
      <div className="bg-white sticky top-0 z-[550] flex items-center h-[48px] px-[24px] shadow-[0_1px_0_0_#e7e6e5]">
        <button
          onClick={() => router.back()}
          aria-label="Zurück"
          className="cursor-pointer mr-auto"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 font-bold text-[17px] text-[#100c08]">
          Dienst tauschen
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[16px] px-6 py-[16px]">

        {/* Datum-Kopfzeile */}
        {datumKopfzeile && (
          <p className="font-bold text-[#100c08] text-[16px] pt-[4px]">{datumKopfzeile}</p>
        )}

        {/* Dienst-Card */}
        <div className="bg-white rounded-[8px] p-[16px] flex flex-col gap-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
          <div className="flex gap-[12px] items-center">
            <div className="flex items-start pt-[3px]">
              <IconFruehdienst />
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-[#100c08] text-[16px]">{dienst}</p>
              <p className="font-normal text-[#100c08] text-[16px]">{uhrzeit}</p>
            </div>
          </div>
          <p className="font-normal text-black text-[12px] pl-[8px]">
            Dauer: 8:00 h&nbsp;&nbsp;&nbsp;&nbsp;Pause: 1:00 h
          </p>
        </div>

        {/* Feld 1 – Tag wählen */}
        <div className="flex flex-col gap-[6px]">
          <p className="text-[14px] font-normal text-[#100c08]">
            Ich möchte dafür an folgendem Tag arbeiten *
          </p>
          <button
            onClick={() => oeffne("kalender")}
            className="flex items-center justify-between bg-white border border-[#cfcbc7] rounded-[8px] px-[14px] h-[48px] w-full cursor-pointer"
          >
            <span className={`text-[16px] ${gewDatum ? "text-[#100c08]" : "text-[#c5c3c0]"}`}>
              {gewDatum ?? ""}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55514d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2.5" />
            </svg>
          </button>
        </div>

        {/* Feld 2 – Dienst wählen */}
        <div className="flex flex-col gap-[6px]">
          <p className="text-[14px] font-normal text-[#100c08]">
            Ich möchte folgenden Dienst übernehmen *
          </p>
          <button
            onClick={() => oeffne("dienst")}
            className="flex items-center justify-between bg-white border border-[#cfcbc7] rounded-[8px] px-[14px] h-[48px] w-full cursor-pointer"
          >
            <span className={`text-[16px] ${gewDienst ? "text-[#100c08]" : "text-[#c5c3c0]"}`}>
              {gewDienst ?? ""}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55514d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Trennlinie mit Raute */}
        <div className="relative flex items-center" aria-hidden="true">
          <div className="flex-1 h-px bg-[#cfcbc7]" />
          <div className="mx-1 size-2.5 rotate-45 border-r border-b bg-[#f3f2f2] border-[#cfcbc7]" />
          <div className="flex-1 h-px bg-[#cfcbc7]" />
        </div>

        {/* Feld 3 – Person wählen */}
        <div className="flex flex-col gap-[6px]">
          <p className={`text-[14px] font-normal ${gewDatum && gewDienst ? "text-[#100c08]" : "text-[#aaa9a6]"}`}>
            Auf Basis Ihrer Angaben, werden Personen aufgeführt, für die eine Dienstübernahme in Frage kommen. *
          </p>
          <button
            onClick={() => { if (gewDatum && gewDienst) oeffne("person"); }}
            disabled={!gewDatum || !gewDienst}
            className={`flex items-center justify-between bg-white border rounded-[8px] px-[14px] h-[48px] w-full transition-opacity ${gewDatum && gewDienst ? "border-[#cfcbc7] cursor-pointer opacity-100" : "border-[#e7e6e5] cursor-not-allowed opacity-50"}`}
          >
            <span className={`text-[16px] ${gewPerson ? "text-[#100c08]" : "text-[#c5c3c0]"}`}>
              {gewPerson ?? ""}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55514d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

      </div>

      {/* Fixierter Button */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[390px] px-6 pb-[32px] pt-[12px] bg-[#f3f2f2]">
        <button
          disabled={!alleOk}
          onClick={() => {
            if (!alleOk) return;
            const params = new URLSearchParams({
              tag: urlTag,
              datum: urlDatum,
              dienst,
              uhrzeit,
              gewDatum: gewDatum!,
              gewDienst: gewDienst!,
              gewPerson: gewPerson!,
            });
            router.push(`/sbb-dienst-tausch-bestaetigung?${params.toString()}`);
          }}
          className={`w-full h-[40px] rounded-[12px] font-bold text-[16px] text-white transition-colors ${alleOk ? "bg-[#100c08] cursor-pointer" : "bg-[#c5c3c0] cursor-not-allowed"}`}
        >
          Diensttausch anfragen
        </button>
      </div>

      {/* === Bottom Sheets === */}
      {aktivesSheet && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-[600] bg-black/40 transition-opacity duration-300 ${sheetSichtbar ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={schliesse}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            className={`fixed inset-x-0 bottom-0 z-[700] mx-auto max-w-[390px] bg-white rounded-t-[20px] transition-transform duration-300 ease-out ${sheetSichtbar ? "translate-y-0" : "translate-y-full"}`}
          >
            {/* Handle */}
            <div className="flex justify-center pt-[12px] pb-[4px]">
              <div className="h-[4px] w-[40px] rounded-full bg-[#cfcbc7]" />
            </div>

            {/* ── Kalender ── */}
            {aktivesSheet === "kalender" && (
              <div className="px-[20px] pb-[32px]">
                <div className="flex items-center justify-between py-[10px]">
                  <button onClick={vorMonat} className="p-[8px] cursor-pointer" aria-label="Vorheriger Monat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <p className="font-bold text-[#100c08] text-[16px]">
                    {MONATE_DE[kalMonat]} {kalJahr}
                  </p>
                  <button onClick={naechsterMonat} className="p-[8px] cursor-pointer" aria-label="Nächster Monat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>

                {/* Wochentag-Header */}
                <div className="grid grid-cols-7 mb-[4px]">
                  {WT_KURZ.map((wt) => (
                    <div key={wt} className="text-center text-[12px] font-bold text-[#55514d] py-[4px]">
                      {wt}
                    </div>
                  ))}
                </div>

                {/* Tage */}
                <div className="grid grid-cols-7 gap-y-[2px]">
                  {zellen.map((tag, i) => (
                    <div key={i} className="flex items-center justify-center h-[40px]">
                      {tag ? (
                        <button
                          onClick={() => {
                            setSelTag(tag);
                            setSelMonat(kalMonat);
                            setSelJahr(kalJahr);
                            setGewDatum(datumLabel(tag, kalMonat, kalJahr));
                            schliesse();
                          }}
                          className={`w-[36px] h-[36px] rounded-full text-[14px] cursor-pointer transition-colors
                            ${selTag === tag && selMonat === kalMonat && selJahr === kalJahr
                              ? "bg-[#174693] text-white font-bold"
                              : "text-[#100c08] hover:bg-[#e7e6e5]"
                            }`}
                        >
                          {tag}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Dienst-Auswahl ── */}
            {aktivesSheet === "dienst" && (
              <div className="pb-[32px]">
                <p className="px-[24px] pt-[8px] pb-[12px] font-bold text-[#100c08] text-[18px]">Dienst wählen</p>
                <div className="h-px bg-[#e7e6e5]" />
                {DIENSTE.map((d) => (
                  <button
                    key={d.label}
                    onClick={() => { setGewDienst(d.label); schliesse(); }}
                    className={`flex items-center w-full px-[24px] py-[16px] border-b border-[#e7e6e5] cursor-pointer hover:bg-[#f6f5f5] active:bg-[#efeeee] ${gewDienst === d.label ? "text-[#174693]" : "text-[#100c08]"}`}
                  >
                    <span className={`text-[16px] ${gewDienst === d.label ? "font-bold" : "font-normal"}`}>{d.label}</span>
                    <span className="ml-1 text-[16px] font-normal text-[#55514d]">({d.zeit})</span>
                    {gewDienst === d.label && (
                      <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#174693" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* ── Personen-Auswahl ── */}
            {aktivesSheet === "person" && (
              <div className="pb-[32px]">
                <p className="px-[24px] pt-[8px] pb-[12px] font-bold text-[#100c08] text-[18px]">Person wählen</p>

                {/* Suche */}
                <div className="px-[16px] pb-[12px]">
                  <div className="flex items-center gap-[8px] bg-[#f3f2f2] rounded-[8px] px-[12px] h-[40px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55514d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Suchen …"
                      value={suche}
                      onChange={(e) => setSuche(e.target.value)}
                      className="flex-1 bg-transparent text-[14px] text-[#100c08] outline-none placeholder:text-[#aaa9a6]"
                    />
                    {suche && (
                      <button onClick={() => setSuche("")} className="cursor-pointer" aria-label="Suche löschen">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#55514d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-px bg-[#e7e6e5]" />

                {persGefiltert.map((pers) => (
                  <button
                    key={pers}
                    onClick={() => { setGewPerson(pers); schliesse(); }}
                    className={`flex items-center w-full px-[24px] py-[16px] text-[16px] border-b border-[#e7e6e5] cursor-pointer hover:bg-[#f6f5f5] active:bg-[#efeeee] ${gewPerson === pers ? "font-bold text-[#174693]" : "text-[#100c08]"}`}
                  >
                    {pers}
                    {gewPerson === pers && (
                      <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#174693" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}

                {persGefiltert.length === 0 && (
                  <p className="px-[24px] py-[16px] text-[14px] text-[#aaa9a6]">
                    Keine Personen gefunden
                  </p>
                )}
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}

export default function DienstTauschPage() {
  return (
    <Suspense>
      <DienstTauschInner />
    </Suspense>
  );
}
