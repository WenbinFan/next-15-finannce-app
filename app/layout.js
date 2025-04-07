import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import getServerTheme from "@/hooks/use-server-dark-mode";
import Providers from "@/components/providers";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | Finance App",
    default: "Finance App"
  },
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const theme = await getServerTheme()
  return (
    <html lang="en" className={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col px-8`}
      >
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
