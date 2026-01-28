"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="bg-[#f3f2f2] flex flex-col gap-[23px] items-center relative min-h-screen w-full">
      {/* Content Container */}
      <div className="flex flex-col gap-[9px] items-center relative shrink-0 w-full mt-[48px] px-[24px]">
        {/* Title Container */}
        <div className="flex flex-col gap-[21px] items-start not-italic relative shrink-0 text-black w-full">
          <p className="font-bold leading-tight relative shrink-0 text-[34px] w-full">
            Herzlichen Dank für die Teilnahme.
          </p>
          <p className="font-bold leading-tight relative shrink-0 text-[26px] w-full">
            Holen Sie sich Ihren Becher Popcorn ab.
          </p>
        </div>
      </div>

      {/* Illustration Container - Weißer Hintergrund ohne Margin, volle Breite */}
      <div className="bg-white flex h-[515px] items-center justify-center relative shrink-0 w-full">
        <div className="h-[401px] relative shrink-0 w-full max-w-[234px]">
          <Image
            src="/images/duck-popcorn.png"
            alt="Duck with Popcorn"
            width={234}
            height={401}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>

      {/* Zurück zum Anfang Link */}
      <button
        onClick={() => router.push("/welcome")}
        className="flex gap-[8px] h-[32px] items-center justify-center px-[12px] relative shrink-0 cursor-pointer"
      >
        {/* Back Icon */}
        <div className="overflow-clip relative shrink-0 size-[16px]">
          <Image
            src="/images/icon-back.svg"
            alt="Zurück"
            width={16}
            height={16}
            className="w-full h-full"
          />
        </div>
        <div className="flex flex-col font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#100c08] text-[18px] text-center">
          <p className="leading-[1.4]">Zurück zum Anfang</p>
        </div>
      </button>

      {/* Footer - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e7e6e5] border-solid flex h-[48px] items-end justify-center pb-[12px] px-[24px]">
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
