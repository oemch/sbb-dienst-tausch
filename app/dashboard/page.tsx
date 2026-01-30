"use client";

import Image from "next/image";
import Link from "next/link";
import DashboardOverlay from "../components/DashboardOverlay";

export default function DashboardPage() {
  return (
    <div className="bg-white flex flex-col items-start min-h-screen w-full relative">
      {/* Header Toolbar */}
      <div className="flex flex-col items-start relative shrink-0 w-full">
        {/* Base Header - Status Bar entfernt */}
        <div className="bg-white flex flex-col items-start justify-center overflow-clip relative shrink-0 w-full">
          {/* Header */}
          <div className="flex h-[48px] items-center justify-center px-[24px] relative shrink-0 w-full">
            <div className="flex flex-1 flex-col items-start justify-center min-h-px min-w-px relative">
              <p className="font-normal leading-normal relative shrink-0 text-[#100c08] text-[12px]">
                ZESAM
              </p>
              <p className="font-bold leading-normal relative shrink-0 text-[#100c08] text-[16px] -mt-1">
                Mitarbeiterportal
              </p>
            </div>
            <div className="flex gap-[24px] items-center relative shrink-0">
              {/* E-Mail Icon */}
              <div className="relative shrink-0 size-[24px] ml-[12px]">
                <Image
                  src="/images/icon-email.svg"
                  alt="E-Mail"
                  width={25}
                  height={19}
                  className="w-full h-full"
                />
              </div>
              {/* User Profile Pic */}
              <div className="relative shrink-0 size-[33px] rounded-full bg-gray-200 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                      fill="#666"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Separator */}
        <div className="bg-[#e7e6e5] h-[4px] shrink-0 w-full" />
      </div>

      {/* Content */}
      <div className="bg-[#f6f5f5] flex flex-col items-start justify-between pb-[24px] pt-[24px] px-[24px] relative shrink-0 w-full flex-1">
        {/* Top Content */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col gap-[8px] items-start pb-[16px] relative w-full">
            {/* Days */}
            <div className="h-[40px] relative shrink-0 w-full">
              <p className="absolute font-normal leading-normal left-0 text-[22px] text-black top-0">
                Montag, 30.03.2026
              </p>
              {/* More Menu - ganz rechts mit padding */}
              <div className="absolute right-0 size-[24px] top-0 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                    fill="#100c08"
                  />
                </svg>
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {/* Dienst tauschen Card – verlinkt zur dienst-tausch Page (bei Overlay 2 muss User hier klicken) */}
              <Link href="/dienst-tausch" className="block shrink-0 w-full">
                <div className="bg-[#f7d526] flex flex-col h-[87px] items-start overflow-clip pb-[20px] pl-[16px] pt-[8px] relative rounded-[8px] w-full cursor-pointer" style={{ boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)' }}>
                <div className="flex h-[61px] items-start pr-[12px] relative shrink-0 w-full">
                  <div className="flex flex-1 items-center min-h-px min-w-px pt-[12px] relative">
                    <div className="flex flex-1 gap-[12px] items-center justify-center min-h-px min-w-px relative">
                      <div className="flex flex-row items-center self-stretch">
                        <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                          <div className="bg-white flex flex-col items-center justify-center overflow-clip relative rounded-[32px] shrink-0 size-[40px]">
                            {/* Tausch Icon */}
                            <Image
                              src="/images/icon-tausch.svg"
                              alt="Tausch"
                              width={16}
                              height={16}
                              className="w-4 h-4"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col items-start justify-center min-h-px min-w-px relative">
                        <p className="font-bold leading-[1.4] min-w-full not-italic relative shrink-0 text-[#100c08] text-[16px]">
                          Dienst tauschen
                        </p>
                        <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                          1 Anfrage an mich
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center relative shrink-0 size-[12px]" />
                </div>
              </div>
              </Link>

              {/* Spätschicht Card */}
              <div className="bg-white flex flex-col gap-[8px] items-start overflow-clip pb-[20px] pl-[16px] pt-[8px] relative rounded-[8px] shrink-0 w-full" style={{ boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)' }}>
                <div className="flex items-start pr-[12px] relative shrink-0 w-full">
                  <div className="flex flex-1 items-center min-h-px min-w-px pt-[12px] relative">
                    <div className="flex flex-1 gap-[12px] items-center justify-center min-h-px min-w-px relative">
                      <div className="flex flex-row items-center self-stretch">
                        <div className="flex h-full items-start justify-center overflow-clip pt-[3px] relative shrink-0">
                          {/* Spätschicht Icon - bereits mit Hintergrund */}
                          <Image
                            src="/images/icon-spaetschicht.svg"
                            alt="Spätschicht"
                            width={40}
                            height={40}
                            className="size-[40px]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col items-start justify-center min-h-px min-w-px relative">
                        <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px]">
                          14:00 - 22:00
                        </p>
                        <div className="flex gap-[4px] items-center justify-center relative shrink-0 w-full">
                          <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[16px]">
                            Spätschicht
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center relative shrink-0 size-[12px]" />
                  <div className="flex items-center justify-end pl-[8px] py-[8px] relative shrink-0 size-[48px]">
                    <div className="flex items-center justify-center relative shrink-0 size-[24px]">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="rotate-90"
                      >
                        <path
                          d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                          fill="#100c08"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-[8px] items-start pl-[8px] pr-[24px] relative shrink-0 w-full">
                  <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[13px]">
                    Dauer: 8:00 h
                  </p>
                  <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[13px]">
                    Pause: 0:20 h
                  </p>
                </div>
              </div>

              {/* Menu Cards - 50:50 mit 8px Abstand */}
              <div className="flex items-start gap-[8px] relative shrink-0 w-full">
                {/* Einsatzplanung Card */}
                <div className="bg-white flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] self-stretch shrink-0 flex-1" style={{ boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)' }}>
                  <Image
                    src="/images/icon-calendar.svg"
                    alt="Kalender"
                    width={24}
                    height={24}
                    className="relative shrink-0"
                  />
                  <p className="font-bold leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[16px]">
                    Einsatzplanung
                  </p>
                </div>

                {/* Ferien und Absenzen Card */}
                <div className="bg-white flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 flex-1" style={{ boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)' }}>
                  <Image
                    src="/images/icon-ferien.svg"
                    alt="Ferien"
                    width={24}
                    height={24}
                    className="relative shrink-0"
                  />
                  <p className="font-bold leading-[1.4] min-w-full not-italic relative shrink-0 text-[#100c08] text-[16px]">
                    Ferien und Absenzen
                  </p>
                </div>
              </div>

              {/* Feriensaldo Card */}
              <div className="bg-white flex flex-col gap-[16px] items-start overflow-clip px-[20px] py-[18px] relative rounded-[8px] shrink-0 w-full" style={{ boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)' }}>
                <p className="font-bold leading-normal not-italic relative shrink-0 text-[#100c08] text-[16px] w-full">
                  Feriensaldo
                </p>
                <div className="flex gap-[8px] items-center relative shrink-0 w-full">
                  {/* Verfügbar: 18 Tage - proportional länger (18/31 = ~58% der Gesamtbreite) */}
                  <div className="bg-[#8bc34a] flex items-center justify-end overflow-clip px-[6px] py-[4px] relative rounded-[4px] shrink-0" style={{ width: 'calc((100% - 16px) * 18 / 31)' }}>
                    <p className="font-bold leading-normal not-italic relative shrink-0 text-[14px] text-black">
                      18
                    </p>
                  </div>
                  {/* Beantragt: 5 Tage */}
                  <div className="bg-[#cfcbc7] flex items-center justify-end overflow-clip px-[11px] py-[4px] relative rounded-[4px] shrink-0" style={{ width: 'calc((100% - 16px) * 5 / 31)' }}>
                    <p className="font-bold leading-normal not-italic relative shrink-0 text-[14px] text-black">
                      5
                    </p>
                  </div>
                  {/* Bezogen: 8 Tage */}
                  <div className="bg-white border border-[#cfcbc7] border-solid flex flex-1 items-center justify-end min-h-px min-w-px overflow-clip px-[8px] py-[4px] relative rounded-[4px]" style={{ width: 'calc((100% - 16px) * 8 / 31)' }}>
                    <p className="font-bold leading-normal not-italic relative shrink-0 text-[14px] text-black">
                      8
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between relative shrink-0 w-full">
                  <div className="flex gap-[8px] items-center relative shrink-0">
                    <div className="bg-[#8bc34a] h-[12px] rounded-[2px] shrink-0 w-[20px]" />
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[12px]">
                      Verfügbar
                    </p>
                  </div>
                  <div className="flex gap-[8px] items-center relative shrink-0">
                    <div className="bg-[#cfcbc7] h-[12px] rounded-[2px] shrink-0 w-[20px]" />
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[12px]">
                      Beantragt
                    </p>
                  </div>
                  <div className="flex gap-[8px] items-center relative shrink-0">
                    <div className="bg-white border border-[#cfcbc7] border-solid h-[12px] rounded-[2px] shrink-0 w-[20px]" />
                    <p className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[12px]">
                      Bezogen
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="relative shrink-0 w-full mt-auto">
          <div className="flex flex-col gap-[16px] items-start relative w-full">
            {/* Heading */}
            <div className="flex gap-[8px] items-center relative shrink-0 w-full">
              {/* Alert Icon */}
              <div className="overflow-clip relative shrink-0 size-[24px]">
                <Image
                  src="/images/icon-alert.svg"
                  alt="Alert"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </div>
              <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[16px]">
                Ereignisse
              </p>
            </div>

            {/* Event Cards */}
            <div className="flex gap-[8px] items-start relative shrink-0 w-full overflow-x-auto">
              {/* Achtung Card */}
              <div className="bg-white flex flex-col gap-[8px] items-start overflow-clip pb-[32px] pl-[20px] pr-[24px] pt-[24px] relative rounded-[12px] shrink-0 w-[273px] min-w-[273px]" style={{ boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)' }}>
                <div className="flex gap-[8px] items-center justify-center relative shrink-0 w-full">
                  <Image
                    src="/images/icon-warning.svg"
                    alt="Warning"
                    width={18}
                    height={18}
                    className="relative shrink-0"
                  />
                  <p className="flex-1 font-bold leading-[1.4] min-h-px min-w-px not-italic relative text-[#100c08] text-[14px]">
                    Achtung, Planungsänderung
                  </p>
                </div>
                <div className="font-normal leading-[1.4] not-italic relative shrink-0 text-[#100c08] text-[14px] w-full">
                  <p className="mb-0">Ihre Planung in der KW 52</p>
                  <p>wurde geändert.</p>
                </div>
              </div>

              {/* Ferien Card */}
              <div className="bg-white flex flex-col gap-[8px] items-start leading-[1.4] not-italic pb-[32px] pl-[20px] pr-[24px] pt-[24px] relative rounded-[12px] self-stretch shrink-0 text-[#100c08] text-[14px] w-[273px] min-w-[273px]" style={{ boxShadow: '2px 4px 6px 0px rgba(0,0,0,0.1), -2px -2px 6px 0px rgba(0,0,0,0.1)' }}>
                <p className="font-bold h-[20px] relative shrink-0 w-[225px]">
                  Ferien 2025 eintragen
                </p>
                <div className="font-normal relative shrink-0 w-full">
                  <p className="mb-0">Sie haben noch</p>
                  <p>10/30 Tage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <DashboardOverlay />
    </div>
  );
}
