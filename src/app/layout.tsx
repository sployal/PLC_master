import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLC Master - Learn TIA Portal & Siemens Programming",
  description: "Transform your engineering career with comprehensive PLC programming tutorials, hands-on projects, and real-world applications. Master Siemens TIA Portal from industry experts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}