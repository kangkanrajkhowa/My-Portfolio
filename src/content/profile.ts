export const profile = {
  name: "Kangkan Rajkhowa",
  firstName: "Kangkan",
  lastName: "Rajkhowa",
  greeting: "নমস্কাৰ",
  signoff: "ধন্যবাদ",
  roles: ["Fullstack Developer", "Product Engineer", "Problem Solver"],
  tagline:
    "Helping people make the world a better place through quality software.",
  location: "Guwahati, Assam, India",
  timezone: "Asia/Kolkata",
  email: "kangkan.raj@gmail.com",
  phone: "+91 87230 02321",
  phoneHref: "+918723002321",
  availability: "Open to freelance & collaborations",
  organisation: "National Informatics Centre (NIC)",
  bio: [
    "I’m an Indian fullstack developer with a passion for solving problems through simple, interactive software.",
    "During the day I work as a senior developer at NIC. In the evening I take on freelance projects and build things that live on the internet — government platforms, store finders, internal tools and the occasional experiment.",
    "I’m an open-source enthusiast. This site has no ads, no affiliate links, no tracking, no analytics and no paywall. My only motivation is to share what I’ve learned with the world.",
  ],
  principles: [
    {
      title: "Interfaces that explain themselves",
      body: "Every screen should answer the next question before it is asked.",
    },
    {
      title: "Ship, then refine",
      body: "A working thing in front of real people beats a perfect mockup in a folder.",
    },
    {
      title: "No dark patterns",
      body: "No ads, no affiliate links, no analytics. The work speaks for itself.",
    },
  ],
} as const;

export type Profile = typeof profile;
