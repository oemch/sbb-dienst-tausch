"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface DienstTauschOverlayProps {
  onClose?: () => void;
}

export default function DienstTauschOverlay({ onClose }: DienstTauschOverlayProps) {
  const [overlayState, setOverlayState] = useState<1 | 2>(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Overlay nach 5 Sekunden einblenden
    const timer = setTimeout(() => {
      // requestAnimationFrame sichert, dass die Transition startet
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (overlayState === 1) {
      setOverlayState(2);
    }
    // Bei Overlay 2 führt das Overlay selbst keine Aktion aus
  };

  // Berechne die Position der Aussparung
  // Beginnt 8px weiter oben als vor "Mia Steiner fragt an für..." = Header (48px) + Line (4px) + Tabs (48px) + Calendar (40px) + Content Padding Top (12px) - 8px, dann +3px nach unten
  const cutoutTop = 48 + 4 + 48 + 40 + 12 - 8 + 3; // 147px
  // Endet direkt nach dem "Dienstplan einblenden" Link
  // Die Aussparung geht bis ganz an den Rand (links und rechts)
  // Content-Bereich Höhen (konservativ berechnet):
  // - Request Header: ~36px
  // - Gap: 24px
  // - Termin Card: ~250px (Short Date + Content Card)
  // - Gap: 24px
  // - Link: 32px
  // Total: 36 + 24 + 250 + 24 + 32 = 366px
  const requestHeaderHeight = 36;
  const gap1 = 24;
  const terminCardHeight = 250; // Short Date + Content Card
  const gap2 = 24;
  const linkHeight = 32;
  const cutoutHeight = requestHeaderHeight + gap1 + terminCardHeight + gap2 + linkHeight + 4 + 12; // 382px (Aussparung +4px +12px vergrößert)

  return (
    <>
      {/* Overlay 1 */}
      {overlayState === 1 && (
        <button
          onClick={handleClick}
          className={`absolute inset-0 z-[70] w-full h-full cursor-pointer transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          type="button"
        >
          <div className="absolute bg-[rgba(0,0,0,0)] h-full left-0 overflow-clip top-0 w-full">
            {/* Kachel - unten fixiert mit 24px Abstand links, rechts und unten */}
            <div className="fixed left-[24px] right-[24px] z-[70]" style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
              <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-0 relative">
                <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left">
                  In dieser Ansicht sehen Sie <span className="font-bold">Anfragen</span>, die <span className="font-bold">an Sie</span> gerichtet sind, um Dienste zu tauschen.
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

      {/* Overlay 2 */}
      {overlayState === 2 && (
        <div className="absolute h-full left-0 top-0 w-full pointer-events-none z-[100]">
          {/* Hintergrund mit Aussparung - geht von oben (8px vor Request Header) bis direkt nach "Dienstplan einblenden" */}
          <div className="absolute h-full left-0 top-0 w-full pointer-events-none">
            {/* Vollständiger Hintergrund mit Aussparung - verwendet einen transparenten Bereich mit großem Schatten und abgerundeten Ecken */}
            <div 
              className="absolute bg-transparent pointer-events-none"
              style={{
                top: `${cutoutTop}px`,
                left: '0',
                width: '100%',
                height: `${cutoutHeight}px`,
                borderRadius: '8px',
                boxShadow: `0 0 0 9999px rgba(0,0,0,0)`,
              }}
            />
          </div>

          {/* Kachel - unten fixiert mit 24px Abstand links, rechts und unten */}
          <div className="fixed left-[24px] right-[24px] pointer-events-auto z-[100]" style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
            <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-0">
              <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left">
                Mia Steiner hat Ihnen eine Diensttausch-Anfrage gesendet. Bitte <span className="font-bold">gleichen</span> Sie diese zuerst mit Ihrem <span className="font-bold">Dienstplan</span> <span className="font-bold">ab</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
