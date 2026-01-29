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
    <div className="bg-[#f3f2f2] flex flex-col gap-[48px] items-center pb-[104px] px-[24px] pt-0 min-h-screen w-full relative">
      {/* Content Container */}
      <div className="flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full mt-[48px]">
        {/* Title Container */}
        <div className="flex flex-col gap-[21px] items-start not-italic relative shrink-0 text-black w-full">
          <p className="font-bold leading-tight relative shrink-0 text-[32px] w-full">
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
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-[#55514d] w-full">
              <p className="leading-[1.4]">Vorname *</p>
            </div>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[14px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-[#55514d] w-full">
              <p className="leading-[1.4]">Name *</p>
            </div>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[14px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>

          {/* E-Mail Adresse */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-[#55514d] w-full">
              <p className="leading-[1.4]">E-Mail Adresse *</p>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[14px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>

          {/* Firma */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-[#55514d] w-full">
              <p className="leading-[1.4]">Firma *</p>
            </div>
            <input
              type="text"
              value={formData.firma}
              onChange={(e) => handleInputChange("firma", e.target.value)}
              className="bg-white border-[1.5px] border-[#b5b1ad] border-solid flex gap-[8px] h-[32px] items-center justify-end max-h-[32px] pl-[8px] pr-[8px] relative rounded-[4px] shrink-0 w-full text-[14px] text-[#100c08] focus:outline-none focus:border-[#100c08]"
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Button - Fixed 32px vom unteren Rand */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid()}
        className={`fixed bottom-[32px] left-[24px] right-[24px] flex h-[48px] items-center justify-center min-h-[32px] min-w-[112px] px-[24px] rounded-[8px] font-bold leading-[1.4] not-italic text-[14px] text-center text-white ${
          isFormValid()
            ? "bg-[#100c08] hover:bg-[#2a2a2a] cursor-pointer"
            : "bg-[#b5b1ad] cursor-not-allowed"
        }`}
      >
        Geschenk abholen
      </button>
    </div>
  );
}
