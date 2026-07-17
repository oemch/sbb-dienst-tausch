"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const DIENST_ZEITEN: Record<string, string> = {
  "Frühschicht":  "06:00 – 14:00",
  "Spätschicht":  "14:00 – 22:00",
  "Nachtschicht": "22:00 – 06:00",
  "Frühdienst":  "06:00 – 15:00",
  "BE Mo-Do (15)":  "13:00 – 22:00",
  "Nachtdienst": "22:00 – 06:00",
};

const TAG_LANG: Record<string, string> = {
  MO: "Montag", DI: "Dienstag", MI: "Mittwoch", DO: "Donnerstag",
  FR: "Freitag", SA: "Samstag", SO: "Sonntag",
};

function IconSpaetschicht() {
  return <Image src="/images/icon-spaetschicht.svg" alt="Spätschicht" width={40} height={40} className="size-[40px] shrink-0" />;
}

function BestaetigungInner() {
  const router = useRouter();
  const p = useSearchParams();

  const urlTag   = p.get("tag")      ?? "";
  const urlDatum = p.get("datum")    ?? "";
  const dienst   = p.get("dienst")   ?? "Spätschicht";
  const uhrzeit  = p.get("uhrzeit")  ?? "14:00 – 22:00";
  const gewDatum  = p.get("gewDatum")  ?? "";
  const gewDienst = p.get("gewDienst") ?? "";
  const gewPerson = p.get("gewPerson") ?? "";
  const grund      = p.get("grund")      ?? "";
  const gesendetAm = p.get("gesendetAm") ?? "";

  const [zurueckziehenOffen, setZurueckziehenOffen] = useState(false);

  const abgabeDatum = urlTag
    ? `${TAG_LANG[urlTag] ?? urlTag}, ${urlDatum}. April 2026`
    : "";

  // Anfrage in localStorage speichern, damit Jonas sie in seinem Flow sieht
  useEffect(() => {
    if (urlTag && urlDatum && gewPerson) {
      const anfrage = { tag: urlTag, datum: urlDatum, dienst, uhrzeit, gewDatum, gewDienst, gewPerson, gesendetAm, grund };
      localStorage.setItem("diensttausch_anfrage", JSON.stringify(anfrage));
    }
  }, [urlTag, urlDatum, dienst, uhrzeit, gewDatum, gewDienst, gewPerson, gesendetAm, grund]);

  return (
    <div className="bg-[#f3f2f2] flex flex-col min-h-screen w-full">

      {/* Header – kein Zurück-Pfeil */}
      <div className="bg-white sticky top-0 z-[550] flex items-center justify-center h-[48px] px-[24px] shadow-[0_1px_0_0_#e7e6e5]">
        <p className="font-bold text-[17px] text-[#100c08]">Dienst tauschen</p>
      </div>

      {/* Content */}
      <div className="px-6 pt-[24px] pb-[120px]">

        {/* Haupt-Card */}
        <div className="bg-white rounded-[12px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">

          {/* Erfolgs-Banner */}
          <div className="px-[16px] py-[20px] flex flex-col items-center gap-[12px] border-b border-[#e7e6e5]">
            <div className="flex items-center justify-center size-[36px] rounded-full bg-[#e8f5e9]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-[16px] font-normal text-black leading-[1.5] text-center">
              Ihre Anfrage zum Diensttausch wurde an{" "}
              <span className="font-bold">{gewPerson}</span>{" "}
              versendet.
            </p>
          </div>

          {/* Abzugebender Dienst */}
          <div className="flex flex-col gap-[10px] px-[16px] pt-[16px] pb-[16px]">
            <p className="text-[16px] font-bold text-black">Abzugebender Dienst</p>
            {abgabeDatum && (
              <p className="text-[16px] font-normal text-black">{abgabeDatum}</p>
            )}
            <div className="bg-[#f6f5f5] rounded-[8px] p-[16px] flex flex-col gap-[8px]">
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
            {grund && (
              <div className="flex flex-col gap-[4px] pt-[4px]">
                <p className="text-[14px] font-bold text-black">Grund für den Tausch</p>
                <p className="text-[16px] font-normal text-black leading-[1.5]">{grund}</p>
              </div>
            )}
          </div>

          {/* Trennlinie */}
          <div className="relative flex items-center px-[16px]" aria-hidden="true">
            <div className="flex-1 h-px bg-[#cfcbc7]" />
            <div className="mx-1 size-2.5 rotate-45 border-r border-b bg-white border-[#cfcbc7]" />
            <div className="flex-1 h-px bg-[#cfcbc7]" />
          </div>

          {/* Gewünschter Dienst */}
          <div className="flex flex-col gap-[8px] px-[16px] pt-[16px] pb-[20px]">
            <p className="text-[16px] font-bold text-black">Gewünschter Dienst zur Übernahme</p>
            {gewDatum && (
              <p className="text-[16px] font-normal text-black">{gewDatum}</p>
            )}
            {gewDienst && (
              <p className="text-[16px] font-normal text-black">
                {gewDienst}{DIENST_ZEITEN[gewDienst] ? ` (${DIENST_ZEITEN[gewDienst]})` : ""}
              </p>
            )}
          </div>

        </div>

        <p className="text-[16px] font-normal text-[#55514d] leading-[1.5] mt-[12px]">
          Wird der Tausch angenommen, wird der/die Vorgesetzte automatisch informiert.
        </p>
      </div>

      {/* Fixierte Buttons */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[390px] px-6 pb-[32px] pt-[12px] bg-[#f3f2f2] flex flex-col gap-[10px]">
        <button
          onClick={() => setZurueckziehenOffen(true)}
          className="w-full h-[40px] rounded-[12px] border border-[#100c08] text-[#100c08] font-bold text-[15px] bg-transparent cursor-pointer hover:bg-[#f0efee] transition-colors"
        >
          Anfrage zurückziehen
        </button>
        <button
          onClick={() => router.push("/demo-dashboard-luca")}
          className="w-full h-[40px] rounded-[12px] border border-[#100c08] text-[#100c08] font-bold text-[15px] bg-transparent cursor-pointer hover:bg-[#f0efee] transition-colors"
        >
          Dashboard
        </button>
      </div>

      {/* Bestätigungs-Dialog: Anfrage zurückziehen */}
      {zurueckziehenOffen && (
        <>
          <div
            className="fixed inset-0 z-[600] bg-black/40"
            onClick={() => setZurueckziehenOffen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[700] flex items-center justify-center px-[24px]">
            <div className="w-full max-w-[340px] bg-white rounded-[16px] p-[24px] flex flex-col gap-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
              <p className="font-bold text-[17px] text-[#100c08]">Anfrage zurückziehen?</p>
              <p className="font-normal text-[15px] text-[#55514d] leading-[1.5]">
                Möchten Sie Ihre Diensttausch-Anfrage{gewPerson ? ` an ${gewPerson}` : ""} wirklich zurückziehen? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex flex-col gap-[10px] pt-[4px]">
                <button
                  onClick={() => {
                    localStorage.removeItem("diensttausch_anfrage");
                    router.push("/demo-dienstplanung-luca");
                  }}
                  className="w-full h-[40px] rounded-[12px] bg-[#100c08] text-white font-bold text-[15px] cursor-pointer hover:bg-[#2a2724] transition-colors"
                >
                  Anfrage zurückziehen
                </button>
                <button
                  onClick={() => setZurueckziehenOffen(false)}
                  className="w-full h-[40px] rounded-[12px] border border-[#100c08] text-[#100c08] font-bold text-[15px] bg-transparent cursor-pointer hover:bg-[#f0efee] transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default function DienstTauschBestaetigungPage() {
  return (
    <Suspense>
      <BestaetigungInner />
    </Suspense>
  );
}
