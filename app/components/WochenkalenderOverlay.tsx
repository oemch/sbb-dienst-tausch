"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface WochenkalenderOverlayProps {
  overlayState: 1 | 2;
  setOverlayState: (state: 0 | 1 | 2) => void;
}

const SLIDE_TRANSITION = "transform 500ms ease-out";
const FADE_TRANSITION = "opacity 500ms ease-out";

export default function WochenkalenderOverlay({ overlayState, setOverlayState }: WochenkalenderOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [kachel1Ready, setKachel1Ready] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Kachel 1: nach Sichtbarkeit von links einfahren (nur beim ersten Erscheinen)
  useEffect(() => {
    if (isVisible && overlayState === 1) {
      const frame = requestAnimationFrame(() => setKachel1Ready(true));
      return () => cancelAnimationFrame(frame);
    }
    if (overlayState === 2) setKachel1Ready(false);
  }, [isVisible, overlayState]);

  const handleClick = () => {
    if (overlayState === 1) setOverlayState(2);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Verhindert, dass das Event zur Kachel propagiert
    setOverlayState(0);
  };

  // Berechne die Position der Aussparung für Overlay 2 (Buttons)
  // Header (48px) + Line (4px) + Calendar (40px) + Content Padding Top (12px) + MO 06 Kachel (~100px) + Gap (12px) - 8px - 3px + 3px
  const cutoutTop = 48 + 4 + 40 + 12 + 100 + 12 - 8 - 3 + 3; // 208px
  // Höhe: 236px + 12px + 12px + 12px - 3px
  const cutoutHeight = 236 + 12 + 12 + 12 - 3; // 269px

  return (
    <>
      {/* Backdrop: State 1 = voller Klickbereich, State 2 = Cutout */}
      {overlayState === 1 && (
        <button
          onClick={handleClick}
          className={`absolute inset-0 z-[500] w-full h-full cursor-pointer transition-opacity duration-500 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          type="button"
        />
      )}

      {overlayState === 2 && (
        <div
          className={`absolute inset-0 z-[500] w-full h-full pointer-events-none transition-opacity duration-500 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute bg-transparent"
            style={{
              top: `${cutoutTop}px`,
              left: "24px",
              width: "calc(100% - 48px)",
              height: `${cutoutHeight}px`,
              borderRadius: "8px",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0)",
            }}
          />
        </div>
      )}

      {/* Kachel-Container – beide Kacheln unten bündig, 24px Abstand */}
      <div
        className="fixed left-[24px] right-[24px] z-[510] pointer-events-auto"
        style={{
          bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          overflowX: "hidden",
          overflowY: "visible",
        }}
      >
        <div className="relative w-full" style={{ minHeight: "220px", paddingTop: "40px" }}>
          {/* Kachel 1 – Slide-in von links beim Erscheinen, Überblendung bei Wechsel zu 2 */}
          <div
            role="button"
            tabIndex={0}
            onClick={overlayState === 1 ? handleClick : undefined}
            onKeyDown={(e) => overlayState === 1 && (e.key === "Enter" || e.key === " ") && handleClick()}
            className={`absolute left-0 right-0 bottom-0 ease-out ${overlayState === 1 ? "cursor-pointer" : "pointer-events-none"}`}
            style={{
              transform:
                overlayState === 1
                  ? kachel1Ready
                    ? "translateX(0)"
                    : "translateX(-100%)"
                  : "translateX(0)",
              opacity: overlayState === 1 ? 1 : 0,
              transition: `${SLIDE_TRANSITION}, ${FADE_TRANSITION}`,
            }}
          >
            <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-0 relative">
              {/* Schließen-Button oben rechts */}
              <button
                onClick={handleCloseClick}
                className="absolute top-[16px] right-[16px] flex items-center justify-center w-[24px] h-[24px] cursor-pointer hover:opacity-70 transition-opacity z-10"
                aria-label="Overlay schließen"
              >
                <Image
                  src="/images/icon-close.svg"
                  alt="Schließen"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </button>
              <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left pr-[48px]">
                Der vorgeschlagene Tausch wird in Ihrem Dienstplan angezeigt.
              </p>
              <div className="absolute bottom-[16px] right-[16px]">
                <Image
                  src="/images/icon-pfeil-links.svg"
                  alt="Pfeil rechts"
                  width={24}
                  height={24}
                  className="rotate-180"
                />
              </div>
            </div>
          </div>

          {/* Kachel 2 – Überblendung bei Wechsel von 1 zu 2 */}
          <div
            className="absolute left-0 right-0 bottom-0 ease-out"
            style={{
              opacity: overlayState === 2 ? 1 : 0,
              pointerEvents: overlayState === 2 ? "auto" : "none",
              transition: FADE_TRANSITION,
            }}
          >
            <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-[8px] relative">
              {/* Schließen-Button oben rechts */}
              <button
                onClick={() => setOverlayState(0)}
                className="absolute top-[16px] right-[16px] flex items-center justify-center w-[24px] h-[24px] cursor-pointer hover:opacity-70 transition-opacity"
                aria-label="Overlay schließen"
              >
                <Image
                  src="/images/icon-close.svg"
                  alt="Schließen"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </button>
              <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left pr-[48px]">
                <span className="font-bold">Nehmen</span> Sie die <span className="font-bold">Anfrage</span> <span className="font-bold">an</span> oder <span className="font-bold">lehnen</span> Sie sie <span className="font-bold">ab</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
