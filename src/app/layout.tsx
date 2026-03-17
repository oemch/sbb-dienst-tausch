import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZESAM Dashboard",
  description: "ZESAM Dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" style={{ backgroundColor: "#d4d4d4" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0,0"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{
          maxWidth: "390px",
          marginLeft: "auto",
          marginRight: "auto",
          minHeight: "100vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
