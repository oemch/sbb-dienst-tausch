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
  // Beginnt 8px weiter oben als vor "Mia Steiner fragt an für..." = Header (48px) + Line (4px) + Tabs (48px) + Calendar (40px) + Content Padding Top (12px) - 8px
  const cutoutTop = 48 + 4 + 48 + 40 + 12 - 8; // 144px
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
  const cutoutHeight = requestHeaderHeight + gap1 + terminCardHeight + gap2 + linkHeight; // 366px

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
          <div className="absolute bg-[rgba(0,0,0,0.2)] h-full left-0 overflow-clip top-0 w-full">
            {/* Speech Bubble SVG - unten fixiert mit 24px Abstand, flexibel wie eine Kachel */}
            <div className="absolute bottom-[24px] right-[24px] w-full max-w-[345px]">
              <Image
                src="/images/speech-bubble-overlay-3.svg"
                alt="Speech Bubble Overlay 3"
                width={345}
                height={194}
                className="w-full h-auto"
              />
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
              className="absolute bg-transparent"
              style={{
                top: `${cutoutTop}px`,
                left: '0',
                width: '100%',
                height: `${cutoutHeight}px`,
                borderRadius: '8px',
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.2)`,
              }}
            />
          </div>

          {/* Speech Bubble SVG - unten fixiert mit 24px Abstand, flexibel wie eine Kachel, auf oberster Ebene */}
          <div className="absolute bottom-[24px] right-[24px] w-full max-w-[345px] pointer-events-auto">
            <Image
              src="/images/speech-bubble-overlay-4.svg"
              alt="Speech Bubble Overlay 4"
              width={345}
              height={194}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
