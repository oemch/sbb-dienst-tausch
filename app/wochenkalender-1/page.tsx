"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import WochenkalenderOverlay from "../components/WochenkalenderOverlay";
import { useState, useEffect } from "react";

export default function Wochenkalender1Page() {
  const router = useRouter();
  const [overlayState, setOverlayState] = useState<0 | 1 | 2>(0);

  // Overlay 1 nach 5 Sekunden einblenden – startet neu wenn overlayState auf 0 zurückgesetzt wird
  useEffect(() => {
    if (overlayState === 0) {
      const timer = setTimeout(() => setOverlayState(1), 5000);
      return () => clearTimeout(timer);
    }
  }, [overlayState]);

  // Beim Laden: Scroll-Position auf 120px setzen, damit die erste Kachel von DI-07 als erste sichtbare Kachel angezeigt wird
  useEffect(() => {
    window.scrollTo({ top: 120, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-white flex flex-col items-start min-h-screen w-full relative">
      {/* Header Toolbar – z-index über Overlay, damit Zurück-Button immer klickbar */}
      <div className="bg-[#f3f2f2] flex flex-col items-start overflow-clip sticky top-0 shrink-0 w-full z-[550]">
        <div className="flex flex-col items-start overflow-clip relative shrink-0 w-full">
          {/* Base Header */}
          <div className="bg-white flex flex-col items-start justify-center overflow-clip relative shrink-0 w-full">
            {/* Header */}
            <div className="flex h-[48px] items-center px-[24px] relative shrink-0 w-full">
              {/* Back Button */}
              <button
                onClick={() => {
                  if (overlayState === 2) {
                    setOverlayState(1);
                  } else {
                    router.push("/dashboard");
                  }
                }}
                className="flex items-center justify-center p-[8px] relative shrink-0 size-[40px]"
              >
                <div className="flex items-center justify-center relative shrink-0 size-[24px]">
                  <Image
                    src="/images/icon-pfeil-links.svg"
                    alt="Zurück"
                    width={24}
                    height={24}
                    className="w-full h-full"
                  />
                </div>
              </button>
              {/* Title */}
              <p className="flex-1 font-bold leading-normal min-h-px min-w-px text-[#100c08] text-[16px] text-center">
                Dienst tauschen
              </p>
              {/* Spacer */}
              <div className="flex items-center justify-center p-[8px] shrink-0 size-[40px]" />
            </div>
          </div>

          {/* Line Separator */}
          <div className="bg-[#e7e6e5] h-[4px] shrink-0 w-full" />
        </div>

        {/* Calendar Row */}
        <div className="bg-[#f3f2f2] flex gap-[8px] h-[40px] items-center overflow-clip pl-[24px] pr-[12px] py-[8px] relative shrink-0 w-full">
          <p className="font-bold leading-normal not-italic relative shrink-0 text-[#100c08] text-[16px]">
            KW 15 / 06. – 12. April 2026
          </p>
          <div className="flex flex-1 items-center justify-end min-h-px min-w-px relative">
            {/* Filter Icon */}
            <div className="flex items-center justify-center p-[8px] relative shrink-0 size-[40px]">
              <Image
                src="/images/icon-filter.svg"
                alt="Filter"
                width={24}
                height={24}
                className="size-[24px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#f3f2f2] flex flex-col gap-[12px] items-start pb-[160px] pt-[12px] px-[24px] relative shrink-0 w-full flex-1">
        {/* MO 06 - Termin Card */}
        <div className="flex items-start relative shrink-0 w-full">
          {/* Short Date */}
          <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center">
              MO
            </p>
            <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
              06
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                  <Image
                    src="/images/icon-spaetschicht.svg"
                    alt="Spätdienst"
                    width={40}
                    height={40}
                    className="size-[40px]"
                  />
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                  14:00 - 22:00
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[16px]">
                    Spätdienst
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>
          </div>
        </div>

        {/* DI 07 - Erste Kachel (Frei, identisch zu FR-10) */}
        <div className="flex items-start relative shrink-0 w-full">
          {/* Short Date */}
          <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center">
              DI
            </p>
            <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
              07
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                  <div className="bg-[#bacbed] flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[32px]">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center w-full">
                      15
                    </p>
                  </div>
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                  Ganzer Tag
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[16px]">
                    Frei
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>
          </div>
        </div>

        {/* DI 07 - Zweite Kachel (Tausch, identisch zur bisherigen DI-07) */}
        <div className="flex items-start relative shrink-0 w-full">
          {/* Short Date - leerer Platzhalter */}
          <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
          </div>

          {/* Content Card */}
          <div className="flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]" style={{ backgroundColor: '#FEFBE9', border: '2px solid #F7D526' }}>
            {/* Neu Tag */}
            <div className="absolute z-20 bg-[#F7D526] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[19px]">
              <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-black whitespace-nowrap">
                Neu
              </p>
            </div>

            {/* Header */}
            <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                  <Image
                    src="/images/icon-spaetschicht.svg"
                    alt="Spätdienst"
                    width={40}
                    height={40}
                    className="size-[40px]"
                  />
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                  14:00 - 22:00
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[16px]">
                    Spätdienst
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>

            {/* Tausch Section */}
            <div className="flex flex-col gap-[2px] overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundColor: '#FDF2BE' }}>
              {/* Zeile 1: Mia Steiner übernimmt dafür: */}
              <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black">
                Mia Steiner übernimmt dafür:
              </p>
              {/* Zeile 2: Spätdienst (fett) vom Mi, 08. April, 14:00 - 22:00 */}
              <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black">
                <span className="font-bold text-[#100c08]">Spätdienst</span> vom Mi, 08. April, 14:00 - 22:00
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-[16px] items-start pr-[0px] pt-[8px] relative shrink-0 w-full z-[10]">
              {/* Ablehnen Button */}
              <button
                onClick={() => router.push("/request-denied")}
                className="bg-white border-[#100c08] border-[1.5px] border-solid flex flex-[1_0_0] h-[40px] items-center justify-center min-h-[32px] min-w-[112px] px-[24px] relative rounded-[8px]"
              >
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px] text-center">
                  Ablehnen
                </p>
              </button>
              {/* Annehmen Button */}
              <button
                onClick={() => router.push("/request-approved")}
                className="bg-white border-[#100c08] border-[1.5px] border-solid flex flex-[1_0_0] h-[40px] items-center justify-center min-h-[32px] min-w-px px-[24px] relative rounded-[8px]"
              >
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px] text-center">
                  Annehmen
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* MI 08 - Termin Card (grau/deaktiviert) */}
        <div className="flex items-start relative shrink-0 w-full">
          {/* Short Date */}
          <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center">
              MI
            </p>
            <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
              08
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-[#BEBAB6] flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            {/* Tag "Entfällt" – absolut, liegt über Zeitangabe bei Überlappung (z.B. Mobile) */}
            <div className="absolute z-20 bg-[#696561] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[19px]">
              <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                Entfällt
              </p>
            </div>

            {/* Header */}
            <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                  <Image
                    src="/images/icon-spaetschicht.svg"
                    alt="Spätdienst"
                    width={40}
                    height={40}
                    className="size-[40px]"
                  />
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                  14:00 - 22:00
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[14px]">
                    Spätdienst
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#100c08] text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>
          </div>
        </div>

        {/* DO 09 - Termin Card */}
        <div className="flex items-start relative shrink-0 w-full">
          {/* Short Date */}
          <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center">
              DO
            </p>
            <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
              09
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                  <Image
                    src="/images/icon-spaetschicht.svg"
                    alt="Spätdienst"
                    width={40}
                    height={40}
                    className="size-[40px]"
                  />
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                  14:00 - 22:00
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[16px]">
                    Spätdienst
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>
          </div>
        </div>

        {/* FR 10 - Frei Card */}
        <div className="flex items-start relative shrink-0 w-full">
          {/* Short Date */}
          <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center">
              FR
            </p>
            <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
              10
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                  <div className="bg-[#bacbed] flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[32px]">
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center w-full">
                      15
                    </p>
                  </div>
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
                  <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                  Ganzer Tag
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[16px]">
                    Frei
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-black text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>
          </div>
        </div>
      </div>

      {overlayState > 0 && (
        <WochenkalenderOverlay overlayState={overlayState as 1 | 2} setOverlayState={setOverlayState} />
      )}
    </div>
  );
}
