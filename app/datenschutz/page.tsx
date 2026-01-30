"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DatenschutzPage() {
  const router = useRouter();

  return (
    <div className="bg-[#5A012A] flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="bg-[#5A012A] flex h-[48px] items-center px-[24px] relative shrink-0 w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center p-[8px] relative shrink-0 size-[40px]"
        >
          <div className="flex items-center justify-center relative shrink-0 size-[24px] invert">
            <Image
              src="/images/icon-pfeil-links.svg"
              alt="Zurück"
              width={24}
              height={24}
              className="w-full h-full"
            />
          </div>
        </button>
        <p className="flex-1 font-bold leading-normal min-h-px min-w-px text-white text-[16px] text-center">
          Angaben zum Datenschutz
        </p>
        <div className="shrink-0 size-[40px]" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[16px] items-start px-[24px] py-[24px] w-full">
        <p className="font-normal leading-[1.4] text-white text-[18px] w-full">
          Ihre Angaben werden ausschliesslich dazu verwendet, um Sie persönlich zu kontaktieren. Die Daten werden nicht an Dritte weitergegeben. Weitere Informationen zu unseren Datenschutzrichtlinien finden Sie auf unserer{" "}
          <a
            href="https://www.ergon.ch/de/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:no-underline"
          >
            Website
          </a>
          .
        </p>
      </div>
    </div>
  );
}
