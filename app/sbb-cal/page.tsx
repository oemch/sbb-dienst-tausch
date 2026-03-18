"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

type DiensttauschAnfrage = {
  tag: string; datum: string; dienst: string; uhrzeit: string;
  gewDatum: string; gewDienst: string; gewPerson: string;
};

const TAG_KURZ: Record<string, string> = {
  MO: "Mo", DI: "Di", MI: "Mi", DO: "Do", FR: "Fr", SA: "Sa", SO: "So",
};

export default function Wochenkalender1Page() {
  const router = useRouter();
  const [requestState, setRequestState] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [hideFirstCard, setHideFirstCard] = useState(false);
  const [hideSecondCard, setHideSecondCard] = useState(false);
  const [anfrage, setAnfrage] = useState<DiensttauschAnfrage | null>(null);

  // Diensttausch-Anfrage von Mia aus localStorage laden
  useEffect(() => {
    const raw = localStorage.getItem("diensttausch_anfrage");
    if (raw) {
      try { setAnfrage(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  // Erste Kachel nach Animation aus DOM entfernen
  useEffect(() => {
    if (requestState === 'approved') {
      const timer = setTimeout(() => {
        setHideFirstCard(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setHideFirstCard(false);
    }
  }, [requestState]);

  // Zweite Kachel nach Animation aus DOM entfernen (bei denied)
  useEffect(() => {
    if (requestState === 'denied') {
      const timer = setTimeout(() => {
        setHideSecondCard(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setHideSecondCard(false);
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
                  router.push("/sbb-dashboard");
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
                    alt="BE Mo-Do (15)"
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
                    BE Mo-Do (15)
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

        {/* DI 07 - Container mit Datum und beiden Kacheln */}
        <div className="flex items-start relative shrink-0 w-full min-w-0">
          {/* Short Date - bleibt IMMER sichtbar, wird nie ausgeblendet oder verschoben */}
          <div className="flex flex-col items-start leading-[1.4] not-italic pr-[8px] relative shrink-0 w-[38px]">
            <p className="font-normal relative shrink-0 text-[#55514d] text-[14px] text-center">
              DI
            </p>
            <p className="font-bold relative shrink-0 text-[#100c08] text-[20px] w-[32px]">
              07
            </p>
          </div>

          {/* Container für beide Kacheln */}
          <div 
            className="flex flex-col items-start relative shrink-0 flex-1 w-full min-w-0"
            style={{
              transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Erste Kachel (Frei, identisch zu FR-10) - verschwindet bei approved, bleibt bei denied */}
            {!hideFirstCard && (
              <div 
                className="bg-white flex flex-[1_0_0] flex-col gap-[8px] items-start relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)] transition-all duration-[700ms] ease-in-out w-full"
                style={{
                  opacity: requestState === 'approved' ? 0 : 1,
                  maxHeight: requestState === 'approved' ? '0px' : '500px',
                  height: requestState === 'approved' ? '0px' : 'auto',
                  padding: requestState === 'approved' ? '0px' : '16px',
                  overflow: requestState === 'approved' ? 'hidden' : 'visible',
                  marginBottom: (requestState === 'approved' || requestState === 'denied') ? '0px' : '12px',
                }}
              >
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
            )}

            {/* Zweite Kachel (Tausch -> normale BE Mo-Do (15)-Kachel bei approved, ausgeblendet bei denied) */}
            {!hideSecondCard && (
              <div 
                className="w-full"
                style={{
                  opacity: requestState === 'denied' ? 0 : 1,
                  maxHeight: requestState === 'denied' ? '0px' : '500px',
                  overflow: requestState === 'denied' ? 'hidden' : 'visible',
                  transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), max-height 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div 
                  className="bg-white flex flex-col gap-[8px] items-start relative rounded-[8px] w-full p-[16px] min-w-0"
                  style={{
                    backgroundColor: requestState === 'pending' ? '#FEFBE9' : 'white',
                    border: requestState === 'pending' ? '2px solid #F7D526' : '2px solid transparent',
                    boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)',
                    transition: 'background-color 700ms cubic-bezier(0.4, 0, 0.2, 1), border-color 700ms cubic-bezier(0.4, 0, 0.2, 1), border-width 700ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                    boxSizing: 'border-box',
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
                        alt="BE Mo-Do (15)"
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
                        BE Mo-Do (15)
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

                {/* Hellgelber Bereich - nur wenn approved */}
                <div 
                  className="w-full"
                  style={{
                    opacity: requestState === 'approved' ? 1 : 0,
                    maxHeight: requestState === 'approved' ? '60px' : '0px',
                    overflow: 'hidden',
                    transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), max-height 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                    marginBottom: requestState === 'approved' ? '0px' : '0px',
                  }}
                >
                  <div 
                    className="flex gap-[16px] items-start w-full p-[8px] rounded-[4px] min-w-0"
                    style={{ backgroundColor: '#FFFCDE', boxSizing: 'border-box' }}
                  >
                    <Image
                      src="/images/icon-tausch.svg"
                      alt="Tausch"
                      width={16}
                      height={16}
                      className="shrink-0 mt-[2px]"
                    />
                    <div className="flex flex-col gap-0 min-w-0 flex-1">
                      <p className="font-normal leading-[1.4] not-italic text-black text-[16px] break-words" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        Dienst übernommen
                      </p>
                      <p className="font-normal leading-[1.4] not-italic text-black text-[16px] break-words" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        (für Luca Meier)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tausch Section und Buttons - nur wenn pending */}
                <div 
                  className="w-full"
                  style={{ 
                    opacity: requestState === 'pending' ? 1 : 0,
                    maxHeight: requestState === 'pending' ? '500px' : '0px',
                    overflow: 'hidden',
                    transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), max-height 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: requestState === 'pending' ? 'auto' : 'none',
                    marginTop: requestState === 'approved' ? '-8px' : '0px',
                  }}
                >
                  {/* Tausch Section */}
                  <div className="flex flex-col gap-[2px] overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundColor: '#FDF2BE' }}>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black">
                      Luca Meier übernimmt dafür:
                    </p>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black">
                      {anfrage ? (
                        <>
                          <span className="font-bold text-[#100c08]">{anfrage.dienst}</span>
                          {" vom "}{TAG_KURZ[anfrage.tag] ?? anfrage.tag}, {anfrage.datum}. April, {anfrage.uhrzeit}
                        </>
                      ) : (
                        <><span className="font-bold text-[#100c08]">BE Mo-Do (15)</span> vom Mi, 08. April, 14:00 - 22:00</>
                      )}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-[16px] items-start pr-[0px] pt-[8px] relative shrink-0 w-full z-[10]">
                    {/* Ablehnen Button */}
                    <button
                      onClick={() => {
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
            )}
          </div>
        </div>

        {/* MI 08 - Termin Card (grau/deaktiviert -> Ganzer Tag frei bei approved) */}
        <div className="flex items-start relative shrink-0 w-full min-w-0">
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
            className="flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-0 p-[16px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)] transition-all duration-[650ms] ease-out"
            style={{ 
              backgroundColor: requestState === 'pending' ? '#BEBAB6' : 'white',
              boxSizing: 'border-box',
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

            {/* Header - Conditional: BE Mo-Do (15) wenn pending/denied, Ganzer Tag Frei wenn approved */}
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
                        alt="BE Mo-Do (15)"
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
                        BE Mo-Do (15)
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

                {/* Infobox - nur wenn pending */}
                <div 
                  className="w-full"
                  style={{
                    opacity: requestState === 'pending' ? 1 : 0,
                    maxHeight: requestState === 'pending' ? '100px' : '0px',
                    overflow: 'hidden',
                    transition: 'opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), max-height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: requestState === 'pending' ? 'auto' : 'none',
                    marginBottom: requestState === 'pending' ? '-8px' : '0px',
                  }}
                >
                  <div className="flex flex-col gap-[2px] overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-full" style={{ backgroundColor: '#CFCBC7' }}>
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-black text-[16px]">
                      Wird von Luca Meier übernommen.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Hellgelber Bereich - nur wenn approved */}
            <div 
              className="w-full"
              style={{
                opacity: requestState === 'approved' ? 1 : 0,
                maxHeight: requestState === 'approved' ? '80px' : '0px',
                overflow: 'hidden',
                transition: 'opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), max-height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                marginBottom: requestState === 'approved' ? '1px' : '0px',
              }}
            >
              <div 
                className="flex gap-[16px] items-start w-full p-[8px] rounded-[4px] min-w-0"
                style={{ backgroundColor: '#FFFCDE', boxSizing: 'border-box' }}
              >
                <Image
                  src="/images/icon-tausch.svg"
                  alt="Tausch"
                  width={16}
                  height={16}
                  className="shrink-0 mt-[2px]"
                />
                <div className="flex flex-col gap-0 min-w-0 flex-1">
                  <p className="font-normal leading-[1.4] not-italic text-black text-[16px] break-words" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    Dienst entfällt
                  </p>
                  <p className="font-normal leading-[1.4] not-italic text-black text-[16px] break-words" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    (von Luca Meier übernommen)
                  </p>
                </div>
              </div>
            </div>

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
                    alt="BE Mo-Do (15)"
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
                    BE Mo-Do (15)
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

    </div>
  );
}
