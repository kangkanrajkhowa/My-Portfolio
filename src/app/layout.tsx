import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, Noto_Serif_Bengali } from "next/font/google";
import { Hydrate } from "@/components/shell/Hydrate";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
  asset,
} from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const bengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "600"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: "https://github.com/kangkanrajkhowa" }],
  creator: SITE_NAME,
  keywords: [
    "Kangkan Rajkhowa",
    "fullstack developer",
    "UI UX designer",
    "Guwahati",
    "Assam",
    "Laravel developer",
    "React developer",
    "AI developer",
    "portfolio",
  ],
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: asset("/og.png"),
        width: 1200,
        height: 630,
        alt: "Kangkan Rajkhowa — Fullstack Developer & UI/UX Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [asset("/og.png")],
    creator: "@kangkanrajkhowa",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090c" },
    { media: "(prefers-color-scheme: light)", color: "#f4f2ec" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var stored=localStorage.getItem('kr-theme');var theme=stored||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Fullstack Developer & UI/UX Designer",
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guwahati",
      addressRegion: "Assam",
      addressCountry: "IN",
    },
    worksFor: {
      "@type": "Organization",
      name: profile.organisation,
    },
    knowsAbout: [
      "Laravel",
      "PHP",
      "React",
      "TypeScript",
      "PostgreSQL",
      "UI/UX Design",
      "Large Language Models",
      "Retrieval Augmented Generation",
    ],
    sameAs: socials.map((social) => social.href),
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${instrument.variable} ${bengali.variable}`}
    >
      <body className="grain relative min-h-screen bg-bg text-fg">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Hydrate />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </body>
    </html>
  );
}
