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
      formData.email.includes("@") &&
      formData.firma.trim() !== ""
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
    <div className="bg-[#f3f2f2] flex flex-col gap-[48px] items-center pb-[72px] px-[24px] pt-0 min-h-screen w-full relative">
      {/* Content Container */}
      <div className="flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full mt-[48px]">
        {/* Title Container */}
        <div className="flex flex-col gap-[21px] items-start not-italic relative shrink-0 text-black w-full">
          <p className="font-bold leading-tight relative shrink-0 text-[34px] w-full">
            Sie haben Mias Anfrage abgelehnt.
          </p>
          <div className="font-normal leading-[0] relative shrink-0 text-[18px] w-full">
            <p className="leading-normal mb-0">Kein Problem – ein Diensttausch ist jederzeit möglich.</p>
            <p className="leading-normal mb-0">&nbsp;</p>
            <p>
              <span className="leading-normal">
                Hat Ihnen die zesam-Demo gefallen?
                <br aria-hidden="true" />
                {`Gerne bleiben wir in Kontakt. Hinterlassen Sie Ihren Namen und Ihre E-Mail-Adresse und `}
              </span>
              <span className="font-bold leading-normal not-italic">holen Sie sich [einen Becher Popcorn] ab.</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white flex flex-col gap-[4px] items-start overflow-clip p-[12px] relative rounded-[8px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
          {/* Vorname */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[18px] text-[#55514d] w-full">
              <p className="leading-[1.4]">Vorname *</p>
            </div>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[18px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[18px] text-[#55514d] w-full">
              <p className="leading-[1.4]">Name *</p>
            </div>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[18px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>

          {/* E-Mail Adresse */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[18px] text-[#55514d] w-full">
              <p className="leading-[1.4]">E-Mail Adresse *</p>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[18px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>

          {/* Firma */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[18px] text-[#55514d] w-full">
              <p className="leading-[1.4]">Firma *</p>
            </div>
            <input
              type="text"
              value={formData.firma}
              onChange={(e) => handleInputChange("firma", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[18px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`flex h-[48px] items-center justify-center min-h-[32px] min-w-[112px] px-[24px] relative rounded-[8px] shrink-0 w-full font-bold leading-[1.4] not-italic text-[18px] text-center text-white ${
            isFormValid()
              ? "bg-[#100c08] hover:bg-[#2a2a2a] cursor-pointer"
              : "bg-[#b5b1ad] cursor-not-allowed"
          }`}
        >
          Geschenk abholen
        </button>
      </div>

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
