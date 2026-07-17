"use client";

import { useRouter } from "next/navigation";

export default function TauschAngenommenPage() {
  const router = useRouter();

  return (
    <div className="bg-[#f3f2f2] flex flex-col min-h-screen w-full">

      {/* Header – gleich wie Anfrage-Bestätigung */}
      <div className="bg-white sticky top-0 z-[550] flex items-center justify-center h-[48px] px-[24px] shadow-[0_1px_0_0_#e7e6e5]">
        <p className="font-bold text-[17px] text-[#100c08]">Dienst tauschen</p>
      </div>

      {/* Content */}
      <div className="px-6 pt-[24px] pb-[120px]">
        <div className="bg-white rounded-[12px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center gap-[16px] px-[16px] py-[24px]">
          <div className="flex items-center justify-center size-[36px] rounded-full bg-[#e8f5e9]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-[16px] font-normal text-black leading-[1.5] text-center">
            Du hast den Tausch angenommen. Die neue Schicht wird automatisch im Dienstplan eingetragen und die/der Vorgesetzte informiert.
          </p>
        </div>
      </div>

      {/* Fixierter Button – nur Dashboard */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[390px] px-6 pb-[32px] pt-[12px] bg-[#f3f2f2] flex flex-col gap-[10px]">
        <button
          onClick={() => router.push("/demo-dashboard")}
          className="w-full h-[40px] rounded-[12px] border border-[#100c08] text-[#100c08] font-bold text-[15px] bg-transparent cursor-pointer hover:bg-[#f0efee] transition-colors"
        >
          Dashboard
        </button>
      </div>

    </div>
  );
}
