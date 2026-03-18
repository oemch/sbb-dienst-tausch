"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DIENST_ZEITEN: Record<string, string> = {
  "Frühdienst":  "06:00 – 15:00",
  "BE Mo-Do (15)":  "13:00 – 22:00",
  "Nachtdienst": "22:00 – 06:00",
};

const TAG_LANG: Record<string, string> = {
  MO: "Montag", DI: "Dienstag", MI: "Mittwoch", DO: "Donnerstag",
  FR: "Freitag", SA: "Samstag", SO: "Sonntag",
};

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

function BestaetigungInner() {
  const router = useRouter();
  const p = useSearchParams();

  const urlTag   = p.get("tag")      ?? "";
  const urlDatum = p.get("datum")    ?? "";
  const dienst   = p.get("dienst")   ?? "Frühdienst";
  const uhrzeit  = p.get("uhrzeit")  ?? "06:00 – 15:00";
  const gewDatum  = p.get("gewDatum")  ?? "";
  const gewDienst = p.get("gewDienst") ?? "";
  const gewPerson = p.get("gewPerson") ?? "";

  const abgabeDatum = urlTag
    ? `${TAG_LANG[urlTag] ?? urlTag}, ${urlDatum}. April 2026`
    : "";

  // Anfrage in localStorage speichern, damit Jonas sie in seinem Flow sieht
  useEffect(() => {
    if (urlTag && urlDatum && gewPerson) {
      const anfrage = { tag: urlTag, datum: urlDatum, dienst, uhrzeit, gewDatum, gewDienst, gewPerson };
      localStorage.setItem("diensttausch_anfrage", JSON.stringify(anfrage));
    }
  }, [urlTag, urlDatum, dienst, uhrzeit, gewDatum, gewDienst, gewPerson]);

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
      </div>

      {/* Fixierte Buttons */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[390px] px-6 pb-[32px] pt-[12px] bg-[#f3f2f2] flex flex-col gap-[10px]">
        <button
          onClick={() => router.push("/sbb-dashboard-mia")}
          className="w-full h-[40px] rounded-[12px] border border-[#100c08] text-[#100c08] font-bold text-[15px] bg-transparent cursor-pointer hover:bg-[#f0efee] transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            const params = new URLSearchParams({
              tauschTag: urlTag,
              tauschDatum: urlDatum,
              tauschPerson: gewPerson,
              gewDatum,
              gewDienst,
            });
            router.push(`/sbb-dienstplanung-mia?${params.toString()}`);
          }}
          className="w-full h-[40px] rounded-[12px] border border-[#100c08] text-[#100c08] font-bold text-[15px] bg-transparent cursor-pointer hover:bg-[#f0efee] transition-colors"
        >
          Einsatzplanung
        </button>
      </div>

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
