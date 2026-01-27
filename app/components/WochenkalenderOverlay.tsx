"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
  // Beginnt 3px weiter oben als vorher
  // Header (48px) + Line (4px) + Tabs (48px) + Calendar (40px) + Content Padding Top (12px) + MO 06 Kachel (~100px) + Gap (12px) - 8px - 3px
  const cutoutTop = 48 + 4 + 48 + 40 + 12 + 100 + 12 - 8 - 3; // 253px
  // Höhe: 236px
  const cutoutHeight = 236;

  return (
    <div className={`absolute inset-0 z-[200] w-full h-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Hintergrund mit Aussparung */}
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

      {/* Speech Bubble SVG - unten fixiert mit 24px Abstand, flexibel wie eine Kachel, auf oberster Ebene, fixed damit sie sich mit dem Browser-Fenster verschieben kann */}
      <div className={`fixed bottom-[24px] right-[24px] w-full max-w-[345px] pointer-events-auto z-[200] transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <Image
          src="/images/speech-bubble-overlay-5.svg"
          alt="Speech Bubble Overlay 5"
          width={345}
          height={194}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
