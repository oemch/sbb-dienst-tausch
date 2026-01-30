"use client";

import { useState, useEffect } from "react";

interface WochenkalenderOverlayProps {
  onClose?: () => void;
}

export default function WochenkalenderOverlay({ onClose }: WochenkalenderOverlayProps) {
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

  // Berechne die Position der Aussparung
  // Beginnt 3px weiter oben als vorher, dann +3px nach unten
  // Header (48px) + Line (4px) + Tabs (48px) + Calendar (40px) + Content Padding Top (12px) + MO 06 Kachel (~100px) + Gap (12px) - 8px - 3px + 3px
  const cutoutTop = 48 + 4 + 48 + 40 + 12 + 100 + 12 - 8 - 3 + 3; // 256px
  // Höhe: 236px + 12px + 12px + 12px - 3px
  const cutoutHeight = 236 + 12 + 12 + 12 - 3; // 269px

  return (
    <div className={`absolute inset-0 z-[200] w-full h-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Hintergrund mit Aussparung */}
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

      {/* Kachel - unten fixiert mit 24px Abstand links, rechts und unten (identisch zu anderen Overlays) */}
      <div
        className={`fixed left-[24px] right-[24px] pointer-events-auto z-[200] transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="bg-[#FDC3EE] border-2 border-black rounded-[8px] p-[16px] flex flex-col gap-0">
          <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left">
            Anzeige des vorgeschlagenen Tausches im Dienstplan. <span className="font-bold">Nehmen Sie nun die Anfrage an oder lehnen Sie sie ab.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
