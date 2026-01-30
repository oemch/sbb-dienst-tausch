"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestDeniedPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    firma: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
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
      <div className="flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full mt-[48px]">
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

        {/* Form – Absatz davor, keine Kachel, Inputs 40px hoch, keine Outline */}
        <div className="mt-[24px] flex flex-col gap-[8px] items-start relative shrink-0 w-full">
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

        {/* Button – 32px Abstand nach Firma-Inputfeld */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`mt-[32px] flex h-[48px] min-h-[48px] w-full items-center justify-center rounded-[8px] font-bold leading-[1.4] not-italic text-[14px] text-center ${
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
