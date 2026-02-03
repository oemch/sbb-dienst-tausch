"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY = "request-denied-form";

const INITIAL_FORM = { first_name: "", last_name: "", email: "", firma: "" };

// E-Mail-Validierung
const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === "") {
    return "Bitte ausfüllen";
  }
  
  const trimmedEmail = email.trim();
  
  // Grundlegende Format-Prüfung
  if (!trimmedEmail.includes("@")) {
    return "E-Mail-Adresse muss ein @-Zeichen enthalten";
  }
  
  const parts = trimmedEmail.split("@");
  if (parts.length !== 2) {
    return "Ungültiges E-Mail-Format";
  }
  
  const [localPart, domain] = parts;
  
  // Lokaler Teil (vor @)
  if (!localPart || localPart.length === 0) {
    return "E-Mail-Adresse muss einen Teil vor dem @-Zeichen haben";
  }
  
  if (localPart.length > 64) {
    return "Der Teil vor dem @-Zeichen ist zu lang (max. 64 Zeichen)";
  }
  
  // Domain-Teil (nach @)
  if (!domain || domain.length === 0) {
    return "Ungültiges E-Mail-Format";
  }
  
  if (domain.length > 255) {
    return "Ungültiges E-Mail-Format";
  }
  
  // Domain muss einen Punkt enthalten
  if (!domain.includes(".")) {
    return "Ungültiges E-Mail-Format";
  }
  
  // Domain darf nicht mit Punkt beginnen oder enden
  if (domain.startsWith(".") || domain.endsWith(".")) {
    return "Ungültiges E-Mail-Format";
  }
  
  // Einfache Regex für gültiges E-Mail-Format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return "Ungültiges E-Mail-Format (z.B. name@example.com)";
  }
  
  return null; // Keine Fehler
};

export default function RequestDeniedPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<{ first_name?: string; last_name?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ first_name?: boolean; last_name?: boolean; email?: boolean }>({});
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

  const validateField = (field: keyof typeof formData, value: string): string | null => {
    if (field === "first_name") {
      if (!value || value.trim() === "") {
        return "Bitte ausfüllen";
      }
      return null;
    }
    if (field === "last_name") {
      if (!value || value.trim() === "") {
        return "Bitte ausfüllen";
      }
      return null;
    }
    if (field === "email") {
      return validateEmail(value);
    }
    return null;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [field]: value,
    }));
    
    // Validierung für alle Felder
    if (field === "first_name" || field === "last_name" || field === "email") {
      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: error || undefined,
        }));
      }
    }
  };
  
  const handleFieldBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error || undefined,
    }));
  };

  const isFormValid = () => {
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.email.trim() !== "" &&
      validateEmail(formData.email) === null
    );
  };

  const handleSubmit = async () => {
    // Alle Felder als touched markieren und validieren
    const fieldsToValidate: Array<"first_name" | "last_name" | "email"> = ["first_name", "last_name", "email"];
    const newTouched: typeof touched = {};
    const newErrors: typeof errors = {};
    
    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    
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
              <span className="font-bold leading-normal not-italic">holen Sie sich Ihren Kaffeebecher ab.</span>
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
              autoComplete="given-name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              onBlur={() => handleFieldBlur("first_name")}
              className={`border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px] ${
                touched.first_name && errors.first_name ? "border-2 border-red-500" : ""
              }`}
              style={{ backgroundColor: '#CFCBC7' }}
              placeholder=""
            />
            {touched.first_name && errors.first_name && (
              <p className="text-white text-[12px] mt-[4px] leading-[1.4]">
                {errors.first_name}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
              <p className="leading-[1.4]">Name *</p>
            </div>
            <input
              type="text"
              autoComplete="family-name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              onBlur={() => handleFieldBlur("last_name")}
              className={`border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px] ${
                touched.last_name && errors.last_name ? "border-2 border-red-500" : ""
              }`}
              style={{ backgroundColor: '#CFCBC7' }}
              placeholder=""
            />
            {touched.last_name && errors.last_name && (
              <p className="text-white text-[12px] mt-[4px] leading-[1.4]">
                {errors.last_name}
              </p>
            )}
          </div>

          {/* E-Mail Adresse */}
          <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-bold h-[16px] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
              <p className="leading-[1.4]">E-Mail Adresse *</p>
            </div>
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={() => handleFieldBlur("email")}
              className={`border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px] ${
                touched.email && errors.email ? "border-2 border-red-500" : ""
              }`}
              style={{ backgroundColor: '#CFCBC7' }}
              placeholder=""
            />
            {touched.email && errors.email && (
              <p className="text-white text-[12px] mt-[4px] leading-[1.4]">
                {errors.email}
              </p>
            )}
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
              className="border-none outline-none flex h-[40px] items-center pl-[8px] pr-[8px] relative shrink-0 w-full text-[14px] text-[#100c08] rounded-[4px]"
              style={{ backgroundColor: '#CFCBC7' }}
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
