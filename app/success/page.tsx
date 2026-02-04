"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();

  // Validierung: Prüfen ob der User den Test durchgeführt hat
  useEffect(() => {
    const successToken = sessionStorage.getItem("success-token");
    
    // Wenn kein Token vorhanden ist, zur WelcomePage weiterleiten
    if (!successToken) {
      router.replace("/welcome");
      return;
    }
    
    // Token nach Anzeige entfernen (optional, für einmaligen Zugriff)
    // sessionStorage.removeItem("success-token");
  }, [router]);

  // Zoom zurücksetzen beim Laden der Seite
  useEffect(() => {
    // Viewport-Meta-Tag zurücksetzen, um Zoom-Status von vorherigen Seiten zu löschen
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      // Temporär entfernen und neu setzen, um Browser-Cache zu umgehen
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
      
      // Kurz warten und erneut setzen, um sicherzustellen, dass es angewendet wird
      setTimeout(() => {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
      }, 100);
    }
  }, []);

  return (
    <div className="h-[100dvh] bg-[#5A012A] flex flex-col relative overflow-hidden">
      {/* Text Content - oben, fester Bereich */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-start pt-[24px] px-[24px] pb-[24px] flex-shrink-0">
        {/* Titel – 3 Zeilen, Font skaliert mit Bildschirmgrösse */}
        <div className="flex flex-col items-start gap-[8px] mb-[16px]">
          <div
            className="flex flex-col items-start font-bold text-white leading-tight [&>span]:whitespace-nowrap"
            style={{ fontSize: 'clamp(1.25rem, 4vw + 1rem, 1.875rem)' }}
          >
            <span>Das ZESAM-Team</span>
            <span>dankt Ihnen herzlich</span>
            <span>für die Teilnahme</span>
          </div>
        </div>

        {/* Sub-headline */}
        <p className="text-[18px] text-white leading-relaxed">
          Holen Sie sich Ihren Kaffeebecher am <span className="font-bold">Stand F61</span> in Halle 5 ab. Wir freuen uns dort auch über Ihr Feedback zur getesteten App.
        </p>
      </div>

      {/* Bild – skaliert und flexibel über den ganzen Screen */}
      <div className="flex-1 relative w-full min-h-0 flex items-center justify-center bg-white" style={{ flex: '1 1 auto', overflow: 'visible' }}>
        <Image
          src="/images/isolierbecher-01.jpg"
          alt="Kaffeebecher"
          fill
          className="object-contain"
          priority
          sizes="100vw"
          style={{ 
            objectFit: 'contain', 
            objectPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>

      {/* Weißer Hintergrund mit Link - unten, fester Bereich */}
      <div className="bg-white flex flex-col items-center justify-center py-[24px] flex-shrink-0 w-full">
        <button
          onClick={() => router.push("/welcome")}
          className="flex h-[32px] items-center justify-center px-[12px] cursor-pointer"
        >
          <span className="font-normal leading-[1.4] text-black text-[14px] text-center">
            Zurück zum Anfang
          </span>
        </button>
      </div>
    </div>
  );
}
