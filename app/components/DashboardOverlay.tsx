"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DashboardOverlayProps {
  onClose?: () => void;
}

export default function DashboardOverlay({ onClose }: DashboardOverlayProps) {
  const router = useRouter();
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
    } else {
      // Bei Overlay 2: Navigiere zur Dienst tauschen Seite
      router.push("/dienst-tausch");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute inset-0 z-50 w-full h-full cursor-pointer transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      type="button"
    >
      {/* Overlay 1 */}
      {overlayState === 1 && (
        <div className="absolute bg-[rgba(0,0,0,0.2)] h-full left-0 overflow-clip top-0 w-full">
          {/* Speech Bubble SVG - unten fixiert mit 24px Abstand, flexibel wie eine Kachel */}
          <div className="absolute bottom-[24px] right-[24px] w-full max-w-[345px]">
            <Image
              src="/images/speech-bubble-overlay-1.svg"
              alt="Speech Bubble Overlay 1"
              width={345}
              height={194}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Overlay 2 */}
      {overlayState === 2 && (
        <div className="absolute h-full left-0 top-0 w-full">
          {/* Subtract/Mask für Ausschnitt - hier wird die "Dienst tauschen" Kachel ausgespart */}
          <div className="absolute h-full left-0 top-0 w-full pointer-events-none">
            {/* Vollständiger Hintergrund mit Aussparung - verwendet einen transparenten Bereich mit großem Schatten für abgerundete Ecken */}
            <div 
              className="absolute bg-transparent"
              style={{
                top: '124px',
                left: '24px',
                width: 'calc(100% - 48px)',
                height: '87px',
                borderRadius: '8px',
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.2)`,
              }}
            />
          </div>

          {/* Speech Bubble SVG - unten fixiert mit 24px Abstand, flexibel wie eine Kachel */}
          <div className="absolute bottom-[24px] right-[24px] w-full max-w-[345px] z-10">
            <Image
              src="/images/speech-bubble-overlay-2.svg"
              alt="Speech Bubble Overlay 2"
              width={345}
              height={194}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </button>
  );
}
