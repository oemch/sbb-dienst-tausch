"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import WochenkalenderOverlay from "../components/WochenkalenderOverlay";
import { useState } from "react";

export default function Wochenkalender1Page() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(true);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div className="bg-white flex flex-col items-start min-h-screen w-full relative">
      {/* Header Toolbar */}
      <div className="bg-[#f3f2f2] flex flex-col items-start overflow-clip sticky top-0 shrink-0 w-full z-10">
        <div className="flex flex-col items-start overflow-clip relative shrink-0 w-full">
          {/* Base Header */}
          <div className="bg-white flex flex-col items-start justify-center overflow-clip relative shrink-0 w-full">
            {/* Header */}
            <div className="flex h-[48px] items-center px-[24px] relative shrink-0 w-full">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
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
        <div className="bg-white border-b border-[#cfcbc7] border-solid flex items-start relative shrink-0 w-full">
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
          <p className="font-bold leading-normal not-italic relative shrink-0 text-[#100c08] text-[14px]">
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
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px]">
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
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#55514d] text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>
          </div>
        </div>

        {/* DI 07 - Termin Card mit Tausch */}
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
            {/* Neu Tag */}
            <div className="absolute right-[-12px] w-[62px] h-[24px] top-[-6px]">
              <Image
                src="/images/tag-neu.svg"
                alt="Neu"
                width={62}
                height={24}
                className="w-full h-full"
              />
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
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px]">
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
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#55514d] text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>

            {/* Tausch Section */}
            <div className="bg-[#FEFBE9] flex gap-[10px] items-start overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center relative shrink-0">
                {/* Swap Icon */}
                <div className="overflow-clip relative shrink-0 size-[16px]">
                  <Image
                    src="/images/icon-tausch.svg"
                    alt="Tausch"
                    width={16}
                    height={16}
                    className="w-full h-full"
                  />
                </div>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[12px] text-black">
                  Im Tausch für:
                </p>
              </div>
              <div className="flex flex-[1_0_0] gap-[10px] items-start justify-end leading-[1.4] min-h-px min-w-px not-italic pl-[24px] pr-[0px] relative text-[#100c08] text-[12px]">
                <p className="font-normal relative shrink-0">
                  Mi, 08.04.
                </p>
                <div className="flex flex-col items-end relative shrink-0">
                  <p className="font-bold relative shrink-0">
                    Spätdienst
                  </p>
                  <p className="font-normal relative shrink-0">
                    14:00 - 22:00
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-[16px] items-start pr-[0px] pt-[8px] relative shrink-0 w-full z-[110]">
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
          <div className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
            {/* Tag "Würde wegfallen" */}
            <div className="absolute bg-[#696561] flex h-[24px] items-center justify-center overflow-clip rounded-[12px] right-[-12px] top-[-6px] w-[130px]">
              <div className="flex flex-[1_0_0] h-full items-center min-h-px min-w-px px-[8px] relative">
                <p className="flex-1 font-normal leading-[1.4] min-h-px min-w-px not-italic relative text-[14px] text-center text-white">
                  Würde wegfallen
                </p>
              </div>
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
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#b5b1ad] text-[14px]">
                  14:00 - 22:00
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#b5b1ad] text-[14px]">
                    Spätdienst
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#b5b1ad] text-[12px]">
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
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px]">
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
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#55514d] text-[12px]">
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
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px]">
                  Ganzer Tag
                </p>
                <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[14px]">
                    Frei
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[4px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
              <p className="font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#55514d] text-[12px]">
                Dauer: 8:00 h    Pause: 0:20 h
              </p>
            </div>
          </div>
        </div>
      </div>

      {showOverlay && <WochenkalenderOverlay onClose={handleCloseOverlay} />}

      {/* Footer - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e7e6e5] border-solid flex h-[48px] items-end justify-center pb-[12px] px-[24px] z-10">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1C4.9 1 4 1.9 4 3V4H3C2.4 4 2 4.4 2 5V9C2 9.6 2.4 10 3 10H9C9.6 10 10 9.6 10 9V5C10 4.4 9.6 4 9 4H8V3C8 1.9 7.1 1 6 1ZM6 2C6.6 2 7 2.4 7 3V4H5V3C5 2.4 5.4 2 6 2ZM3 5H9V9H3V5Z"
              fill="currentColor"
            />
          </svg>
          <span>jazz mitarbeiterportal</span>
        </div>
      </div>
    </div>
  );
}
