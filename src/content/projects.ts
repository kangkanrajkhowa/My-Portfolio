export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: "Product" | "Government" | "Open source" | "Design";
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  links: ProjectLink[];
  accent: string;
  gradient: string;
};

export const projects: Project[] = [
  {
    slug: "city-center-store-directory",
    index: "01",
    title: "City Center Store Directory",
    category: "Product",
    summary:
      "A one-stop web directory that consolidates every store inside City Centre, with an admin panel the client updates themselves.",
    problem:
      "Shoppers had no reliable way to know which stores existed in the mall, what they sold, or where they were. The client needed to publish updates without calling a developer.",
    approach:
      "Built a searchable directory on Laravel with a role-based admin panel, DataTables-powered listing and a normalised MySQL schema for stores, categories and floor locations.",
    outcome:
      "The client now maintains its own store list, and visitors can find a shop by name, category or floor — all from a single mobile-friendly page.",
    stack: ["Laravel", "MySQL", "Bootstrap", "JavaScript", "DataTables", "Lodash"],
    links: [
      { label: "Live site", href: "https://storefinder.brahmaputracitycenter.com/" },
    ],
    accent: "#C6F24E",
    gradient: "linear-gradient(135deg, #10160a 0%, #1d2a0f 45%, #0a0c07 100%)",
  },
  {
    slug: "personal-management-system",
    index: "02",
    title: "Personal Management System",
    category: "Product",
    summary:
      "A central place to organise personal data — notes, records and day-to-day admin — instead of scattering it across apps.",
    problem:
      "Personal records lived in spreadsheets, notes apps and paper. Nothing could be searched, cross-referenced or trusted.",
    approach:
      "A PHP application with a Twig-rendered interface, SCSS component styling and a small JavaScript layer for interactions, structured around a single owner’s workflow rather than a generic dashboard.",
    outcome:
      "One searchable home for personal records, with a UI that stays out of the way and a codebase small enough to keep extending.",
    stack: ["PHP", "Twig", "SCSS", "JavaScript", "CSS"],
    links: [
      {
        label: "Source",
        href: "https://github.com/kangkanrajkhowa/personal-management-system",
      },
    ],
    accent: "#7C5CFF",
    gradient: "linear-gradient(135deg, #0c0a18 0%, #1a1440 50%, #08060f 100%)",
  },
  {
    slug: "custom-hover-effects",
    index: "03",
    title: "Custom Hover Effects",
    category: "Open source",
    summary:
      "A collection of CSS-powered hover effects for links, buttons, logos, SVG and featured images — copy, paste, ship.",
    problem:
      "Most “hover effect” snippets online are bloated with JavaScript, break keyboard focus, or never account for reduced motion.",
    approach:
      "Pure CSS3 transitions and transforms, one class per effect, written with Less and SCSS sources so the library stays maintainable and easy to theme.",
    outcome:
      "A lightweight, drop-in set of effects that designers and developers can lift into any project without dragging a framework along.",
    stack: ["CSS", "SCSS", "Less", "Open source"],
    links: [
      { label: "Source", href: "https://github.com/kangkanrajkhowa/Custom-hover" },
    ],
    accent: "#4CC9F0",
    gradient: "linear-gradient(135deg, #061014 0%, #0d2a35 50%, #050a0d 100%)",
  },
  {
    slug: "egras-assam-web",
    index: "04",
    title: "eGRAS Assam — Web",
    category: "Government",
    summary:
      "The Government Receipt Accounting System that accepts online payment of Assam state taxes through bank portals.",
    problem:
      "Tax receipts were manual and reconciliation across banks and departments was slow, error-prone and hard to audit.",
    approach:
      "Worked on the Laravel application and PostgreSQL reporting layer, including Chart.js dashboards for receipts and accounting data for departmental users.",
    outcome:
      "A single online channel for state tax payments with live dashboards, used by departments and banks across Assam.",
    stack: ["Laravel", "PostgreSQL", "Chart.js", "CSS3", "JavaScript"],
    links: [{ label: "Live site", href: "https://assamegras.gov.in/" }],
    accent: "#F7A072",
    gradient: "linear-gradient(135deg, #140d08 0%, #33200f 50%, #0a0705 100%)",
  },
  {
    slug: "egras-assam-mobile",
    index: "05",
    title: "eGRAS Assam — Mobile",
    category: "Government",
    summary:
      "The Android and iOS companion to eGRAS for e-Challan payment processing and tracking on the move.",
    problem:
      "Field payments and challan tracking needed to work away from a desktop, on unreliable mobile networks.",
    approach:
      "A mobile client backed by the same CodeIgniter and PostgreSQL services as the web platform, with lightweight chart views and offline-tolerant submission.",
    outcome:
      "Taxpayers and field staff can pay and track challans from a phone, using the same verified receipt records as the web system.",
    stack: ["CodeIgniter", "PostgreSQL", "Chart.js", "CSS3", "JavaScript"],
    links: [],
    accent: "#FF8FA3",
    gradient: "linear-gradient(135deg, #140a0d 0%, #351622 50%, #0a0507 100%)",
  },
  {
    slug: "atmanirbhar-assam",
    index: "06",
    title: "Atmanirbhar Assam",
    category: "Government",
    summary:
      "A web portal and MIS tracking applications processed under Atmanirbhar Assam and other state banking schemes.",
    problem:
      "Scheme applications moved between departments and banks with no shared view of where each file stood, making progress impossible to monitor.",
    approach:
      "Built the portal and management information system on CodeIgniter with PostgreSQL, including Chart.js progress dashboards for the Finance Department and SLBC.",
    outcome:
      "Officers can see application status, bank-wise progress and scheme-level totals in one place instead of chasing spreadsheets.",
    stack: ["CodeIgniter", "PostgreSQL", "Chart.js", "CSS3", "JavaScript"],
    links: [
      { label: "Source", href: "https://github.com/kangkanrajkhowa/atmanirbhar" },
    ],
    accent: "#7BE0AD",
    gradient: "linear-gradient(135deg, #07120d 0%, #0f2f22 50%, #050a08 100%)",
  },
  {
    slug: "icai-guwahati",
    index: "07",
    title: "ICAI Guwahati",
    category: "Product",
    summary:
      "The public website for the Guwahati branch of the Institute of Chartered Accountants of India.",
    problem:
      "Members and students needed branch announcements, events and resources in one place, managed by non-technical staff.",
    approach:
      "A PHP and Bootstrap front end with DataTables listings, Slick carousels and jQuery interactions, plus a simple content workflow for branch administrators.",
    outcome:
      "A maintainable branch site that staff update themselves, with listings that stay readable on phones.",
    stack: ["PHP", "Bootstrap", "DataTables", "Slick", "jQuery"],
    links: [{ label: "Live site", href: "https://guwahati-icai.org/" }],
    accent: "#FFD166",
    gradient: "linear-gradient(135deg, #141004 0%, #33280c 50%, #0a0803 100%)",
  },
];

export const featuredProjects = projects;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? projects[index - 1] : undefined,
    next: index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}
