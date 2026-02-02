"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface DashboardOverlayProps {
  overlayState: 1 | 2;
  setOverlayState: (state: 1 | 2) => void;
}

export default function DashboardOverlay({ overlayState, setOverlayState }: DashboardOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClick = () => {
    if (overlayState === 1) {
      setOverlayState(2);
    }
    // Bei Overlay 2: Keine Navigation hier – nur die gelbe Kachel verlinkt zur dienst-tausch Page
  };

  return (
    <>
      {/* Overlay 1 – ganzer Bereich klickbar für Wechsel zu Zustand 2 */}
      {overlayState === 1 && (
        <button
          onClick={handleClick}
          className={`absolute inset-0 z-50 w-full h-full cursor-pointer transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          type="button"
        >
          <div className="absolute bg-[rgba(0,0,0,0)] h-full left-0 overflow-clip top-0 w-full">
            {/* Kachel - unten fixiert mit 24px Abstand links, rechts und unten */}
            <div className="fixed left-[24px] right-[24px] z-[60]" style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
              <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-0 relative">
                <p className="font-bold leading-normal text-[#100c08] text-[18px] text-left">
                  Das ZESAM-Dashboard
                </p>
                <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left">
                  Mitarbeitende sehen hier die wichtigsten Informationen zu ihren Einsätzen und Ferien. Auch Dienste können direkt getauscht werden.
                </p>
                {/* Pfeil rechts unten */}
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
          </div>
        </button>
      )}

      {/* Overlay 2 – Klicks gehen durch, nur gelbe Kachel auf der Page verlinkt */}
      {overlayState === 2 && (
        <div
          className={`absolute inset-0 z-50 w-full h-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Hintergrund – pointer-events-none, Klicks gehen zur Page durch */}
          <div className="absolute h-full left-0 top-0 w-full pointer-events-none">
            <div
              className="absolute bg-transparent"
              style={{
                top: '124px',
                left: '24px',
                width: 'calc(100% - 48px)',
                height: '87px',
                borderRadius: '8px',
                boxShadow: `0 0 0 9999px rgba(0,0,0,0)`,
              }}
            />
          </div>

          {/* Kachel unten – blockiert Klicks, navigiert nicht */}
          <div className="fixed left-[24px] right-[24px] z-[60] pointer-events-auto" style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-[8px]">
              <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left">
                Sie haben oben eine Anfrage zum Diensttausch erhalten. <span className="font-bold">Bitte prüfen Sie die Anfrage.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
