---

## EXAMPLE INPUT → OUTPUT

### Input
```
500 kVA, 11kV/433V outdoor distribution transformer for municipal substation use
```

### Output
```json
{
  "queryAnalysis": {
    "originalQuery": "500 kVA, 11kV/433V outdoor distribution transformer for municipal substation use",
    "parsedProduct": "Outdoor Three-Phase Distribution Transformer, 500 kVA, 11kV/433V",
    "productCategory": "Electrical Equipment > Transformers > Distribution Transformers",
    "ambiguityFlag": false,
    "ambiguityNote": null
  },
  "standards": [
    {
      "id": "is-1180-part-1",
      "number": "IS 1180 (Part 1)",
      "title": "Outdoor Type Three-Phase Distribution Transformers Upto and Including 2500 kVA, 33kV",
      "edition": "2014",
      "status": "active",
      "relevance": 98,
      "relationship": "primary",
      "description": "Primary specification directly governing the design, construction, material selection, and performance testing of the queried 500 kVA, 11kV/433V outdoor distribution transformer. The transformer's rated capacity (500 kVA) and HV voltage (11kV) fall squarely within this standard's scope of up to 2500 kVA and 33kV. All tender specifications for this transformer must be derived from the technical requirements in this standard, including winding configuration, temperature rise limits, and loss values.",
      "amendments": [
        { "label": "Amendment 1 — 2017", "downloadUrl": "https://example.com/amendment1.pdf" },
        { "label": "Amendment 2 — 2019", "downloadUrl": "https://example.com/amendment2.pdf" },
        { "label": "Amendment 3 — 2021" },
        { "label": "Amendment 4 — 2023", "downloadUrl": "https://example.com/amendment4.pdf" }
      ],
      "gazetteDocuments": [
        { "label": "Gazette Notification 2021", "downloadUrls": ["https://example.com/gazette1.pdf"] }
      ],
      "productManuals": [
        { "label": "Product Manual 2020", "downloadUrl": "https://example.com/manual.pdf" }
      ],
      "certifications": [
        { "name": "BIS ISI Mark (Mandatory)", "status": "APPLICABLE" },
        { "name": "BEE Star Rating", "status": "APPLICABLE" },
        { "name": "CEA Type Test Certificate", "status": "CHECK REQUIRED" }
      ],
      "missingParams": [
        "Maximum No-Load Losses (Watts) not specified — required under IS 1180 Cl. 5.3 for BEE star rating compliance",
        "Maximum Full-Load Losses (Watts) not specified — critical for efficiency class determination",
        "Percentage Impedance (%) and tolerance not stated — affects short-circuit withstand and protection coordination",
        "Vector Group not explicitly stated — Dyn11 is standard for 11kV/433V but must be declared in tender",
        "Cooling method not specified (ONAN assumed but must be declared per IS 1180 Cl. 4.1)",
        "Tap changer type (off-circuit / on-load) and tap range not specified"
      ]
    },
    {
      "id": "is-2026-part-1",
      "number": "IS 2026 (Part 1)",
      "title": "Power Transformers - General Requirements",
      "edition": "2011",
      "status": "active",
      "relevance": 85,
      "relationship": "normative",
      "description": "Normatively referenced by IS 1180, this standard establishes the general service conditions, rating definitions, and nameplate data requirements applicable to the 500 kVA distribution transformer. Clause 4 of IS 2026 (Part 1) defines the standard altitude (up to 1000m above MSL) and ambient temperature (max 50°C) under which rated performance must be guaranteed — both of which must be confirmed in the tender specification for municipal substation use."
    },
    {
      "id": "is-2026-part-2",
      "number": "IS 2026 (Part 2)",
      "title": "Power Transformers - Temperature Rise",
      "edition": "2010",
      "status": "active",
      "relevance": 76,
      "relationship": "normative",
      "description": "Defines the permissible temperature rise limits for windings and top oil for the 500 kVA transformer under ONAN cooling. For a distribution transformer at continuous full load (100% rated current), the winding temperature rise must not exceed 65°C by resistance measurement. These limits must be verified during the temperature rise type test specified in IS 1180."
    },
    {
      "id": "is-335",
      "number": "IS 335",
      "title": "New Insulating Oils — Specification",
      "edition": "2018",
      "status": "active",
      "relevance": 72,
      "relationship": "normative",
      "description": "Specifies the quality, breakdown voltage, moisture content, and flash point requirements for the mineral insulating oil used in the 500 kVA transformer's tank. IS 1180 mandates oil complying with IS 335 for all oil-immersed distribution transformers. The latest 2018 edition introduced stricter PCB content limits (below 2 ppm) which must be declared by the transformer manufacturer in supply documentation."
    },
    {
      "id": "is-2026-part-3",
      "number": "IS 2026 (Part 3)",
      "title": "Power Transformers — Insulation Levels and Dielectric Tests",
      "edition": "2018",
      "status": "active",
      "relevance": 88,
      "relationship": "testing",
      "description": "Defines the insulation levels and dielectric test procedures — including induced overvoltage test, separate source voltage withstand test, and lightning impulse test — required for the 11kV winding of the queried transformer. For an 11kV (Um = 12 kV) system, the standard mandates a lightning impulse withstand voltage of 75 kVp. Type test reports to IS 2026 (Part 3) must be submitted with the tender bid."
    },
    {
      "id": "is-10028-part-1",
      "number": "IS 10028 (Part 1)",
      "title": "Code of Practice for Selection, Installation and Maintenance of Transformers — Selection",
      "edition": "1985",
      "status": "active",
      "relevance": 91,
      "relationship": "installation",
      "description": "Provides the engineering basis for selecting the correct transformer capacity and type for the municipal substation use-case. Clause 5 of this code covers load factor, demand factor, and diversity factor calculations for determining the 500 kVA rating adequacy. Procurement officials should verify that the substation's projected peak demand and diversity factor justify the 500 kVA selection per this code."
    },
    {
      "id": "is-10028-part-2",
      "number": "IS 10028 (Part 2)",
      "title": "Code of Practice for Selection, Installation and Maintenance of Transformers — Installation",
      "edition": "1981",
      "status": "active",
      "relevance": 68,
      "relationship": "installation",
      "description": "Specifies civil and safety requirements for the outdoor installation of the 500 kVA transformer at the municipal substation, including plinth dimensions, oil soak pit sizing, fire wall clearances, and earthing of the tank and neutral. These requirements must be included in the civil works tender specification accompanying the transformer procurement."
    },
    {
      "id": "is-3347",
      "number": "IS 3347",
      "title": "Dimensions for Porcelain Transformer Bushings",
      "edition": "1986",
      "status": "active",
      "relevance": 54,
      "relationship": "related",
      "description": "Specifies the dimensional requirements and creepage distances for HV (11kV) and LV (433V) porcelain bushings fitted on the transformer tank. While IS 1180 mandates bushing compliance, IS 3347 is the governing standard for the bushings themselves. Procurers should specify IS 3347-compliant bushings separately if the transformer is to be supplied without factory-fitted bushings."
    },
    {
      "id": "is-2705",
      "number": "IS 2705 (Part 1 to 4)",
      "title": "Current Transformers",
      "edition": "1992",
      "status": "active",
      "relevance": 35,
      "relationship": "related",
      "description": "Governs the metering and protection CTs that are commonly installed in the LV distribution board or metering cubicle attached to the 500 kVA transformer. While not a direct requirement of IS 1180, CTs complying with IS 2705 are typically procured alongside the transformer for energy metering and feeder protection in municipal substations."
    }
  ]
}
```

---