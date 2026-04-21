"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MessageCircle, Instagram, Linkedin, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  business: string;
  projectType: string;
  message: string;
}

const inputStyle = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "14px 18px",
  fontSize: "14px",
  color: "var(--text)",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--text-muted)",
  marginBottom: "8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
};

type ContactSettings = {
  email?: string;
  whatsapp?: string;
  instagram_url?: string;
  linkedin_url?: string;
};

export default function Contact({ settings }: { settings?: ContactSettings }) {
  const email = settings?.email ?? "[EMAIL_ADDRESS]";
  const whatsapp = settings?.whatsapp ?? "6285175090448";
  const instagramUrl = settings?.instagram_url ?? "https://instagram.com/elysianproject";
  const linkedinUrl = settings?.linkedin_url ?? "https://linkedin.com/company/elysianproject";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    business: "",
    projectType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", business: "", projectType: "", message: "" });
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (field: string) =>
    focusedField === field
      ? { ...inputStyle, borderColor: "rgba(200,169,110,0.6)", boxShadow: "0 0 0 3px rgba(200,169,110,0.08)" }
      : inputStyle;

  return (
    <section
      id="contact"
      style={{
        padding: "120px 24px",
        background: "var(--surface)",
        scrollMarginTop: "80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top border */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "var(--border)" }} />

      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        ref={ref}
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: "80px",
          alignItems: "flex-start",
        }}
        className="contact-grid"
      >
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
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
            Get in touch
          </p>
          <h2
            className="font-playfair"
            style={{
              fontSize: "clamp(30px, 4vw, 46px)",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.8px",
              lineHeight: 1.15,
              marginBottom: "24px",
            }}
          >
            Let&rsquo;s build{" "}
            <em style={{ color: "var(--accent)" }}>something</em>{" "}
            together.
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              marginBottom: "48px",
            }}
          >
            Tell us about your project. We&rsquo;ll get back to you within 24 hours — no sales pitch,
            just a real conversation.
          </p>

          {/* Contact links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
            <a
              href={`mailto:${email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <span style={{ color: "var(--accent)" }}>
                <Mail size={16} />
              </span>
              {email}
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <span style={{ color: "var(--accent)" }}>
                <MessageCircle size={16} />
              </span>
              WhatsApp: +{whatsapp}
            </a>
          </div>

          {/* Socials */}
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { href: instagramUrl, Icon: Instagram, label: "Instagram" },
              { href: linkedinUrl, Icon: Linkedin, label: "LinkedIn" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  transition: "border-color 0.2s ease, color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200,169,110,0.4)";
                  e.currentTarget.style.color = "var(--accent)";
                  e.currentTarget.style.background = "rgba(200,169,110,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" as const }}
        >
          {success ? (
            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid rgba(200,169,110,0.3)",
                borderRadius: "20px",
                padding: "60px 40px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(200,169,110,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "var(--accent)",
                }}
              >
                <CheckCircle size={28} />
              </div>
              <h3
                className="font-playfair"
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "12px",
                }}
              >
                Message received!
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "28px" }}>
                We&rsquo;ll be in touch soon — usually within 24 hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                style={{
                  padding: "10px 24px",
                  background: "transparent",
                  border: "1px solid rgba(200,169,110,0.4)",
                  borderRadius: "8px",
                  color: "var(--accent)",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Name + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-row">
                <div>
                  <label htmlFor="name" style={labelStyle}>Your Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Andi Pratama"
                    required
                    style={focusStyle("name")}
                  />
                </div>
                <div>
                  <label htmlFor="email" style={labelStyle}>Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="andi@company.com"
                    required
                    style={focusStyle("email")}
                  />
                </div>
              </div>

              {/* Business + Project type row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-row">
                <div>
                  <label htmlFor="business" style={labelStyle}>Business / Company</label>
                  <input
                    id="business"
                    name="business"
                    type="text"
                    value={formData.business}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("business")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your company name"
                    style={focusStyle("business")}
                  />
                </div>
                <div>
                  <label htmlFor="projectType" style={labelStyle}>Project Type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("projectType")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...focusStyle("projectType"),
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7A8A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "40px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select a type...</option>
                    <option value="landing-page">Landing Page</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="flutter-app">Flutter Mobile App (iOS & Android)</option>
                    <option value="complex-system">Complex System</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" style={labelStyle}>Tell us about your project *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="What are you building? Who is it for? Do you have a timeline or budget in mind?"
                  rows={4}
                  required
                  style={{
                    ...focusStyle("message"),
                    resize: "vertical",
                    minHeight: "120px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <p style={{ fontSize: "13px", color: "#fc8181", padding: "10px 14px", background: "rgba(252,129,129,0.08)", borderRadius: "8px", border: "1px solid rgba(252,129,129,0.2)" }}>
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "15px 32px",
                  background: loading ? "rgba(200,169,110,0.6)" : "var(--accent)",
                  color: "#09090E",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "background 0.2s ease, transform 0.2s ease",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "var(--accent-hover)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = loading ? "rgba(200,169,110,0.6)" : "var(--accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Sending...
                  </>
                ) : (
                  "Send Message →"
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
