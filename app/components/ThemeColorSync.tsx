"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const VIOLET_PAGES = ["/welcome", "/request-approved", "/request-denied", "/success"];
const THEME_VIOLET = "#5A012A";
const THEME_LIGHT = "#f3f2f2";

export default function ThemeColorSync() {
  const pathname = usePathname();

  useEffect(() => {
    const themeColor = VIOLET_PAGES.some((p) => pathname?.startsWith(p))
      ? THEME_VIOLET
      : THEME_LIGHT;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", themeColor);
    } else {
      const el = document.createElement("meta");
      el.name = "theme-color";
      el.content = themeColor;
      document.head.appendChild(el);
    }
  }, [pathname]);

  return null;
}
