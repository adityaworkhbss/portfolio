import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalBackground from "@/components/layout/GlobalBackground";
import { getAbout } from "@/lib/firebase/firestore";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-geist",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://adityasharma.dev"),
  title: {
    default: "Aditya Gupta — Mobile App Developer",
    template: "%s · Aditya Gupta",
  },
  description:
    "Independent software developer crafting fast, beautiful mobile and web experiences with React Native, Flutter and modern web tooling.",
  keywords: [
    "Aditya Gupta",
    "mobile developer",
    "React Native",
    "Flutter",
    "iOS",
    "Android",
    "Next.js",
    "full-stack",
    "portfolio",
  ],
  authors: [{ name: "Aditya Gupta" }],
  creator: "Aditya Gupta",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aditya Gupta",
    title: "Aditya Gupta — Mobile App Developer",
    description:
      "Independent software developer crafting fast, beautiful mobile and web experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Gupta — Mobile App Developer",
    description:
      "Independent software developer crafting fast, beautiful mobile and web experiences.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const about = await getAbout();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-screen relative">
        <GlobalBackground />
        <div className="relative">
          <Navbar />
          <main className="relative z-10 w-full">
            {children}
          </main>
          <Footer about={about} />
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0c0d0f",
              color: "#f5f5f4",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              fontSize: "13.5px",
              fontFamily: "var(--font-sans)",
              padding: "12px 14px",
            },
          }}
        />
      </body>
    </html>
  );
}
