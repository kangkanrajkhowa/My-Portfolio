export type Social = {
  label: string;
  handle: string;
  href: string;
  icon: "github" | "linkedin" | "twitter" | "instagram" | "facebook" | "youtube";
};

export const socials: Social[] = [
  {
    label: "GitHub",
    handle: "@kangkanrajkhowa",
    href: "https://www.github.com/kangkanrajkhowa/",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "in/kangkanrajkhowa",
    href: "https://www.linkedin.com/in/kangkanrajkhowa/",
    icon: "linkedin",
  },
  {
    label: "X",
    handle: "@kangkanrajkhowa",
    href: "https://www.twitter.com/kangkanrajkhowa",
    icon: "twitter",
  },
  {
    label: "Instagram",
    handle: "@kangkan_raj",
    href: "https://www.instagram.com/kangkan_raj/",
    icon: "instagram",
  },
  {
    label: "Facebook",
    handle: "krajkhowa",
    href: "https://www.facebook.com/krajkhowa/",
    icon: "facebook",
  },
  {
    label: "YouTube",
    handle: "@kangkanrajkhowa",
    href: "https://www.youtube.com/user/kangkanrajkhowa",
    icon: "youtube",
  },
];
