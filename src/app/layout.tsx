import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google"; // Using generic fonts if user didn't specify, but I'll use Outfit as planned for 'premium' look
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Quiz Vision Agent",
  description: "High-speed AI Quiz Solver",
  manifest: "/manifest.ts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans bg-black text-white antialiased overflow-hidden overscroll-none`}>
        {children}
      </body>
    </html>
  );
}
