"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import WochenkalenderOverlay from "../components/WochenkalenderOverlay";
import { useState, useEffect } from "react";

export default function Wochenkalender1Page() {
  const router = useRouter();
  const [overlayState, setOverlayState] = useState<0 | 1>(0);
  const [requestState, setRequestState] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [showApprovedOverlay, setShowApprovedOverlay] = useState(false);

  // Overlay Logic: Overlay verstecken wenn request approved oder denied
  useEffect(() => {
    if (requestState === 'approved' || requestState === 'denied') {
      setOverlayState(0);
    } else if (overlayState === 0) {
      const timer = setTimeout(() => setOverlayState(1), 5000);
      return () => clearTimeout(timer);
    }
  }, [requestState, overlayState]);

  // Approved/Denied Overlay nach 4 Sekunden einblenden
  useEffect(() => {
    if (requestState === 'approved' || requestState === 'denied') {
      const timer = setTimeout(() => {
        setShowApprovedOverlay(true);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShowApprovedOverlay(false);
    }
  }, [requestState]);


  // Beim Laden: Scroll-Position auf -40px setzen, damit MO-06 nicht sichtbar ist
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: -40, behavior: 'instant' });
    }, 100);
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
                  router.push("/dashboard");
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

        {/* DI 07 - Erste Kachel (Frei, identisch zu FR-10) - verschwindet bei approved, bleibt bei denied */}
        {requestState !== 'approved' && (
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
                    <div className="bg-[#bacbed] flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]">
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
            </div>
          </div>
        )}

        {/* DI 07 - Zweite Kachel (Tausch -> normale Spätdienst-Kachel bei approved, ausgeblendet bei denied) */}
        <div 
          className="flex items-start relative shrink-0 w-full transition-all duration-[2500ms] ease-out"
          style={{
            opacity: requestState === 'denied' ? 0 : 1,
            maxHeight: requestState === 'denied' ? '0px' : '500px',
            marginBottom: requestState === 'denied' ? '-12px' : '0px',
            overflow: requestState === 'denied' ? 'hidden' : 'visible',
          }}
        >
          {/* Short Date - leerer Platzhalter nur wenn pending, sonst mit Datum (nur bei approved, nicht bei denied) */}
          {requestState === 'pending' ? (
            <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            </div>
          ) : requestState === 'approved' ? (
            <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
              <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center">
                DI
              </p>
              <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
                07
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            </div>
          )}

          {/* Content Card */}
          <div 
            className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]"
            style={{ 
              backgroundColor: requestState === 'pending' ? '#FEFBE9' : 'white',
              border: requestState === 'pending' ? '2px solid #F7D526' : '2px solid transparent',
              transition: 'background-color 2500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 2500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-width 2500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 2500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {/* Neu Tag - nur wenn pending */}
            {requestState === 'pending' && (
              <div className="absolute z-20 bg-[#F7D526] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[19px] transition-opacity duration-[1200ms] ease-in-out" style={{ opacity: requestState === 'pending' ? 1 : 0 }}>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-black whitespace-nowrap">
                  Neu
                </p>
              </div>
            )}
            {/* Neu Tag - nur wenn approved */}
            <div 
              className="absolute z-20 bg-[#174693] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[19px] transition-opacity duration-[3000ms] ease-out"
              style={{ 
                opacity: requestState === 'approved' ? 1 : 0,
                pointerEvents: requestState === 'approved' ? 'auto' : 'none'
              }}
            >
              <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
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

            {/* Tausch Section und Buttons - nur wenn pending */}
            <div 
              className="w-full"
              style={{ 
                opacity: requestState === 'pending' ? 1 : 0,
                maxHeight: requestState === 'pending' ? '500px' : '0px',
                overflow: 'hidden',
                transition: 'opacity 2500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), max-height 2500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                pointerEvents: requestState === 'pending' ? 'auto' : 'none'
              }}
            >
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
                    onClick={() => {
                      setOverlayState(0);
                      setRequestState('denied');
                    }}
                    className="bg-white border-[#100c08] border-[1.5px] border-solid flex flex-[1_0_0] h-[40px] items-center justify-center min-h-[32px] min-w-[112px] px-[24px] relative rounded-[8px] cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px] text-center">
                      Ablehnen
                    </p>
                  </button>
                  {/* Annehmen Button */}
                  <button
                    onClick={() => {
                      setOverlayState(0);
                      setRequestState('approved');
                    }}
                    className="bg-white border-[#100c08] border-[1.5px] border-solid flex flex-[1_0_0] h-[40px] items-center justify-center min-h-[32px] min-w-px px-[24px] relative rounded-[8px] cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px] text-center">
                      Annehmen
                    </p>
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* MI 08 - Termin Card (grau/deaktiviert -> Ganzer Tag frei bei approved) */}
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
          <div 
            className="flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)] transition-all duration-[3000ms] ease-out"
            style={{ 
              backgroundColor: requestState === 'pending' ? '#BEBAB6' : 'white',
            }}
          >
            {/* Tag "Entfällt" – nur wenn pending */}
            {requestState === 'pending' && (
              <div className="absolute z-20 bg-[#696561] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[19px] transition-opacity duration-[1200ms] ease-in-out" style={{ opacity: requestState === 'pending' ? 1 : 0 }}>
                <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                  Entfällt
                </p>
              </div>
            )}

            {/* Header - Conditional: Spätdienst wenn pending/denied, Ganzer Tag Frei wenn approved */}
            {requestState === 'approved' ? (
              <div>
                <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch">
                    <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                      <div className="bg-[#bacbed] flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]">
                        <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center w-full">
                          15
                        </p>
                      </div>
                    </div>
                  </div>
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
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex gap-[12px] items-center justify-center relative shrink-0 w-full">
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
              </>
            )}

            {/* Neu Tag - nur wenn approved */}
            <div 
              className="absolute z-20 bg-[#174693] flex h-[24px] items-center justify-center overflow-hidden rounded-[12px] right-[6px] top-[6px] px-[19px] transition-opacity duration-[3000ms] ease-out"
              style={{ 
                opacity: requestState === 'approved' ? 1 : 0,
                pointerEvents: requestState === 'approved' ? 'auto' : 'none'
              }}
            >
              <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                Neu
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
                  <div className="bg-[#bacbed] flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]">
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
          </div>
        </div>
      </div>

      {/* Overlay – nur bei Status 1 */}
      {overlayState === 1 && (
        <WochenkalenderOverlay overlayState={overlayState} setOverlayState={setOverlayState} />
      )}

      {/* Approved Overlay – nach 3 Sekunden wenn approved */}
      {showApprovedOverlay && (
        <div
          className="fixed left-[24px] right-[24px] z-[510] pointer-events-auto cursor-pointer"
          style={{
            bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
            transition: "opacity 500ms ease-out, transform 500ms ease-out",
            opacity: showApprovedOverlay ? 1 : 0,
            transform: showApprovedOverlay ? "translateY(0)" : "translateY(20px)",
          }}
          onClick={() => router.push(requestState === 'approved' ? "/request-approved" : "/request-denied")}
        >
          <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] h-[48px] flex items-center justify-center relative">
            <p className="font-bold leading-[1.4] not-italic text-[#100c08] text-[14px] text-center">
              Test abschliessen
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
