"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Typewriter for rotating service types ─── */
const services = ["Landing Pages", "E-Commerce", "Web Systems", "Mobile Apps", "Custom APIs", "Dashboards"];

function useTypewriter(words: string[], speed = 75, pause = 1800) {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && chars < word.length) {
      t = setTimeout(() => setChars((c) => c + 1), speed);
    } else if (!deleting && chars === word.length) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && chars > 0) {
      t = setTimeout(() => setChars((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [chars, deleting, index, words, speed, pause]);

  return words[index].slice(0, chars);
}

/* ─── Terminal lines ─── */
const termLines = [
  { text: "$ elysian create my-store --template ecommerce", type: "cmd" },
  { text: "", type: "gap" },
  { text: "  ◆ Initializing Next.js 15 + TypeScript...", type: "ok" },
  { text: "  ◆ Configuring Tailwind CSS v4...", type: "ok" },
  { text: "  ◆ Setting up PostgreSQL schema...", type: "ok" },
  { text: "  ◆ Integrating Midtrans gateway...", type: "ok" },
  { text: "  ◆ Enabling edge caching...", type: "ok" },
  { text: "  ◆ Running production build...", type: "ok" },
  { text: "", type: "gap" },
  { text: "  ✓  Your store is live!", type: "success" },
  { text: "     → https://my-store.vercel.app", type: "link" },
];

const lineColors: Record<string, string> = {
  cmd: "#64FFDA",
  ok: "#7A7A8A",
  success: "#C8A96E",
  link: "#64FFDA",
  gap: "transparent",
};

/* ─── Floating metrics ─── */
const metrics = [
  { label: "Perf", value: "98", color: "#4ade80", top: "12%", right: "-18px" },
  { label: "SEO", value: "100", color: "#64FFDA", top: "42%", right: "-24px" },
  { label: "Deploy", value: "<2min", color: "#C8A96E", bottom: "18%", right: "-8px" },
];

/* ─── Tech stack pills ─── */
const techPills = [
  { label: "Next.js", left: "-32px", top: "20%" },
  { label: "TypeScript", left: "-24px", bottom: "30%" },
  { label: "PostgreSQL", left: "30%", bottom: "-18px" },
  { label: "Tailwind", right: "10%", bottom: "-18px" },
];

const DEFAULT_STATS = [
  { val: "50+", label: "Projects" },
  { val: "3yrs", label: "In business" },
  { val: "100%", label: "Satisfaction" },
];

export default function Hero({ stats }: { stats?: { value: string; label: string }[] }) {
  const resolvedStats = stats && stats.length > 0
    ? stats.map((s) => ({ val: s.value, label: s.label }))
    : DEFAULT_STATS;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typeword = useTypewriter(services);
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  /* particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const pts: { x: number; y: number; r: number; o: number; s: number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 40; i++) {
      pts.push({ x: Math.random() * 1280, y: Math.random() * 900, r: Math.random() * 1 + 0.3, o: Math.random() * 0.25 + 0.05, s: Math.random() * 0.12 + 0.04 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,255,218,${p.o})`;
        ctx.fill();
        p.y -= p.s;
        if (p.y < -2) { p.y = canvas.height + 2; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  /* reveal terminal lines one by one */
  useEffect(() => {
    if (visibleLines >= termLines.length) return;
    const delay = visibleLines === 0 ? 1200 : termLines[visibleLines - 1].type === "gap" ? 150 : 380;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visibleLines]);

  /* blinking cursor */
  useEffect(() => {
    const t = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      {/* ── Dot grid background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(100,255,218,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          pointerEvents: "none",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Gradient vignette over grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(10,20,40,0.6) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Particles ── */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.5 }}
      />

      {/* ── Content grid ── */}
      <div
        className="hero-grid"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ════ LEFT ════ */}
        <div>
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              background: "rgba(100,255,218,0.06)",
              border: "1px solid rgba(100,255,218,0.18)",
              borderRadius: "4px",
              marginBottom: "36px",
              fontFamily: "monospace",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 8px #4ade80",
                animation: "blink-dot 2s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: "11px", color: "#64FFDA", letterSpacing: "0.12em" }}>
              SYSTEM ONLINE
            </span>
            <span style={{ fontSize: "11px", color: "#7A7A8A", letterSpacing: "0.05em" }}>
              · ACCEPTING PROJECTS
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="font-playfair hero-h1"
            style={{ fontSize: "clamp(44px, 6vw, 82px)", lineHeight: 1.05, fontWeight: 700, marginBottom: "12px", letterSpacing: "-1px" }}
          >
            {["We build", "digital products"].map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.13, ease: "easeOut" }}
                style={{ display: "block", color: "var(--text)" }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* Typewriter line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-playfair"
            style={{
              fontSize: "clamp(44px, 6vw, 82px)",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-1px",
              marginBottom: "32px",
              color: "var(--accent)",
              fontStyle: "italic",
              minHeight: "1.1em",
            }}
          >
            {typeword}
            <span
              style={{
                display: "inline-block",
                width: "3px",
                height: "0.85em",
                background: "var(--accent)",
                marginLeft: "4px",
                verticalAlign: "middle",
                opacity: cursorVisible ? 1 : 0,
                transition: "opacity 0.1s",
              }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
            style={{ fontSize: "17px", lineHeight: 1.75, color: "var(--text-muted)", maxWidth: "460px", marginBottom: "44px" }}
          >
            From a clean landing page to a fully custom web system —
            we build with precision, speed, and real craftsmanship.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.68, ease: "easeOut" }}
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                padding: "13px 28px",
                background: "var(--accent)",
                color: "#09090E",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,169,110,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              ./start-project
            </a>
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                padding: "13px 28px",
                background: "transparent",
                color: "#64FFDA",
                border: "1px solid rgba(100,255,218,0.25)",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "border-color 0.2s, background 0.2s, transform 0.2s",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(100,255,218,0.55)"; e.currentTarget.style.background = "rgba(100,255,218,0.05)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(100,255,218,0.25)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              view_work.sh
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{
              marginTop: "56px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            {resolvedStats.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: "var(--accent)" }}>{s.val}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ════ RIGHT — Terminal window ════ */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="hero-terminal"
          style={{ position: "relative" }}
        >
          {/* Main terminal */}
          <div
            style={{
              background: "#0D1117",
              border: "1px solid rgba(100,255,218,0.15)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(100,255,218,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                background: "#161B22",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F57", display: "block" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FEBC2E", display: "block" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28C840", display: "block" }} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "#7A7A8A",
                  marginLeft: "12px",
                  letterSpacing: "0.05em",
                }}
              >
                elysian-cli — zsh
              </span>
            </div>

            {/* Terminal body */}
            <div
              style={{
                padding: "20px 24px 24px",
                fontFamily: "monospace",
                fontSize: "13px",
                lineHeight: 1.8,
                minHeight: "300px",
              }}
            >
              {termLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: lineColors[line.type] || "#7A7A8A",
                    whiteSpace: "pre",
                    fontSize: line.type === "cmd" ? "13px" : "12.5px",
                    fontWeight: line.type === "cmd" || line.type === "success" ? 600 : 400,
                  }}
                >
                  {line.text}
                </motion.div>
              ))}

              {/* Blinking cursor at end */}
              {visibleLines >= termLines.length && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <span style={{ color: "#64FFDA", fontFamily: "monospace", fontSize: "13px" }}>$</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "16px",
                      background: "#64FFDA",
                      opacity: cursorVisible ? 1 : 0,
                      transition: "opacity 0.1s",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Floating metric cards ── */}
          {[
            { label: "Performance", value: "98", color: "#4ade80", style: { top: "10%", right: "-72px" } },
            { label: "SEO Score", value: "100", color: "#64FFDA", style: { top: "42%", right: "-80px" } },
            { label: "Deploy time", value: "< 2min", color: "#C8A96E", style: { bottom: "18%", right: "-68px" } },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.0 + i * 0.25, duration: 0.5 }}
              className="metric-card"
              style={{
                position: "absolute",
                ...m.style,
                background: "#0D1117",
                border: `1px solid ${m.color}30`,
                borderRadius: "8px",
                padding: "8px 12px",
                minWidth: "100px",
                boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${m.color}10`,
              }}
            >
              <div style={{ fontSize: "10px", color: "#7A7A8A", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>{m.label}</div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: m.color, fontFamily: "monospace" }}>{m.value}</div>
            </motion.div>
          ))}

          {/* ── Floating tech stack pills ── */}
          {[
            { label: "Next.js 15", style: { top: "-18px", left: "15%" } },
            { label: "TypeScript", style: { top: "-18px", left: "48%" } },
            { label: "PostgreSQL", style: { bottom: "-18px", left: "18%" } },
            { label: "Tailwind v4", style: { bottom: "-18px", left: "52%" } },
          ].map((pill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: i < 2 ? -12 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.15, duration: 0.4 }}
              style={{
                position: "absolute",
                ...pill.style,
                padding: "4px 10px",
                background: "rgba(100,255,218,0.05)",
                border: "1px solid rgba(100,255,218,0.15)",
                borderRadius: "100px",
                fontSize: "11px",
                fontFamily: "monospace",
                color: "#64FFDA",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {pill.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll line ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#7A7A8A", letterSpacing: "0.15em", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(100,255,218,0.4), transparent)", animation: "scroll-line 2s ease-in-out infinite" }} />
      </motion.div>

      <style>{`
        @keyframes blink-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes scroll-line {
          0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
          100% { opacity: 0; transform: scaleY(1); transform-origin: bottom; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-terminal { display: none !important; }
          .hero-h1 { font-size: clamp(40px, 10vw, 64px) !important; }
        }
        @media (max-width: 600px) {
          .metric-card { display: none !important; }
        }
      `}</style>
    </section>
  );
}
