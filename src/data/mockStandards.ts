import type { Standard } from "../types/standards";

export const MOCK_STANDARDS: Standard[] = [
  {
    id: "is-1180",
    number: "IS 1180 (Part 1)",
    title:
      "Outdoor Type Three-Phase Distribution Transformers Upto and Including 2500 kVA, 33kV",
    edition: "2014",
    status: "active",
    relevance: 98,
    relationship: "primary",
    description:
      "Primary specification governing the design, materials, and testing of outdoor distribution transformers. Matches the technical requirements specified in the tender document for 500kVA, 11kV/433V distribution transformers.",
    amendments: [
      { label: "Amendment 1 — 2017", downloadUrl: "https://example.com/a1.pdf" },
      { label: "Amendment 2 — 2019" },
      { label: "Amendment 3 — 2021", downloadUrl: "https://example.com/a3.pdf" },
      { label: "Amendment 4 — 2023" },
    ],
    gazetteDocuments: [
      { label: "Gazette Notification 2021", downloadUrls: ["https://example.com/g1.pdf", "https://example.com/g2.pdf"] }
    ],
    productManuals: [
      { label: "Implementation Manual", downloadUrl: "https://example.com/manual.pdf" }
    ],
    certifications: [
      { name: "BIS ISI Mark (Mandatory)", status: "APPLICABLE" },
      { name: "BEE Star Rating", status: "APPLICABLE" },
    ],
    missingParams: [
      "Maximum No-Load Losses not specified",
      "Percentage Impedance tolerance missing",
      "Vector Group not explicitly stated",
    ],
  },
  {
    id: "is-2026-1",
    number: "IS 2026 (Part 1)",
    title: "Power Transformers - General Requirements",
    edition: "2011",
    status: "active",
    relevance: 85,
    relationship: "normative",
    description:
      "Normative reference for general requirements, service conditions, and rating plates for fluid-immersed transformers.",
  },
  {
    id: "is-2026-2",
    number: "IS 2026 (Part 2)",
    title: "Power Transformers - Temperature Rise",
    edition: "2010",
    status: "active",
    relevance: 76,
    relationship: "normative",
    description:
      "Defines the cooling methods and maximum permissible temperature rise limits for the active parts of the transformer.",
  },
  {
    id: "is-335",
    number: "IS 335",
    title: "New Insulating Oils - Specification",
    edition: "2018",
    status: "active",
    relevance: 42,
    relationship: "normative",
    description:
      "Mandatory specification for the uninhibited or inhibited mineral insulating oil used for cooling and insulation.",
  },
  {
    id: "is-10028-1",
    number: "IS 10028 (Part 1)",
    title:
      "Code of practice for selection, installation and maintenance of transformers - Selection",
    edition: "1985",
    status: "active",
    relevance: 91,
    relationship: "installation",
    description:
      "Guidelines for selecting the right capacity and type of transformer based on load conditions and site altitude.",
  },
  {
    id: "is-10028-2",
    number: "IS 10028 (Part 2)",
    title:
      "Code of practice for selection, installation and maintenance of transformers - Installation",
    edition: "1981",
    status: "active",
    relevance: 68,
    relationship: "installation",
    description:
      "Safety and civil requirements for mounting outdoor distribution transformers on pole structures or plinths.",
  },
  {
    id: "is-2705",
    number: "IS 2705 (Part 1 to 4)",
    title: "Current Transformers",
    edition: "1992",
    status: "active",
    relevance: 35,
    relationship: "related",
    description:
      "Specification for CTs which are often required for metering cubicles attached to the distribution transformer.",
  },
  {
    id: "is-3347",
    number: "IS 3347",
    title: "Dimensions for Porcelain Transformer Bushings",
    edition: "1986",
    status: "active",
    relevance: 54,
    relationship: "related",
    description:
      "Dimensional requirements for HV and LV bushings used on the transformer tank.",
  },
  {
    id: "is-2026-3",
    number: "IS 2026 (Part 3)",
    title: "Power Transformers - Insulation Levels and Dielectric Tests",
    edition: "2018",
    status: "active",
    relevance: 88,
    relationship: "testing",
    description:
      "Defines routine, type, and special dielectric tests (e.g., lightning impulse test) required for the transformer.",
  },
];

export const groupedStandards = MOCK_STANDARDS.reduce((acc, std) => {
  if (!acc[std.relationship]) acc[std.relationship] = [];
  acc[std.relationship].push(std);
  return acc;
}, {} as Record<string, Standard[]>);
