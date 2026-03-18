"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Benutzer = {
  email: string;
  ziel: string;
};

const BENUTZER: Benutzer[] = [
  { email: "luca.meier@sbb.ch", ziel: "/sbb-dashboard-mia" },
  { email: "jonas.baumgartner@sbb.ch", ziel: "/sbb-dashboard" },
];

export default function LoginPage() {
  const router = useRouter();
  const [ausgewaehlter, setAusgewaehlter] = useState<Benutzer | null>(null);
  const [dropdownOffen, setDropdownOffen] = useState(false);

  const handleBenutzerWahl = (b: Benutzer) => {
    setAusgewaehlter(b);
    setDropdownOffen(false);
  };

  const handleAnmelden = () => {
    if (!ausgewaehlter) return;
    if (ausgewaehlter.email === "luca.meier@sbb.ch") {
      // Nur löschen wenn Mia das Ergebnis bereits gesehen hat (zweiter Login)
      if (localStorage.getItem("mia_result_acknowledged") === "true") {
        localStorage.removeItem("diensttausch_anfrage");
        localStorage.removeItem("mia_result_acknowledged");
      }
    }
    router.push(ausgewaehlter.ziel);
  };

  const handleEmailBlur = () => {
    setTimeout(() => setDropdownOffen(false), 150);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5f5]">

      {/* Header */}
      <header className="w-full bg-white">
        <div className="flex h-12 items-center px-6">
          <div className="flex flex-col">
            <span className="text-xs font-normal leading-normal text-[#100c08]">ZESAM</span>
            <span className="-mt-1 text-base font-bold leading-normal text-[#100c08]">Mitarbeiterportal</span>
          </div>
        </div>
        <div className="h-1 w-full bg-[#e7e6e5]" />
      </header>

      {/* Inhalt */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 gap-4">

        {/* Login-Formular */}
        <div className="w-full rounded-xl bg-white p-6 shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
          <h1 className="mb-6 text-xl font-bold text-[#100c08]">Anmelden</h1>

          <div className="flex flex-col gap-4">

            {/* E-Mail */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-normal text-[#100c08]">
                E-Mail oder Kürzel
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  readOnly
                  value={ausgewaehlter?.email ?? ""}
                  placeholder="E-Mail oder Kürzel"
                  onFocus={() => setDropdownOffen(true)}
                  onClick={() => setDropdownOffen(true)}
                  onBlur={handleEmailBlur}
                  aria-label="E-Mail oder Kürzel"
                  aria-expanded={dropdownOffen}
                  aria-haspopup="listbox"
                  className="w-full cursor-pointer rounded-lg border border-[#cfcbc7] bg-white px-4 py-3 text-base text-[#100c08] outline-none placeholder:text-[#cfcbc7] focus:border-[#174693] focus:ring-1 focus:ring-[#174693]"
                />
                {dropdownOffen && (
                  <ul
                    role="listbox"
                    aria-label="Benutzerliste"
                    className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-[#e7e6e5] bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)]"
                  >
                    {BENUTZER.map((b) => (
                      <li key={b.email} role="option" aria-selected={ausgewaehlter?.email === b.email}>
                        <button
                          onMouseDown={() => handleBenutzerWahl(b)}
                          className="flex w-full items-center px-4 py-3 text-left text-base text-[#100c08] hover:bg-[#f6f5f5] active:bg-[#efeeee]"
                        >
                          {b.email}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Passwort */}
            <div className="flex flex-col gap-1">
              <label htmlFor="passwort" className="text-sm font-normal text-[#100c08]">
                Passwort
              </label>
              <input
                id="passwort"
                type="password"
                readOnly
                value={ausgewaehlter ? "1234567890" : ""}
                placeholder="Passwort"
                aria-label="Passwort"
                className="w-full rounded-lg border border-[#cfcbc7] bg-white px-4 py-3 text-base text-[#100c08] outline-none placeholder:text-[#cfcbc7]"
              />
            </div>

            {/* Passwort vergessen */}
            <Link
              href="#"
              className="self-start text-sm font-normal text-[#174693] hover:underline"
            >
              Passwort vergessen?
            </Link>

            {/* Anmelden Button */}
            <button
              onClick={handleAnmelden}
              disabled={!ausgewaehlter}
              aria-label="Anmelden"
              className={`mt-2 h-12 w-full rounded-lg text-base font-bold transition-colors ${
                ausgewaehlter
                  ? "cursor-pointer bg-[#174693] text-white hover:bg-[#0f3270] active:bg-[#0d2a5e]"
                  : "cursor-not-allowed bg-[#e7e6e5] text-[#cfcbc7]"
              }`}
            >
              Anmelden
            </button>

          </div>
        </div>

        {/* Trennlinie */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-[#cfcbc7]" />
          <span className="text-sm font-normal text-[#55514d]">oder</span>
          <div className="h-px flex-1 bg-[#cfcbc7]" />
        </div>

        {/* Gesichtserkennung */}
        <div className="w-full rounded-xl bg-white px-6 py-5 shadow-[2px_4px_6px_0px_rgba(0,0,0,0.1),-2px_-2px_6px_0px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            {/* Tabler face-id Icon */}
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#174693" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
              <path d="M4 16v2a2 2 0 0 0 2 2h2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v2" />
              <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
              <path d="M9 10l.01 0" strokeWidth="2.5" />
              <path d="M15 10l.01 0" strokeWidth="2.5" />
              <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold text-[#100c08]">Mit Gesichtserkennung</p>
              <p className="text-xs font-normal text-[#55514d]">Sicher per Face ID anmelden</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center pb-8 pt-4">
        <Link
          href="#"
          className="text-sm font-normal text-[#174693] hover:underline"
          aria-label="Hilfe aufrufen"
        >
          Hilfe
        </Link>
      </footer>

    </div>
  );
}
