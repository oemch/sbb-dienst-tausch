import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#5A012A",
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
