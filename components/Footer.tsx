"use client";

export default function Footer() {
  const currentYear = 2026;

  const navColumns = [
    {
      heading: "Services",
      links: [
        { label: "Landing Page", href: "#services" },
        { label: "E-Commerce", href: "#services" },
        { label: "Complex System", href: "#services" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "Our Process", href: "#process" },
        { label: "Portfolio", href: "#work" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Get in Touch", href: "#contact" },
        { label: "Instagram", href: "https://instagram.com/elysianproject" },
        { label: "LinkedIn", href: "https://linkedin.com/company/elysianproject" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "64px 24px 32px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "80px",
            marginBottom: "60px",
          }}
          className="footer-top"
        >
          {/* Logo + tagline */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
              <span
                className="font-playfair"
                style={{
                  fontSize: "22px",
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: "var(--accent)",
                  letterSpacing: "-0.5px",
                }}
              >
                Elysian
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "var(--text)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Project
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                lineHeight: 1.65,
                maxWidth: "240px",
              }}
            >
              Crafting digital experiences that work — for businesses that mean it.
            </p>
          </div>

          {/* Nav columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
            className="footer-nav"
          >
            {navColumns.map((col) => (
              <div key={col.heading}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--text)",
                    marginBottom: "20px",
                  }}
                >
                  {col.heading}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={
                          link.href.startsWith("#")
                            ? (e) => {
                                e.preventDefault();
                                document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                              }
                            : undefined
                        }
                        target={!link.href.startsWith("#") ? "_blank" : undefined}
                        rel={!link.href.startsWith("#") ? "noopener noreferrer" : undefined}
                        style={{
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "28px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            © {currentYear} Elysian Project. All rights reserved.
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Made with ❤️ in Indonesia
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-top {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .footer-nav {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .footer-nav {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
