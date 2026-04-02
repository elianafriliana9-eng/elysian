"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export type ServiceData = {
  id: number;
  title: string;
  price: string;
  timeline: string;
  badge?: string | null;
  addon?: string | null;
  includes?: string | null;
  has_stacks: boolean;
  points: string[];
};

const stackOptions = {
  frontend: { label: "Frontend", stacks: ["React", "Next.js", "Vite", "Vue"] },
  backend: { label: "Backend", stacks: ["Laravel", "Go", "Python", "NestJS"] },
};

const DEFAULT_SERVICES = [
  {
    num: "01",
    title: "Landing Page",
    price: "From Rp 1.5jt",
    timeline: "3–7 days",
    accent: "var(--accent)",
    points: [
      "Responsive single/multi-section design",
      "Contact form & WhatsApp integration",
      "Basic SEO & Google Analytics",
      "Fast delivery, clean code",
    ],
    addon: "+ Custom domain available",
    stacks: null,
    includes: null,
  },
  {
    num: "02",
    title: "E-Commerce",
    price: "From Rp 10jt",
    timeline: "2–4 weeks",
    accent: "var(--accent)",
    points: [
      "Product catalog & management",
      "Payment gateway (Midtrans/Xendit)",
      "Order management dashboard",
      "Mobile-first design",
    ],
    addon: null,
    stacks: stackOptions,
    includes: "Cloud server + domain included (year 1)",
  },
  {
    num: "03",
    title: "Complex System",
    price: "From Rp 25jt",
    timeline: "Scoped",
    accent: "var(--accent)",
    points: [
      "Custom web application (ERP, CRM, HRMS, etc.)",
      "Role-based access control",
      "API design & integrations",
      "Ongoing support available",
    ],
    addon: null,
    stacks: stackOptions,
    includes: null,
  },
  {
    num: "04",
    title: "Flutter Mobile App",
    price: "From Rp 15jt",
    timeline: "4–8 weeks",
    accent: "#64FFDA",
    badge: "NEW",
    points: [
      "Cross-platform iOS & Android from one codebase",
      "Custom UI/UX — pixel-perfect on every device",
      "REST API / Firebase / Supabase integration",
      "Push notifications & deep linking",
      "App Store & Play Store deployment",
    ],
    addon: null,
    stacks: null,
    includes: "Play Console + App Store fee included (year 1)",
  },
];

const ACCENTS = ["var(--accent)", "var(--accent)", "var(--accent)", "#64FFDA"];

function mapServiceDataToInternal(data: ServiceData, index: number) {
  return {
    num: String(index + 1).padStart(2, "0"),
    title: data.title,
    price: data.price,
    timeline: data.timeline,
    accent: ACCENTS[index] ?? "var(--accent)",
    badge: data.badge ?? undefined,
    points: data.points,
    addon: data.addon ?? null,
    stacks: data.has_stacks ? stackOptions : null,
    includes: data.includes ?? null,
  };
}

type InternalService = {
  num: string;
  title: string;
  price: string;
  timeline: string;
  accent: string;
  badge?: string | null;
  points: string[];
  addon: string | null;
  stacks: typeof stackOptions | null;
  includes: string | null;
};

function ServiceCard({
  service,
  large = false,
  wide = false,
}: {
  service: InternalService;
  large?: boolean;
  wide?: boolean;
}) {
  const accent = service.accent ?? "var(--accent)";
  const isMobile = service.num === "04";

  return (
    <motion.div
      variants={itemVariants}
      style={{
        position: "relative",
        background: isMobile ? "rgba(100,255,218,0.03)" : "var(--surface-2)",
        borderRadius: "20px",
        border: isMobile ? "1px solid rgba(100,255,218,0.2)" : "1px solid var(--border)",
        padding: large ? "48px" : wide ? "40px 48px" : "36px",
        overflow: "hidden",
        cursor: "default",
        height: large ? "100%" : undefined,
        display: "flex",
        flexDirection: wide ? "row" : "column",
        justifyContent: "space-between",
        alignItems: wide ? "center" : undefined,
        gap: wide ? "48px" : undefined,
      }}
      whileHover={{
        y: wide ? 0 : -4,
        x: wide ? -2 : 0,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${accent}50`,
        borderColor: `${accent}50`,
      }}
    >
      {/* NEW badge */}
      {service.badge && (
        <div style={{
          position: "absolute",
          top: "16px",
          right: "20px",
          background: "#64FFDA",
          color: "#09090E",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.12em",
          padding: "3px 8px",
          borderRadius: "4px",
          fontFamily: "monospace",
        }}>
          {service.badge}
        </div>
      )}

      {/* Decorative number */}
      <span
        className="font-playfair"
        style={{
          position: "absolute",
          top: large ? "24px" : "16px",
          right: service.badge ? "70px" : (large ? "32px" : "24px"),
          fontSize: large ? "96px" : wide ? "80px" : "72px",
          fontWeight: 900,
          color: accent,
          opacity: 0.06,
          lineHeight: 1,
          letterSpacing: "-4px",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {service.num}
      </span>

      {/* Main content */}
      <div style={{ flex: wide ? 1 : undefined }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: accent,
            marginBottom: "10px",
            fontFamily: "monospace",
          }}>
            {service.num}
          </p>
          <h3
            className="font-playfair"
            style={{
              fontSize: large ? "32px" : wide ? "28px" : "24px",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.5px",
            }}
          >
            {service.title}
          </h3>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {service.points.map((point, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <span style={{ color: accent, marginTop: "3px", flexShrink: 0 }}>✦</span>
              {point}
            </li>
          ))}
        </ul>

        {/* Add-on (Landing Page) */}
        {service.addon && (
          <div style={{
            marginBottom: "12px",
            padding: "6px 10px",
            background: "rgba(200,169,110,0.06)",
            border: "1px dashed rgba(200,169,110,0.3)",
            borderRadius: "6px",
            fontSize: "11px",
            color: "var(--accent)",
            fontFamily: "monospace",
            letterSpacing: "0.02em",
          }}>
            {service.addon}
          </div>
        )}

        {/* Includes banner */}
        {service.includes && (
          <div style={{
            marginBottom: "12px",
            padding: "6px 10px",
            background: isMobile ? "rgba(100,255,218,0.06)" : "rgba(200,169,110,0.08)",
            border: `1px solid ${isMobile ? "rgba(100,255,218,0.2)" : "rgba(200,169,110,0.25)"}`,
            borderRadius: "6px",
            fontSize: "11px",
            color: isMobile ? "#64FFDA" : "var(--accent)",
            fontFamily: "monospace",
            letterSpacing: "0.02em",
          }}>
            ✦ {service.includes}
          </div>
        )}

        {/* Stack options */}
        {service.stacks && !wide && (
          <div style={{ marginBottom: wide ? 0 : "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", marginBottom: "6px" }}>
              Stack
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {Object.values(service.stacks).map((group) => (
                <div key={group.label} style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace", minWidth: "52px", flexShrink: 0 }}>{group.label}:</span>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {group.stacks.map((s) => (
                      <span key={s} style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "rgba(200,169,110,0.07)",
                        border: "1px solid rgba(200,169,110,0.2)",
                        color: "var(--accent)",
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price/timeline footer */}
      <div style={{
        display: "flex",
        flexDirection: wide ? "column" : "row",
        alignItems: wide ? "flex-end" : "center",
        justifyContent: wide ? "center" : "space-between",
        gap: wide ? "8px" : undefined,
        paddingTop: wide ? 0 : "20px",
        borderTop: wide ? "none" : "1px solid var(--border)",
        flexShrink: 0,
        minWidth: wide ? "160px" : undefined,
      }}>
        <span style={{ fontSize: large ? "18px" : "16px", fontWeight: 700, color: accent }}>
          {service.price}
        </span>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "monospace" }}>
          {service.timeline}
        </span>
        {wide && (
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              marginTop: "12px",
              padding: "10px 20px",
              background: "transparent",
              color: "#64FFDA",
              border: "1px solid rgba(100,255,218,0.3)",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "monospace",
              letterSpacing: "0.04em",
              transition: "background 0.2s, border-color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(100,255,218,0.08)"; e.currentTarget.style.borderColor = "rgba(100,255,218,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(100,255,218,0.3)"; }}
          >
            Let&apos;s Build →
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Services({ services: servicesProp }: { services?: ServiceData[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const services =
    servicesProp && servicesProp.length > 0
      ? servicesProp.map(mapServiceDataToInternal)
      : DEFAULT_SERVICES;

  return (
    <section
      id="services"
      ref={ref}
      style={{
        padding: "120px 24px",
        maxWidth: "1280px",
        margin: "0 auto",
        scrollMarginTop: "80px",
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        style={{ marginBottom: "64px" }}
      >
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
          What we build
        </p>
        <h2
          className="font-playfair"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            maxWidth: "480px",
          }}
        >
          Services built for{" "}
          <em style={{ color: "var(--accent)" }}>real results.</em>
        </h2>
      </motion.div>

      {/* Asymmetric grid — top row 3 cards, bottom row Flutter full-width */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Top row: 3 web services */}
        <div
          className="services-top-row"
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr 2fr",
            gap: "20px",
          }}
        >
          {/* Complex System — large */}
          <ServiceCard service={services[2]} large />
          {/* Landing Page */}
          <ServiceCard service={services[0]} />
          {/* E-Commerce */}
          <ServiceCard service={services[1]} />
        </div>

        {/* Bottom row: Flutter Mobile App — full width, horizontal layout */}
        <ServiceCard service={services[3]} wide />
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .services-top-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
