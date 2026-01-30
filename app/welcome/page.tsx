"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-[#5A012A] flex flex-col pt-12 overflow-hidden relative" style={{ paddingBottom: '96px' }}>
      {/* Status Bar Simulation - wird auf echten Geräten automatisch angezeigt */}
      <div className="w-full max-w-sm mx-auto flex flex-col h-full min-h-0 px-[24px]">
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

        {/* Bild - randabfallend, flexibel skalierend, mit 24px Abstand oben */}
        <div className="flex-grow flex flex-col items-center justify-center min-h-0 overflow-hidden mt-6">
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

      {/* Button - fixed am unteren Rand mit 24px Abstand */}
      <div className="fixed bottom-[24px] left-0 right-0 w-full max-w-sm mx-auto px-[24px] z-10">
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
