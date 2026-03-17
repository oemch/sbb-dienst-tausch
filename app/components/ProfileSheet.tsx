"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, LogOut } from "lucide-react";

export default function ProfileSheet() {
  const [offen, setOffen] = useState(false);
  const router = useRouter();

  const handleAbmelden = () => {
    setOffen(false);
    router.push("/login");
  };

  return (
    <>
      {/* Avatar-Button */}
      <button
        onClick={() => setOffen(true)}
        aria-label="Profil öffnen"
        className="relative size-[33px] shrink-0 overflow-hidden rounded-full bg-gray-200"
      >
        <div className="flex h-full w-full items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#666" />
          </svg>
        </div>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          offen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOffen(false)}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[390px] rounded-t-2xl bg-white transition-transform duration-300 ease-out ${
          offen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Profil"
      >
        {/* Griff */}
        <div className="flex justify-center pb-4 pt-3">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Titel */}
        <p className="px-6 pb-3 text-base font-bold text-[#100c08]">Profil</p>

        <div className="h-px bg-[#e7e6e5]" />

        {/* Bearbeiten */}
        <button
          onClick={() => setOffen(false)}
          aria-label="Profil bearbeiten"
          className="flex w-full items-center gap-3 px-6 py-4 text-left text-[#100c08] hover:bg-[#f6f5f5] active:bg-[#efeeee]"
        >
          <Pencil size={18} strokeWidth={1.75} />
          <span className="text-base">Bearbeiten</span>
        </button>

        <div className="h-px bg-[#e7e6e5]" />

        {/* Abmelden */}
        <button
          onClick={handleAbmelden}
          aria-label="Abmelden"
          className="flex w-full items-center gap-3 px-6 py-4 text-left text-[#100c08] hover:bg-[#f6f5f5] active:bg-[#efeeee]"
        >
          <LogOut size={18} strokeWidth={1.75} />
          <span className="text-base">Abmelden</span>
        </button>

        {/* Safe-Area-Abstand */}
        <div className="h-6" />
      </div>
    </>
  );
}
