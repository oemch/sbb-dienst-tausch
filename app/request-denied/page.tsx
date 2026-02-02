"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY = "request-denied-form";

const INITIAL_FORM = { first_name: "", last_name: "", email: "", firma: "" };

export default function RequestDeniedPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const skipFirstSaveRef = useRef(true);

  // Nach Hydration: gespeicherte Daten aus sessionStorage laden
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {
        /* ungültiges JSON */
      }
    }
  }, []);

  // Bei jeder Änderung: Formulardaten in sessionStorage speichern (ersten Lauf überspringen, da Load noch nicht angewendet)
  useEffect(() => {
    if (skipFirstSaveRef.current) {
      skipFirstSaveRef.current = false;
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.email.includes("@")
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        sessionStorage.removeItem(STORAGE_KEY);
        router.push("/success");
      } else {
        const errorData = await response.json();
        console.error("Fehler beim Speichern der Daten:", errorData.error || "Unbekannter Fehler");
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Daten:", error);
    }
  };

  return (
    <div className="bg-[#5A012A] flex flex-col gap-[48px] items-center pb-[104px] px-[24px] pt-0 min-h-screen w-full relative">
      {/* Content Container */}
      <div className="flex flex-col items-start min-h-px min-w-px pb-[104px] relative w-full mt-[48px]">
        {/* Title Container */}
        <div className="flex flex-col gap-[21px] items-start not-italic relative shrink-0 text-white w-full">
          <p className="font-bold leading-tight relative shrink-0 text-[32px] w-full">
            Sie haben Mias Anfrage abgelehnt.
          </p>
          <div className="font-normal leading-[0] relative shrink-0 text-[18px] w-full">
            <p className="leading-normal mb-0">
              Kein Problem – ein Diensttausch ist jederzeit möglich.
              <br />
              <span className="leading-normal">Hinterlassen Sie Ihren Namen und Ihre E-Mail-Adresse und </span>
              <span className="font-bold leading-normal not-italic">holen Sie sich Ihren Isolierbecher ab.</span>
            </p>
          </div>
        </div>

        {/* Form – 24px Abstand unter Firma-Inputfeld */}
        <div className="mt-[24px] mb-[24px] flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* Vorname */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
              <p className="leading-[1.4]">Vorname *</p>
            </div>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              className="bg-white border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px]"
              placeholder=""
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
              <p className="leading-[1.4]">Name *</p>
            </div>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              className="bg-white border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px]"
              placeholder=""
            />
          </div>

          {/* E-Mail Adresse */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
              <p className="leading-[1.4]">E-Mail Adresse *</p>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-white border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px]"
              placeholder=""
            />
          </div>

          {/* Firma (optional) */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
              <p className="leading-[1.4]">Firma</p>
            </div>
            <input
              type="text"
              value={formData.firma}
              onChange={(e) => handleInputChange("firma", e.target.value)}
              className="bg-white border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px]"
              placeholder=""
            />
          </div>
        </div>

        {/* Link Angaben zum Datenschutz – rechtsbündig (24px Abstand durch Form mb-[24px]) */}
        <div className="w-full flex justify-end">
          <Link
            href="/datenschutz"
            className="font-normal text-[16px] text-white hover:underline"
          >
            Angaben zum Datenschutz
          </Link>
        </div>

        {/* Button Geschenk abholen */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`mt-[24px] flex h-[48px] min-h-[48px] w-full items-center justify-center rounded-[8px] font-bold leading-[1.4] not-italic text-[14px] text-center ${
            isFormValid()
              ? "bg-white text-black hover:bg-gray-100 cursor-pointer"
              : "bg-[#7a0140] text-white/90 cursor-not-allowed"
          }`}
        >
          Geschenk abholen
        </button>
      </div>
    </div>
  );
}
