"use client";

const DEFAULT_ITEMS = [
  "Landing Page",
  "E-Commerce",
  "Flutter Mobile App",
  "Web Application",
  "iOS & Android",
  "Custom CMS",
  "API Integration",
  "Dashboard",
  "Booking System",
  "SEO Optimization",
  "Cross-Platform",
  "Performance Tuning",
];

export default function MarqueeStrip({ items }: { items?: string[] }) {
  const resolvedItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const allItems = [...resolvedItems, ...resolvedItems]; // duplicate for seamless loop

  return (
    <div
      style={{
        background: "var(--accent)",
        overflow: "hidden",
        padding: "14px 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="animate-marquee">
        {allItems.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "18px",
              paddingRight: "18px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#09090E",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
            <span
              style={{
                color: "rgba(9, 9, 14, 0.4)",
                fontSize: "8px",
                flexShrink: 0,
              }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
