"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

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
function IconSpaetschicht() {
  return <Image src="/images/icon-spaetschicht.svg" alt="Spätschicht" width={40} height={40} className="size-[40px] shrink-0" />;
}

// Kandidat:innen für die Einsatzübernahme (Demo-Daten). Die Schicht ist die,
// die die Person am gewählten Tag hat und die Luca übernehmen würde.
const PERSONEN = [
  { vorname: "Jonas", nachname: "Baumgartner", schicht: "Frühschicht" },
  { vorname: "Sofia", nachname: "Novak", schicht: "Spätschicht" },
  { vorname: "Maximilian", nachname: "Schmidt", schicht: "Frühschicht" },
  { vorname: "Elena", nachname: "Rossi", schicht: "Nachtschicht" },
  { vorname: "Thomas", nachname: "Keller", schicht: "Spätschicht" },
  { vorname: "Laura", nachname: "Weber", schicht: "Frühschicht" },
  { vorname: "David", nachname: "Fischer", schicht: "Spätschicht" },
];

// --- Hauptkomponente (braucht useSearchParams) ---
function DienstTauschInner() {
  const router = useRouter();
  const p = useSearchParams();

  const urlTag = p.get("tag") ?? "";
  const urlDatum = p.get("datum") ?? "";
  const dienst = p.get("dienst") ?? "Spätschicht";
  const uhrzeit = p.get("uhrzeit") ?? "14:00 – 22:00";

  const datumKopfzeile = urlTag
    ? `${TAG_LANG[urlTag] ?? urlTag}, ${urlDatum}. April 2026`
    : "";

  // Kalender-Sheet
  const [sheetOffen, setSheetOffen] = useState(false);
  const [sheetSichtbar, setSheetSichtbar] = useState(false);
  const oeffneKalender = () => {
    setSheetOffen(true);
    requestAnimationFrame(() => setSheetSichtbar(true));
  };
  const schliesse = () => {
    setSheetSichtbar(false);
    setTimeout(() => setSheetOffen(false), 300);
  };

  // Standard-Datum = Tag der abzugebenden Schicht
  const defaultDatum = urlDatum ? datumLabel(parseInt(urlDatum, 10), 3, 2026) : null;
  const [gewDatum, setGewDatum] = useState<string | null>(defaultDatum);
  const [gewPersonIdx, setGewPersonIdx] = useState<number | null>(null);
  const [grund, setGrund] = useState("");

  // Kalender-Zustand (vorbelegt auf abzugebenden Tag)
  const [kalJahr, setKalJahr] = useState(2026);
  const [kalMonat, setKalMonat] = useState(3); // April
  const [selTag, setSelTag] = useState<number | null>(urlDatum ? parseInt(urlDatum, 10) : null);
  const [selMonat, setSelMonat] = useState<number | null>(urlDatum ? 3 : null);
  const [selJahr, setSelJahr] = useState<number | null>(urlDatum ? 2026 : null);

  const gewPerson = gewPersonIdx !== null ? `${PERSONEN[gewPersonIdx].vorname} ${PERSONEN[gewPersonIdx].nachname}` : null;
  const gewDienst = gewPersonIdx !== null ? PERSONEN[gewPersonIdx].schicht : null;
  const alleOk = !!(gewDatum && gewPersonIdx !== null && grund.trim().length > 0);

  // Auswählbarer Bereich: 18. März – 19. April 2026
  const MIN_DATUM = new Date(2026, 2, 18);
  const MAX_DATUM = new Date(2026, 3, 19);

  // Kalender aufbauen
  const erstWT = ersterWT(kalJahr, kalMonat);
  const anzTage = anzahlTage(kalJahr, kalMonat);
  const zellen: (number | null)[] = [
    ...Array(erstWT).fill(null),
    ...Array.from({ length: anzTage }, (_, i) => i + 1),
  ];

  const vorMonat = () => {
    if (kalMonat === 2 && kalJahr === 2026) return;
    if (kalMonat === 0) { setKalMonat(11); setKalJahr((j) => j - 1); }
    else setKalMonat((m) => m - 1);
  };
  const naechsterMonat = () => {
    if (kalMonat === 3 && kalJahr === 2026) return;
    if (kalMonat === 11) { setKalMonat(0); setKalJahr((j) => j + 1); }
    else setKalMonat((m) => m + 1);
  };
  const kannVorMonat = !(kalMonat === 2 && kalJahr === 2026);
  const kannNaechsterMonat = !(kalMonat === 3 && kalJahr === 2026);

  return (
    <div className="bg-[#f3f2f2] flex flex-col min-h-screen w-full pb-[96px]">

      {/* Header */}
      <div className="bg-white sticky top-0 z-[550] flex items-center h-[48px] px-[24px] shadow-[0_1px_0_0_#e7e6e5]">
        <button onClick={() => router.back()} aria-label="Zurück" className="cursor-pointer mr-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 font-bold text-[17px] text-[#100c08]">Dienst tauschen</p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[16px] px-6 py-[16px]">

        {/* Datum-Kopfzeile */}
        {datumKopfzeile && (
          <p className="font-bold text-[#100c08] text-[16px] pt-[4px]">{datumKopfzeile}</p>
        )}

        {/* Dienst-Card (abzugebende Schicht) */}
        <div className="bg-white rounded-[8px] p-[16px] flex flex-col gap-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
          <div className="flex gap-[12px] items-center">
            <div className="flex items-start pt-[3px]">
              <IconSpaetschicht />
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

        {/* Feld 1 – Tag wählen (vorbelegt) */}
        <div className="flex flex-col gap-[6px]">
          <p className="text-[14px] font-normal text-[#100c08]">
            Ich möchte dafür an folgendem Tag arbeiten *
          </p>
          <button
            onClick={oeffneKalender}
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

        {/* Feld 2 – Personen-Liste (Radio-Auswahl, scrollbar) */}
        <div className="flex flex-col gap-[6px]">
          <p className="text-[14px] font-normal text-[#100c08]">
            Folgende Personen kommen für eine Dienstübernahme in Frage ({PERSONEN.length}):
          </p>
          <div
            className="bg-white border border-[#cfcbc7] rounded-[8px] overflow-y-auto"
            style={{ maxHeight: "232px" }}
          >
            {PERSONEN.map((person, i) => {
              const selected = gewPersonIdx === i;
              return (
                <button
                  key={`${person.vorname}-${person.nachname}`}
                  onClick={() => setGewPersonIdx(i)}
                  className={`flex items-center gap-[12px] w-full px-[14px] py-[13px] text-left border-b border-[#e7e6e5] last:border-b-0 cursor-pointer ${selected ? "bg-[#f0f4fb]" : "hover:bg-[#f6f5f5]"}`}
                >
                  <span className="flex-1 min-w-0 text-[16px] text-[#100c08]">
                    <span className="font-bold">{person.vorname} {person.nachname}</span>
                    <span className="text-[#55514d]"> ({person.schicht})</span>
                  </span>
                  <span className={`flex items-center justify-center size-[22px] shrink-0 rounded-full border-2 ${selected ? "border-[#174693]" : "border-[#cfcbc7]"}`}>
                    {selected && <span className="size-[12px] rounded-full bg-[#174693]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feld 3 – Grund (zuletzt) */}
        <div className="flex flex-col gap-[6px]">
          <p className="text-[14px] font-normal text-[#100c08]">
            Grund für den Tausch *
          </p>
          <input
            type="text"
            value={grund}
            onChange={(e) => setGrund(e.target.value)}
            className="bg-white border border-[#cfcbc7] rounded-[8px] px-[14px] h-[48px] w-full text-[16px] text-[#100c08] outline-none placeholder:text-[#c5c3c0] focus:border-[#100c08]"
          />
        </div>

      </div>

      {/* Fixierter Button */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[390px] px-6 pb-[32px] pt-[12px] bg-[#f3f2f2]">
        <button
          disabled={!alleOk}
          onClick={() => {
            if (!alleOk) return;
            const gesendetAm = new Date().toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
            const params = new URLSearchParams({
              tag: urlTag,
              datum: urlDatum,
              dienst,
              uhrzeit,
              gewDatum: gewDatum!,
              gewDienst: gewDienst!,
              gewPerson: gewPerson!,
              grund,
              gesendetAm,
            });
            router.push(`/demo-dienst-tausch-bestaetigung?${params.toString()}`);
          }}
          className={`w-full h-[40px] rounded-[12px] font-bold text-[16px] text-white transition-colors ${alleOk ? "bg-[#100c08] cursor-pointer" : "bg-[#c5c3c0] cursor-not-allowed"}`}
        >
          Diensttausch anfragen
        </button>
      </div>

      {/* === Kalender-Sheet === */}
      {sheetOffen && (
        <>
          <div
            className={`fixed inset-0 z-[600] bg-black/40 transition-opacity duration-300 ${sheetSichtbar ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={schliesse}
            aria-hidden="true"
          />
          <div className={`fixed inset-x-0 bottom-0 z-[700] mx-auto max-w-[390px] bg-white rounded-t-[20px] transition-transform duration-300 ease-out ${sheetSichtbar ? "translate-y-0" : "translate-y-full"}`}>
            <div className="flex justify-center pt-[12px] pb-[4px]">
              <div className="h-[4px] w-[40px] rounded-full bg-[#cfcbc7]" />
            </div>
            <div className="px-[20px] pb-[32px]">
              <div className="flex items-center justify-between py-[10px]">
                <button onClick={vorMonat} disabled={!kannVorMonat} className={`p-[8px] ${kannVorMonat ? "cursor-pointer" : "cursor-not-allowed opacity-30"}`} aria-label="Vorheriger Monat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <p className="font-bold text-[#100c08] text-[16px]">{MONATE_DE[kalMonat]} {kalJahr}</p>
                <button onClick={naechsterMonat} disabled={!kannNaechsterMonat} className={`p-[8px] ${kannNaechsterMonat ? "cursor-pointer" : "cursor-not-allowed opacity-30"}`} aria-label="Nächster Monat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#100c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 mb-[4px]">
                {WT_KURZ.map((wt) => (
                  <div key={wt} className="text-center text-[12px] font-bold text-[#55514d] py-[4px]">{wt}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-[2px]">
                {zellen.map((tag, i) => {
                  const tagDatum = tag ? new Date(kalJahr, kalMonat, tag) : null;
                  const gesperrt = tagDatum ? tagDatum > MAX_DATUM || tagDatum < MIN_DATUM : false;
                  const gewaehlt = selTag === tag && selMonat === kalMonat && selJahr === kalJahr;
                  return (
                    <div key={i} className="flex items-center justify-center h-[40px]">
                      {tag ? (
                        gesperrt ? (
                          <span className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-[14px] text-[#c5c3c0] cursor-not-allowed select-none">{tag}</span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelTag(tag);
                              setSelMonat(kalMonat);
                              setSelJahr(kalJahr);
                              setGewDatum(datumLabel(tag, kalMonat, kalJahr));
                              schliesse();
                            }}
                            className={`w-[36px] h-[36px] rounded-full text-[14px] cursor-pointer transition-colors ${gewaehlt ? "bg-[#174693] text-white font-bold" : "text-[#100c08] hover:bg-[#e7e6e5]"}`}
                          >
                            {tag}
                          </button>
                        )
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
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
