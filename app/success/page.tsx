"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="bg-[#5A012A] flex flex-col min-h-screen w-full">
      {/* Content Container */}
      <div className="flex flex-col gap-[9px] items-center relative shrink-0 w-full mt-[48px] px-[24px]">
        {/* Title Container */}
        <div className="flex flex-col gap-[21px] items-start not-italic relative shrink-0 text-white w-full">
          <p className="font-bold leading-tight relative shrink-0 text-[32px] w-full">
            Das ZESAM-Team dankt Ihnen herzlich für die Teilnahme.
          </p>
          <p className="font-bold leading-tight relative shrink-0 text-[20px] w-full">
            Holen Sie sich Ihren Isolierbecher ab.
          </p>
        </div>
      </div>

      {/* Illustration Container – flexibel, Bild skaliert mit */}
      <div className="flex flex-1 min-h-0 items-center justify-center w-full px-[24px] py-[23px]">
        <div className="relative w-full max-w-[234px] aspect-[234/401]">
          <Image
            src="/images/duck-popcorn.png"
            alt="Duck with Popcorn"
            fill
            className="object-contain"
            sizes="(max-width: 280px) 100vw, 234px"
            priority
          />
        </div>
      </div>

      {/* Zurück zum Anfang Link */}
      <button
        onClick={() => router.push("/welcome")}
        className="flex h-[32px] items-center justify-center px-[12px] relative shrink-0 cursor-pointer pb-[24px]"
      >
        <span className="font-normal leading-[1.4] not-italic relative shrink-0 text-white text-[14px] text-center">
          Zurück zum Anfang
        </span>
      </button>
    </div>
  );
}
