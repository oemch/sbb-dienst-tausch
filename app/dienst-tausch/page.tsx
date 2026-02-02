"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DienstTauschOverlay from "../components/DienstTauschOverlay";

export default function DienstTauschPage() {
  const router = useRouter();
  const [overlayState, setOverlayState] = useState<0 | 1 | 2>(0);

  // Overlay 1 nach 5 Sekunden einblenden
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayState(1);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    if (overlayState === 2) {
      setOverlayState(1);
    } else if (overlayState === 1) {
      setOverlayState(0);
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-white flex flex-col items-start min-h-screen w-full relative">
      {/* Header Toolbar – z-index über Overlay, damit Zurück-Button immer klickbar */}
      <div className="flex flex-col items-start relative shrink-0 w-full z-[110]">
        {/* Base Header - Status Bar entfernt */}
        <div className="bg-white flex flex-col items-start justify-center overflow-clip relative shrink-0 w-full">
          {/* Header */}
          <div className="flex h-[48px] items-center px-[24px] relative shrink-0 w-full">
            {/* Back Button */}
            <button
              onClick={handleBackClick}
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

      {/* Tabs */}
      <div className="border-b border-[#cfcbc7] border-solid flex items-start relative shrink-0 w-full">
        {/* Tauschbörse Tab */}
        <div className="flex flex-1 h-[48px] items-center justify-center pt-[4px] px-[24px] relative shrink-0">
          <p className="font-bold leading-normal not-italic relative shrink-0 text-[#100c08] text-[16px] text-center">
            Tauschbörse
          </p>
        </div>
        {/* An mich Tab - Active */}
        <div className="border-b-4 border-[#04775b] border-solid flex flex-1 h-[48px] items-center justify-center pt-[4px] px-[24px] relative shrink-0">
          <p className="font-bold leading-normal not-italic relative shrink-0 text-[#04775b] text-[16px] text-center">
            An mich
          </p>
        </div>
        {/* Von mir Tab */}
        <div className="flex flex-1 h-[48px] items-center justify-center pt-[4px] px-[24px] relative shrink-0">
          <p className="font-bold leading-normal not-italic relative shrink-0 text-[#100c08] text-[16px] text-center">
            Von mir
          </p>
        </div>
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

      {/* Content */}
      <div className="bg-[#f3f2f2] flex flex-col gap-[24px] items-end pb-[160px] pt-[12px] px-[24px] relative shrink-0 w-full flex-1">
        {/* Request Header */}
        <div className="flex flex-col gap-[4px] items-start not-italic relative shrink-0 text-[#100c08] text-[18px] w-full">
          <div className="flex flex-col h-[16px] justify-center leading-[0] relative shrink-0 w-full">
            <p className="font-normal leading-[1.4]">Mia Steiner fragt an für</p>
          </div>
          <p className="font-bold leading-normal relative shrink-0 w-full">
            Dienstag, 07. April 2026
          </p>
        </div>

        {/* Termin Card */}
        <div className="flex gap-[8px] items-start relative shrink-0 w-full">
          {/* Short Date */}
          <div className="flex flex-col items-start justify-center leading-[1.4] not-italic relative shrink-0">
            <p className="font-normal relative shrink-0 text-[#55514d] text-[14px]">
              DI
            </p>
            <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
              07
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            {/* Padding Header */}
            <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex flex-row items-center self-stretch">
                <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0 w-[40px]">
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
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px]">
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
            <div className="bg-[#E7E6E5] flex flex-col gap-[2px] overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full">
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
            <div className="flex gap-[16px] items-start pr-[0px] pt-[8px] relative shrink-0 w-full z-[60]">
              {/* Ablehnen Button - nicht verlinkt */}
              <button
                type="button"
                className="bg-white border-[#100c08] border-[1.5px] border-solid flex flex-[1_0_0] h-[40px] items-center justify-center min-h-[32px] min-w-[112px] px-[24px] relative rounded-[8px]"
              >
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px] text-center">
                  Ablehnen
                </p>
              </button>
              {/* Annehmen Button - nicht verlinkt */}
              <button
                type="button"
                className="bg-white border-[#100c08] border-[1.5px] border-solid flex flex-[1_0_0] h-[40px] items-center justify-center min-h-[32px] min-w-px px-[24px] relative rounded-[8px]"
              >
                <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px] text-center">
                  Annehmen
                </p>
              </button>
            </div>

            {/* Dienstplan einblenden - innerhalb der Kachel, rechtsbündig */}
            <div className="flex justify-end pt-[8px] relative shrink-0 w-full">
              <button
                onClick={() => router.push("/wochenkalender-1")}
                className="flex gap-[8px] h-[32px] items-center justify-end relative shrink-0 cursor-pointer"
              >
                {/* Calendar Icon */}
                <div className="relative shrink-0 size-[16px]">
                  <Image
                    src="/images/icon-calendar.svg"
                    alt="Kalender"
                    width={16}
                    height={16}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#100c08] text-[15px] text-center">
                  <p className="leading-[1.4]">Dienstplan anzeigen</p>
                </div>
              </button>
            </div>

            {/* Blue Tag "Neu" - innerhalb der Kachel, rechts oben mit 6px Abstand */}
            <div className="absolute right-[6px] w-[62px] h-[24px] top-[6px]">
              <Image
                src="/images/tag-neu.svg"
                alt="Neu"
                width={62}
                height={24}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay – nur bei Status 1 oder 2 */}
      {overlayState > 0 && (
        <DienstTauschOverlay overlayState={overlayState as 1 | 2} setOverlayState={setOverlayState} />
      )}
    </div>
  );
}
