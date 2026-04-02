"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export type TestimonialData = {
  id: number;
  quote: string;
  author_name: string;
  author_role: string;
  rating: number;
};

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "Elysian delivered our e-commerce site in under 3 weeks. Sales went up 40% in the first month — better than we ever expected.",
    name: "Andi Pratama",
    role: "Owner, TokoBaju.id",
    rating: 5,
  },
  {
    quote:
      "We had a rough brief and they asked all the right questions. The result was beyond what we imagined. They truly understand the product, not just the code.",
    name: "dr. Sari Wahyuni",
    role: "Founder, MedisPlus",
    rating: 5,
  },
  {
    quote:
      "Honest pricing, fast execution. They finished 2 days early and the site looks incredible. I'll keep coming back for every project.",
    name: "Rizky Firmansyah",
    role: "Creative Director, BiteBox",
    rating: 5,
  },
];

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

export default function Testimonials({ testimonials: testimonialsProp }: { testimonials?: TestimonialData[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const testimonials =
    testimonialsProp && testimonialsProp.length > 0
      ? testimonialsProp.map((t) => ({ quote: t.quote, name: t.author_name, role: t.author_role, rating: t.rating }))
      : DEFAULT_TESTIMONIALS;

  return (
    <section
      id="testimonials"
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
            From our clients
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
            The work speaks.{" "}
            <em style={{ color: "var(--accent)" }}>So do they.</em>
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
          className="testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              style={{
                background: "var(--surface-2)",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                padding: "40px 36px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "28px",
              }}
            >
              {/* Big decorative quote mark */}
              <div
                className="font-playfair"
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "28px",
                  fontSize: "120px",
                  color: "var(--accent)",
                  opacity: 0.12,
                  lineHeight: 1,
                  fontWeight: 900,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", position: "relative", zIndex: 1 }}>
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si} style={{ color: "var(--accent)", fontSize: "15px" }}>
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--text)",
                  position: "relative",
                  zIndex: 1,
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div
                style={{
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: "4px",
                  }}
                >
                  {t.name}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 400 }}>
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .testimonials-grid {
            display: flex !important;
            overflow-x: auto !important;
            gap: 16px !important;
            scroll-snap-type: x mandatory;
            padding-bottom: 16px;
          }
          .testimonials-grid > div {
            min-width: 280px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
}
