export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
  accent: string;
};

/**
 * Mirrors the CV: only real, dated employment. The freelance and open-source
 * work lives on in the projects and about sections rather than being presented
 * as a job.
 */
export const experience: ExperienceItem[] = [
  {
    role: "Senior Fullstack Developer",
    org: "National Informatics Centre (NIC)",
    period: "Jun 2020 - Present",
    location: "Guwahati, Assam",
    summary:
      "Building secure e-governance and payment platforms for the Finance Department of the Government of Assam - tax collection, scheme portals and internal MIS used by 100,000+ people.",
    bullets: [
      "Improved government service delivery by 40% by architecting and delivering scalable e-governance platforms, including Assam GRAS and Atmanirbhar Assam.",
      "Led Assam GRAS from legacy Core PHP and Oracle DB to Laravel and PostgreSQL - 30% faster transaction processing, 99.5% uptime, 100+ tax types.",
      "Designed and prototyped the cross-platform Assam GRAS app in Flutter, Dart and BLoC for 50,000+ mobile users, with real-time payment tracking and multi-method payments.",
      "Raised accessibility and operational efficiency by 25% across Laravel, Core PHP, PostgreSQL, REST APIs and Flutter, reaching 95% user satisfaction.",
    ],
    accent: "#C6F24E",
  },
  {
    role: "Web Developer",
    org: "Trans Technologies Solution Pvt. Ltd.",
    period: "Jul 2018 - Jun 2020",
    location: "Guwahati, Assam",
    summary:
      "Client websites and e-commerce platforms across six industries - the years where responsive layout, page weight and handover discipline became habit.",
    bullets: [
      "Designed and deployed 10+ business websites and e-commerce platforms in Core PHP, CodeIgniter and JavaScript, serving 5,000+ daily visitors with 95% client retention.",
      "Cut page load times by 40% and bugs by 15% through responsive Bootstrap layouts, iterative code review and JavaScript coding standards.",
      "Delivered 10+ projects on time with zero critical production bugs, using Git across the team and documented handovers for every client.",
    ],
    accent: "#7C5CFF",
  },
];
