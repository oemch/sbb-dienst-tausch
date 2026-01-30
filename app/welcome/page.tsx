"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] min-h-screen bg-[#5A012A] flex flex-col relative">
      {/* Scrollbarer Bereich – max-height endet oberhalb des Buttons, Bild erscheint nie unter dem Button */}
      <div
        className="w-full max-w-sm mx-auto flex flex-col flex-1 min-h-0 overflow-y-auto pt-12 px-[24px] pb-4"
        style={{ maxHeight: 'calc(100dvh - 96px - env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Text Content - oben, fester Bereich */}
        <div className="flex flex-col items-start gap-6 flex-shrink-0">
          {/* Headline */}
          <h1 className="text-3xl font-bold text-white leading-tight">
            Willkommen zum Test des Dienst-Tausch-Features in der ZESAM-App
          </h1>

          {/* Sub-headline */}
          <p className="text-[18px] text-white leading-relaxed">
            Der Test dauert nur 2 Minuten. Als Dankeschön erhalten Sie von uns einen Isolierbecher.
          </p>
        </div>

        {/* Bild – auf Mobile 12px Abstand, ab sm 24px */}
        <div className="flex-grow flex flex-col items-center justify-center min-h-0 overflow-hidden mt-3 sm:mt-[24px]">
          <div className="w-full flex items-center justify-center h-full">
            <Image
              src="/images/zesam-diensttausch.png"
              alt="ZESAM Diensttausch"
              width={800}
              height={600}
              className="object-contain"
              style={{ 
                maxHeight: '100%', 
                maxWidth: '100%',
                width: 'auto',
                height: 'auto'
              }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Button – fixer Rahmen 24px oberhalb (mit BG), fixed am unteren Rand, Safe Area für Mobil */}
      <div
        className="fixed left-0 right-0 w-full max-w-sm mx-auto px-[24px] pt-[24px] z-10 bg-[#5A012A]"
        style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full h-[48px] bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  );
}
