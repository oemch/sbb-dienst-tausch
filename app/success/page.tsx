"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="bg-[#5A012A] flex flex-col min-h-[100dvh] min-h-screen w-full overflow-hidden">
      {/* Content Container */}
      <div className="flex flex-col gap-[9px] items-center relative shrink-0 w-full mt-[48px] px-[24px] pb-[24px]">
        {/* Title Container */}
        <div className="flex flex-col gap-[21px] items-start not-italic relative shrink-0 text-white w-full">
          <p className="font-bold leading-tight relative shrink-0 text-[32px] w-full">
            Das ZESAM-Team dankt Ihnen herzlich für die Teilnahme.
          </p>
          <p className="font-normal leading-tight relative shrink-0 text-[20px] w-full">
            Holen Sie sich Ihren Kaffeebecher am Stand 999 ab. Wir freuen uns dort auch über Ihr Feedback zur getesteten App.
          </p>
        </div>
      </div>

      {/* Bild – skaliert und flexibel über den ganzen Screen */}
      <div className="flex-1 relative w-full overflow-hidden min-h-0">
        <Image
          src="/images/isolierbecher-01.jpg"
          alt="Kaffeebecher"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Weißer Hintergrund mit Link */}
      <div className="bg-white flex flex-col items-center justify-center py-[24px] relative shrink-0 w-full">
        <button
          onClick={() => router.push("/welcome")}
          className="flex h-[32px] items-center justify-center px-[12px] relative shrink-0 cursor-pointer"
        >
          <span className="font-normal leading-[1.4] not-italic relative shrink-0 text-black text-[14px] text-center">
            Zurück zum Anfang
          </span>
        </button>
      </div>
    </div>
  );
}
