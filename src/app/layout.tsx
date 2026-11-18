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
  preload: false,
});

const bengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400"],
  variable: "--font-bengali",
  display: "optional",
  preload: false,
});

/**
 * Search Console / Bing verification tokens are public strings, so they ride in
 * as build-time env vars from the Pages workflow rather than being committed.
 * When unset, no meta tag is emitted at all.
 */
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

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
  publisher: SITE_NAME,
  category: "technology",
  keywords: [
    "Kangkan Rajkhowa",
    "fullstack developer",
    "full stack developer Guwahati",
    "product engineer",
    "Guwahati",
    "Assam",
    "Laravel developer",
    "PHP developer Assam",
    "React developer",
    "PostgreSQL developer",
    "e-governance developer",
    "payment gateway integration",
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
        alt: "Kangkan Rajkhowa — Senior Fullstack Developer",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
        },
      }
    : {}),
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
  const origin = absoluteUrl("/");
  const personId = `${origin}#person`;
  const websiteId = `${origin}#website`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        givenName: profile.firstName,
        familyName: profile.lastName,
        jobTitle: "Senior Fullstack Developer",
        description: SITE_DESCRIPTION,
        url: origin,
        image: absoluteUrl("/og.png"),
        email: `mailto:${profile.email}`,
        telephone: profile.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Guwahati",
          addressRegion: "Assam",
          postalCode: "781003",
          addressCountry: "IN",
        },
        worksFor: {
          "@type": "Organization",
          name: profile.organisation,
          url: "https://www.nic.in/",
        },
        knowsAbout: [
          "Laravel",
          "PHP",
          "CodeIgniter",
          "React",
          "TypeScript",
          "PostgreSQL",
          "Oracle Database",
          "REST APIs",
          "Payment systems",
          "E-governance",
          "Flutter",
          "Design",
          "Large Language Models",
          "Retrieval Augmented Generation",
        ],
        knowsLanguage: ["English", "Assamese", "Hindi"],
        sameAs: socials.map((social) => social.href),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: origin,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${origin}#profile`,
        url: origin,
        name: SITE_TITLE,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <html
      lang="en-IN"
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
