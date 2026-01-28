"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f3f2f2] flex flex-col px-[24px] pt-12">
      {/* Status Bar Simulation - wird auf echten Geräten automatisch angezeigt */}
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1 min-h-0">
        {/* Text Content - oben */}
        <div className="flex flex-col items-start gap-6">
          {/* Headline */}
          <h1 className="text-[32px] font-bold text-black leading-tight">
            Willkommen zum
            <br />
            Dienst-Tausch Feature
            <br />
            der zesam App
          </h1>

          {/* Sub-headline */}
          <p className="text-[18px] text-black leading-relaxed">
            Interessiert an einer einfachen Lösung zur Verwaltung von Schichten und Diensten?
          </p>
        </div>

        {/* Flexibler Abstand - begrenzt */}
        <div className="flex-grow min-h-0" style={{ maxHeight: '150px' }}></div>

        {/* Bottom Section - mit festem Abstand zum Footer */}
        <div className="w-full flex flex-col items-center pb-[96px]">
          {/* Illustration */}
          <div className="w-full flex justify-center mb-6">
            <Image
              src="/images/mascot-1.png"
              alt="Mascot Illustration"
              width={280}
              height={320}
              className="object-contain"
              priority
            />
          </div>

          {/* Start Button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-[48px] bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start
          </button>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e7e6e5] border-solid flex h-[48px] items-end justify-center pb-[12px] px-[24px] z-10">
        <div className="flex items-center gap-2 text-gray-400 text-[16px]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1C4.9 1 4 1.9 4 3V4H3C2.4 4 2 4.4 2 5V9C2 9.6 2.4 10 3 10H9C9.6 10 10 9.6 10 9V5C10 4.4 9.6 4 9 4H8V3C8 1.9 7.1 1 6 1ZM6 2C6.6 2 7 2.4 7 3V4H5V3C5 2.4 5.4 2 6 2ZM3 5H9V9H3V5Z"
              fill="currentColor"
            />
          </svg>
          <span>jazz mitarbeiterportal</span>
        </div>
      </div>
    </div>
  );
}
