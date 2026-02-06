"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface DashboardOverlayProps {
  overlayState: 1;
  setOverlayState: (state: 0 | 1) => void;
}

const SLIDE_TRANSITION = "transform 500ms ease-out";

export default function DashboardOverlay({ overlayState, setOverlayState }: DashboardOverlayProps) {
  const [kachel1Ready, setKachel1Ready] = useState(false);

  // Kachel 1: nach Erscheinen von links einfahren
  useEffect(() => {
    // Kurz warten, dann Animation starten (für Slide-in Effekt)
    const timer = setTimeout(() => {
      setKachel1Ready(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []); // Nur beim Mount

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In sessionStorage speichern, dass die Kachel geschlossen wurde
    sessionStorage.setItem("dashboard-overlay-closed", "true");
    setOverlayState(0);
  };

  return (
    <>
      {/* Kachel-Container – unten bündig, 24px Abstand */}
      <div
        className="fixed left-[24px] right-[24px] z-[510] pointer-events-auto"
        style={{
          bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          overflowX: "hidden",
          overflowY: "visible",
        }}
      >
        {/* Kachel 1 – Slide-in von links beim Erscheinen */}
        <div
          className="relative ease-out"
          style={{
            transform: kachel1Ready ? "translateX(0)" : "translateX(-100%)",
            opacity: 1,
            transition: SLIDE_TRANSITION,
            willChange: "transform",
            marginTop: "150px",
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
              <p className="font-bold leading-normal text-[#100c08] text-[18px] text-left pr-[28px]">
                Das ZESAM-Dashboard
              </p>
              <p className="font-normal leading-normal text-[#100c08] text-[18px] text-left pr-[28px]">
                Hier sehen Mitarbeitende ihre Einsätze und Ferien und können Dienste direkt tauschen. <span className="font-bold">Prüfen Sie die Diensttausch-Anfrage.</span>
              </p>
            </div>
        </div>
      </div>
    </>
  );
}
