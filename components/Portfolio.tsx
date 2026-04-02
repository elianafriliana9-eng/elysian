"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export type ProjectData = {
  id: number;
  name: string;
  type: string;
  description: string;
  year: string;
  tech: string[];
};

type BadgeType = "E-Commerce" | "Web App" | "Landing Page" | "Complex System";

const badgeColors: Record<BadgeType, { bg: string; color: string }> = {
  "E-Commerce": { bg: "rgba(99, 179, 237, 0.12)", color: "#63b3ed" },
  "Web App": { bg: "rgba(154, 117, 234, 0.12)", color: "#9a75ea" },
  "Landing Page": { bg: "rgba(72, 187, 120, 0.12)", color: "#48bb78" },
  "Complex System": { bg: "rgba(252, 129, 74, 0.12)", color: "#fc814a" },
};

const DEFAULT_PROJECTS = [
  {
    name: "TokoBaju.id",
    type: "E-Commerce" as BadgeType,
    description:
      "Fashion brand's online storefront with catalog management, cart, and Midtrans checkout. Launched in 2.5 weeks.",
    tech: ["Next.js", "Tailwind", "Prisma", "PostgreSQL"],
    year: "2025",
    accent: "#63b3ed",
  },
  {
    name: "MedisPlus",
    type: "Web App" as BadgeType,
    description:
      "Clinic appointment booking and patient management system with queue tracking and doctor scheduling.",
    tech: ["React", "Node.js", "MySQL", "Redis"],
    year: "2025",
    accent: "#9a75ea",
  },
  {
    name: "BiteBox",
    type: "Landing Page" as BadgeType,
    description:
      "Premium F&B brand launch page with animated storytelling, menu showcase, and franchise inquiry form.",
    tech: ["Next.js", "Framer Motion", "Tailwind"],
    year: "2024",
    accent: "#48bb78",
  },
  {
    name: "LogiTrack",
    type: "Complex System" as BadgeType,
    description:
      "Logistics tracking platform with real-time fleet management, delivery status, and driver apps.",
    tech: ["Next.js", "WebSocket", "PostgreSQL", "Maps API"],
    year: "2024",
    accent: "#fc814a",
  },
];

function PortfolioCard({ project }: { project: (typeof DEFAULT_PROJECTS)[0] }) {
  const [hovered, setHovered] = useState(false);
  const badge = badgeColors[project.type as BadgeType] ?? { bg: "rgba(255,255,255,0.08)", color: "#aaa" };

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface-2)",
        borderRadius: "20px",
        border: hovered
          ? `1px solid rgba(200, 169, 110, 0.35)`
          : "1px solid var(--border)",
        padding: "36px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 60px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top decorative line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: hovered
            ? `linear-gradient(90deg, transparent, ${project.accent}, transparent)`
            : "transparent",
          transition: "background 0.4s ease",
        }}
      />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3
            className="font-playfair"
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.3px",
              marginBottom: "10px",
            }}
          >
            {project.name}
          </h3>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "100px",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              background: badge.bg,
              color: badge.color,
            }}
          >
            {project.type}
          </span>
        </div>
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            fontWeight: 400,
          }}
        >
          {project.year}
        </span>
      </div>

      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.65,
          color: "var(--text-muted)",
          marginBottom: "28px",
        }}
      >
        {project.description}
      </p>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "20px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--text-muted)",
                padding: "3px 10px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "4px",
                border: "1px solid var(--border)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <span
          style={{
            fontSize: "13px",
            color: "var(--accent)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            whiteSpace: "nowrap",
            marginLeft: "12px",
          }}
        >
          View details →
        </span>
      </div>
    </motion.div>
  );
}

export default function Portfolio({ projects: projectsProp }: { projects?: ProjectData[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const projects =
    projectsProp && projectsProp.length > 0
      ? projectsProp.map((p) => ({
          ...p,
          type: p.type as BadgeType,
          accent: badgeColors[p.type as BadgeType]?.color ?? "#C8A96E",
        }))
      : DEFAULT_PROJECTS;

  return (
    <section
      id="work"
      style={{
        padding: "120px 24px",
        scrollMarginTop: "80px",
      }}
    >
      <div ref={ref} style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            marginBottom: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--accent)",
                marginBottom: "16px",
              }}
            >
              Selected work
            </p>
            <h2
              className="font-playfair"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              A few things{" "}
              <em style={{ color: "var(--accent)" }}>we&rsquo;ve built.</em>
            </h2>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              maxWidth: "280px",
              lineHeight: 1.6,
            }}
          >
            Each project is different. We take the time to understand before we build.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
          className="portfolio-grid"
        >
          {projects.map((project) => (
            <PortfolioCard key={project.name} project={project} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
