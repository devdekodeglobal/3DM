import { HERO_AFTERGLOW_BOOTH_CONFIG, HERO_AFTERGLOW_ELEMENTS } from "./heroAfterglowData";
import { TECH_SHOWCASE_BOOTH_CONFIG, TECH_SHOWCASE_ELEMENTS } from "./techShowcaseData";
import { DESIGN_1X_BOOTH_CONFIG, DESIGN_1X_ELEMENTS } from "./design1xData";

export interface ShowcaseProject {
  id: string;
  name: string;
  badge: string;
  dimensions: string;
  tagline: string;
  /** Static perspective render used as the "3D View" step in the homepage showcase (no BabylonJS) */
  view3dUrl: string;
  boothConfig: any;
  elements: any[];
  renders: {
    label: string;
    description: string;
    url: string;
    iconName?: "camera" | "compass";
  }[];
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "afterglow-lounge",
    name: "Krafc Lounge & Bar",
    badge: "Featured",
    dimensions: "10.0m × 7.0m",
    tagline: "Social hospitality booth with backlit acoustic slats & bar setup",
    view3dUrl: "/showcase/afterglow-perspective.png",
    boothConfig: HERO_AFTERGLOW_BOOTH_CONFIG,
    elements: HERO_AFTERGLOW_ELEMENTS,
    renders: [
      {
        label: "Isometric Perspective",
        description: "Studio lighting with ambient reflections & illuminated wall battens",
        url: "/showcase/afterglow-perspective.png",
        iconName: "camera"
      },
      {
        label: "Top-Down Plan View",
        description: "Architectural aerial rendering showing floor clearances & seating zones",
        url: "/showcase/afterglow-topdown.png",
        iconName: "compass"
      }
    ]
  },
  {
    id: "corner-tech-booth",
    name: "Tech Showcase",
    badge: "U-Shaped 3-Wall",
    dimensions: "7.0m × 3.0m",
    tagline: "High-impact tech expo stand with branded banners, custom blue flooring & ceiling louver system",
    view3dUrl: "/showcase/tech-perspective-angle.png",
    boothConfig: TECH_SHOWCASE_BOOTH_CONFIG,
    elements: TECH_SHOWCASE_ELEMENTS,
    renders: [
      {
        label: "Front Elevation",
        description: "Eye-level floor perspective showing branded graphics & open reception zone",
        url: "/showcase/tech-front-elevation.png",
        iconName: "camera"
      },
      {
        label: "Perspective Angle",
        description: "Studio isometric angle highlighting private storage room & ceiling louvers",
        url: "/showcase/tech-perspective-angle.png",
        iconName: "camera"
      },
      {
        label: "Top-Down Aerial View",
        description: "Overhead plan view detailing meeting tables, clearances & circulation path",
        url: "/showcase/tech-topdown-aerial.png",
        iconName: "compass"
      }
    ]
  },
  {
    id: "design-1x-pavilion",
    name: "Design 1x Pavilion",
    badge: "Enclosed 4-Wall",
    dimensions: "9.5m × 5.0m",
    tagline: "Large scale enterprise pavilion with multi-zone layouts and perimeter wall features",
    view3dUrl: "/showcase/pavilion-perspective.jpeg",
    boothConfig: DESIGN_1X_BOOTH_CONFIG,
    elements: DESIGN_1X_ELEMENTS,
    renders: [
      {
        label: "Isometric Perspective",
        description: "Studio lighting view showcasing multi-zone furniture lounge & illuminated branding",
        url: "/showcase/pavilion-perspective.jpeg",
        iconName: "camera"
      },
      {
        label: "Front Side Angle",
        description: "Diagonal architectural view highlighting pergola rafters, acoustic panels & hanging swing",
        url: "/showcase/pavilion-side-angle.png",
        iconName: "camera"
      },
      {
        label: "Top-Down Architectural Plan",
        description: "Aerial plan view displaying circulation flow, yellow runner path & zone partitions",
        url: "/showcase/pavilion-topdown.png",
        iconName: "compass"
      }
    ]
  }
];
