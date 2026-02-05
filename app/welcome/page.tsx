"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] min-h-screen bg-[#5A012A] flex flex-col relative">
      {/* Text Content - oben, fester Bereich */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-start pt-6 px-[24px] pb-[24px] flex-shrink-0">
        {/* Übertitel + Titel – 3 Zeilen, Font skaliert mit Bildschirmgrösse */}
        <div className="flex flex-col items-start gap-[8px] mb-[16px]">
          <span
            className="font-bold text-white shrink-0"
            style={{ fontSize: 'clamp(0.875rem, 2.5vw + 0.75rem, 1.125rem)' }}
          >
            ZESAM-APP
          </span>
          <div
            className="flex flex-col items-start font-bold text-white leading-tight [&>span]:whitespace-nowrap"
            style={{ fontSize: 'clamp(1.25rem, 4vw + 1rem, 1.875rem)' }}
          >
            <span>Willkommen</span>
            <span>zum Test der</span>
            <span>Dienst-Tausch-Funktion</span>
          </div>
        </div>

        {/* Sub-headline */}
        <p className="text-[18px] text-white leading-relaxed">
          Der Test dauert nur 2 Minuten. Als Dankeschön erhalten Sie von uns einen Geschenk.
        </p>
      </div>

      {/* Bild – skaliert und flexibel über den ganzen Screen */}
      <div className="flex-1 relative w-full overflow-hidden">
        <Image
          src="/images/foto-welcome.jpg"
          alt="Willkommen"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Button – über dem Bild platziert, fixed am unteren Rand */}
      <div
        className="fixed left-0 right-0 w-full max-w-sm mx-auto px-[24px] z-10"
        style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full h-[48px] bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
        >
          Start
        </button>
      </div>
    </div>
  );
}
