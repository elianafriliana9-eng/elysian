"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DEFAULT_STEPS = [
  {
    title: "Discovery",
    description: "We dig into your business, goals, and needs — asking the questions most developers skip.",
  },
  {
    title: "Design",
    description: "Clean mockups and a clear direction before a single line of code is written.",
  },
  {
    title: "Build",
    description: "We code fast, thoroughly tested, and production-optimized from day one.",
  },
  {
    title: "Launch",
    description: "You go live with confidence. We stay around for support and future growth.",
  },
];

export default function Process({ steps: stepsProp }: { steps?: { title: string; description: string }[] }) {
  const stepsData = stepsProp && stepsProp.length > 0 ? stepsProp : DEFAULT_STEPS;
  const steps = stepsData.map((s, i) => ({
    ...s,
    num: String(i + 1).padStart(2, "0"),
  }));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="process"
      style={{
        padding: "120px 24px",
        background: "var(--surface)",
        position: "relative",
        scrollMarginTop: "80px",
        overflow: "hidden",
      }}
    >
      {/* Background accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "var(--border)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "var(--border)",
        }}
      />

      <div
        ref={ref}
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          style={{ marginBottom: "72px" }}
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
            How we work
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
            Simple, clear,{" "}
            <em style={{ color: "var(--accent)" }}>no surprises.</em>
          </h2>
        </motion.div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            position: "relative",
          }}
          className="process-grid"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: "easeOut" as const,
              }}
              style={{
                padding: "40px 36px 40px 0",
                position: "relative",
              }}
            >
              {/* Dashed connector line (not on last) */}
              {i < steps.length - 1 && (
                <div
                  className="process-connector"
                  style={{
                    position: "absolute",
                    top: "52px",
                    right: "0",
                    width: "100%",
                    height: "1px",
                    borderTop: "1px dashed rgba(255,255,255,0.1)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Number */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  marginBottom: "24px",
                }}
              >
                <span
                  className="font-playfair"
                  style={{
                    fontSize: "48px",
                    fontWeight: 900,
                    color: "var(--accent)",
                    lineHeight: 1,
                    letterSpacing: "-2px",
                    display: "block",
                    opacity: 0.9,
                  }}
                >
                  {step.num}
                </span>
              </div>

              <h3
                className="font-playfair"
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "12px",
                  letterSpacing: "-0.3px",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "var(--text-muted)",
                  maxWidth: "220px",
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
          .process-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
