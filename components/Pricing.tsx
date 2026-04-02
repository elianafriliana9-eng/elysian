"use client";

import { useRef } from "react";
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

export type PlanData = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  cta: string;
  is_popular: boolean;
  is_mobile: boolean;
  badge?: string | null;
  addon?: string | null;
  includes?: string | null;
  has_stacks: boolean;
  features: string[];
};

const stackGroups = {
  frontend: { label: "Frontend", stacks: ["React", "Next.js", "Vite", "Vue"] },
  backend: { label: "Backend", stacks: ["Laravel", "Go", "Python", "NestJS"] },
};

const DEFAULT_PLANS = [
  {
    name: "Starter",
    subtitle: "Landing Page",
    price: "Rp 1.5jt–5jt",
    cta: "Get Started",
    popular: false,
    mobile: false,
    features: [
      "1 page design",
      "Mobile responsive",
      "Contact form integration",
      "WhatsApp button",
      "1 round of revisions",
      "7-day delivery",
    ],
    addon: "Custom domain available — contact us",
    stacks: null,
    includes: null,
  },
  {
    name: "Growth",
    subtitle: "E-Commerce",
    price: "Rp 10jt–25jt",
    cta: "Most Popular",
    popular: true,
    mobile: false,
    features: [
      "Up to 50 products",
      "Payment gateway (Midtrans/Xendit)",
      "Order management dashboard",
      "Customer accounts",
      "Mobile-first design",
      "SEO + Analytics setup",
    ],
    addon: null,
    stacks: stackGroups,
    includes: "Cloud server + domain included (year 1)",
  },
  {
    name: "Mobile",
    subtitle: "Flutter App",
    price: "Rp 15jt–40jt",
    cta: "Build My App",
    popular: false,
    mobile: true,
    badge: "NEW",
    features: [
      "iOS & Android from one codebase",
      "Custom UI/UX design",
      "REST API / Firebase integration",
      "Push notifications",
      "App Store & Play Store deployment",
      "2 rounds of revisions",
    ],
    addon: null,
    stacks: null,
    includes: "Play Console + App Store fee included (year 1)",
  },
  {
    name: "Enterprise",
    subtitle: "Custom System",
    price: "Rp 25jt+",
    cta: "Let's Discuss",
    popular: false,
    mobile: false,
    features: [
      "Custom project scope",
      "Role-based access control",
      "API design & integrations",
      "Admin dashboard",
      "Priority support",
      "Dedicated project manager",
    ],
    addon: null,
    stacks: stackGroups,
    includes: null,
  },
];

export default function Pricing({ plans: plansProp }: { plans?: PlanData[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const plans =
    plansProp && plansProp.length > 0
      ? plansProp.map((p) => ({
          name: p.name,
          subtitle: p.subtitle,
          price: p.price,
          cta: p.cta,
          popular: p.is_popular,
          mobile: p.is_mobile,
          badge: p.badge ?? undefined,
          addon: p.addon ?? null,
          includes: p.includes ?? null,
          stacks: p.has_stacks ? stackGroups : null,
          features: p.features,
        }))
      : DEFAULT_PLANS;

  return (
    <section
      id="pricing"
      style={{
        padding: "120px 24px",
        background: "var(--surface)",
        position: "relative",
        scrollMarginTop: "80px",
        overflow: "hidden",
      }}
    >
      {/* Border lines */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "var(--border)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--border)" }} />

      <div ref={ref} style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "64px", textAlign: "center" }}
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
            Transparent pricing
          </p>
          <h2
            className="font-playfair"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-1px",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            No hidden costs.{" "}
            <em style={{ color: "var(--accent)" }}>No surprises.</em>
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", maxWidth: "440px", margin: "0 auto", lineHeight: 1.65 }}>
            Every quote is discussed upfront. You know exactly what you&rsquo;re paying before we start.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            alignItems: "center",
          }}
          className="pricing-grid"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              style={{
                position: "relative",
                background: plan.popular
                  ? "var(--bg)"
                  : plan.mobile
                  ? "rgba(100,255,218,0.03)"
                  : "var(--surface-2)",
                borderRadius: "20px",
                border: plan.popular
                  ? "1px solid rgba(200,169,110,0.5)"
                  : plan.mobile
                  ? "1px solid rgba(100,255,218,0.2)"
                  : "1px solid var(--border)",
                padding: plan.popular ? "44px 28px" : "32px 28px",
                transform: plan.popular ? "scale(1.04)" : "scale(1)",
                boxShadow: plan.popular
                  ? "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,169,110,0.15)"
                  : plan.mobile
                  ? "0 8px 32px rgba(100,255,218,0.05)"
                  : "none",
                zIndex: plan.popular ? 1 : 0,
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    right: "20px",
                    background: "var(--accent)",
                    color: "#09090E",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "4px 10px",
                    borderRadius: "0 0 8px 8px",
                  }}
                >
                  ⭐ Most Popular
                </div>
              )}

              {/* NEW badge for mobile */}
              {"badge" in plan && plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    right: "20px",
                    background: "#64FFDA",
                    color: "#09090E",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    padding: "4px 10px",
                    borderRadius: "0 0 8px 8px",
                    fontFamily: "monospace",
                  }}
                >
                  NEW
                </div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom: "28px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--text-muted)",
                    marginBottom: "8px",
                  }}
                >
                  {plan.subtitle}
                </p>
                <h3
                  className="font-playfair"
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "-0.3px",
                    marginBottom: "16px",
                  }}
                >
                  {plan.name}
                </h3>
                <div
                  style={{
                    fontSize: plan.popular ? "28px" : "24px",
                    fontWeight: 800,
                    color: "var(--accent)",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {plan.price}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px" }} />

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    <span style={{ color: plan.mobile ? "#64FFDA" : "var(--accent)", flexShrink: 0, marginTop: "2px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Add-on (Starter) */}
              {plan.addon && (
                <div style={{
                  margin: "0 0 16px",
                  padding: "8px 12px",
                  background: "rgba(200,169,110,0.06)",
                  border: "1px dashed rgba(200,169,110,0.3)",
                  borderRadius: "6px",
                  fontSize: "11.5px",
                  color: "var(--accent)",
                  fontFamily: "monospace",
                  letterSpacing: "0.02em",
                }}>
                  + {plan.addon}
                </div>
              )}

              {/* Includes banner (Growth / Mobile) */}
              {plan.includes && (
                <div style={{
                  margin: "0 0 16px",
                  padding: "8px 12px",
                  background: plan.mobile ? "rgba(100,255,218,0.06)" : "rgba(200,169,110,0.08)",
                  border: `1px solid ${plan.mobile ? "rgba(100,255,218,0.2)" : "rgba(200,169,110,0.25)"}`,
                  borderRadius: "6px",
                  fontSize: "11.5px",
                  color: plan.mobile ? "#64FFDA" : "var(--accent)",
                  fontFamily: "monospace",
                  letterSpacing: "0.02em",
                }}>
                  ✦ {plan.includes}
                </div>
              )}

              {/* Stack options (Growth / Enterprise) */}
              {plan.stacks && (
                <div style={{ margin: "0 0 20px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", marginBottom: "8px" }}>
                    Choose your stack
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {Object.values(plan.stacks).map((group) => (
                      <div key={group.label} style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace", minWidth: "56px", flexShrink: 0 }}>{group.label}:</span>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {group.stacks.map((s) => (
                            <span key={s} style={{
                              fontSize: "10px",
                              padding: "2px 7px",
                              borderRadius: "4px",
                              background: "rgba(200,169,110,0.07)",
                              border: "1px solid rgba(200,169,110,0.2)",
                              color: "var(--accent)",
                              fontFamily: "monospace",
                              letterSpacing: "0.02em",
                              whiteSpace: "nowrap",
                            }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer before CTA if no stacks */}
              {!plan.stacks && <div style={{ marginBottom: "16px" }} />}

              {/* CTA */}
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  transition: "background 0.2s ease, color 0.2s ease, transform 0.2s ease",
                  background: plan.popular ? "var(--accent)" : plan.mobile ? "transparent" : "transparent",
                  color: plan.popular ? "#09090E" : plan.mobile ? "#64FFDA" : "var(--accent)",
                  border: plan.popular ? "none" : plan.mobile ? "1px solid rgba(100,255,218,0.35)" : "1px solid rgba(200,169,110,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  if (plan.popular) { e.currentTarget.style.background = "var(--accent-hover)"; }
                  else if (plan.mobile) { e.currentTarget.style.background = "rgba(100,255,218,0.08)"; }
                  else { e.currentTarget.style.background = "rgba(200,169,110,0.1)"; }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  if (plan.popular) { e.currentTarget.style.background = "var(--accent)"; }
                  else { e.currentTarget.style.background = "transparent"; }
                }}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: "48px",
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            maxWidth: "520px",
            margin: "48px auto 0",
          }}
        >
          All prices are starting estimates. Final quote depends on scope.{" "}
          <span style={{ color: "var(--accent)" }}>We discuss before we charge anything.</span>
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-grid > div {
            transform: scale(1) !important;
          }
        }
      `}</style>
    </section>
  );
}
