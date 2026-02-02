"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface DashboardOverlayProps {
  overlayState: 1 | 2;
  setOverlayState: (state: 1 | 2) => void;
}

const SLIDE_TRANSITION = "transform 500ms ease-out";
const FADE_TRANSITION = "opacity 500ms ease-out";

export default function DashboardOverlay({ overlayState, setOverlayState }: DashboardOverlayProps) {
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

  return (
    <>
      {/* Backdrop: State 1 = voller Klickbereich, State 2 = Cutout */}
      {overlayState === 1 && (
        <button
          onClick={handleClick}
          className={`absolute inset-0 z-50 w-full h-full cursor-pointer transition-opacity duration-500 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          type="button"
        />
      )}

      {overlayState === 2 && (
        <div
          className={`absolute inset-0 z-50 w-full h-full pointer-events-none transition-opacity duration-500 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute bg-transparent"
            style={{
              top: "124px",
              left: "24px",
              width: "calc(100% - 48px)",
              height: "87px",
              borderRadius: "8px",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0)",
            }}
          />
        </div>
      )}

      {/* Kachel-Container – beide Kacheln unten bündig, 24px Abstand */}
      <div
        className="fixed left-[24px] right-[24px] z-[60] pointer-events-auto"
        style={{
          bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          overflowX: "hidden",
          overflowY: "visible",
        }}
      >
        <div className="relative w-full min-h-[180px]">
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
              <p className="font-bold leading-normal text-[#100c08] text-[18px] text-left">
                Das ZESAM-Dashboard
              </p>
              <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left">
                Mitarbeitende sehen hier die wichtigsten Informationen zu ihren Einsätzen und
                Ferien. Auch Dienste können direkt getauscht werden.
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
            <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-[8px]">
              <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left">
                Sie haben oben eine Anfrage zum Diensttausch erhalten.{" "}
                <span className="font-bold">Bitte prüfen Sie die Anfrage.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
