import { createClient } from "@/lib/supabase/server";
import {
  MessageSquare,
  Star,
  ShoppingBag,
  FileText,
} from "lucide-react";

async function getStats() {
  const supabase = await createClient();

  const [messages, testimonials, portfolio, services] = await Promise.all([
    supabase.from("contact_submissions").select("id, status", { count: "exact" }),
    supabase.from("testimonials").select("id", { count: "exact" }),
    supabase.from("portfolio_projects").select("id", { count: "exact" }),
    supabase.from("services").select("id", { count: "exact" }),
  ]);

  const newMessages =
    messages.data?.filter((m) => m.status === "new").length ?? 0;

  return {
    totalMessages: messages.count ?? 0,
    newMessages,
    testimonials: testimonials.count ?? 0,
    portfolio: portfolio.count ?? 0,
    services: services.count ?? 0,
  };
}

async function getRecentMessages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("id, name, email, project_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

export default async function AdminDashboard() {
  const [stats, recentMessages] = await Promise.all([
    getStats(),
    getRecentMessages(),
  ]);

  const statCards = [
    {
      label: "New Messages",
      value: stats.newMessages,
      total: `${stats.totalMessages} total`,
      icon: MessageSquare,
      urgent: stats.newMessages > 0,
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      total: "on site",
      icon: Star,
      urgent: false,
    },
    {
      label: "Portfolio",
      value: stats.portfolio,
      total: "projects",
      icon: FileText,
      urgent: false,
    },
    {
      label: "Services",
      value: stats.services,
      total: "active",
      icon: ShoppingBag,
      urgent: false,
    },
  ];

  const statusColor: Record<string, string> = {
    new: "#C8A96E",
    read: "#64FFDA",
    replied: "#4ade80",
    archived: "#7A7A8A",
  };

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#F0EEE9",
            letterSpacing: "-0.3px",
            marginBottom: "4px",
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: "13px", color: "#7A7A8A" }}>
          Overview konten dan pesan masuk Elysian Project
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
        className="admin-stats-grid"
      >
        {statCards.map(({ label, value, total, icon: Icon, urgent }) => (
          <div
            key={label}
            style={{
              background: "#111118",
              border: urgent
                ? "1px solid rgba(200,169,110,0.3)"
                : "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#7A7A8A", fontWeight: 500 }}>
                {label}
              </span>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: urgent
                    ? "rgba(200,169,110,0.1)"
                    : "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: urgent ? "#C8A96E" : "#7A7A8A",
                }}
              >
                <Icon size={15} />
              </div>
            </div>
            <p
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: urgent ? "#C8A96E" : "#F0EEE9",
                lineHeight: 1,
                marginBottom: "4px",
                fontFamily: "monospace",
              }}
            >
              {value}
            </p>
            <p style={{ fontSize: "11px", color: "#7A7A8A" }}>{total}</p>
          </div>
        ))}
      </div>

      {/* Recent messages */}
      <div
        style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#F0EEE9" }}>
            Pesan Terbaru
          </h2>
          <a
            href="/admin/messages"
            style={{
              fontSize: "12px",
              color: "#C8A96E",
              textDecoration: "none",
              fontFamily: "monospace",
            }}
          >
            lihat semua →
          </a>
        </div>

        {recentMessages.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "#7A7A8A", fontSize: "13px" }}>
            Belum ada pesan masuk
          </div>
        ) : (
          <div>
            {recentMessages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  padding: "16px 24px",
                  borderBottom:
                    i < recentMessages.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(200,169,110,0.1)",
                    border: "1px solid rgba(200,169,110,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#C8A96E",
                    flexShrink: 0,
                  }}
                >
                  {msg.name?.[0]?.toUpperCase() ?? "?"}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#F0EEE9",
                      marginBottom: "2px",
                    }}
                  >
                    {msg.name}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#7A7A8A",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {msg.email}
                  </p>
                </div>

                {/* Project type */}
                {msg.project_type && (
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.04)",
                      color: "#7A7A8A",
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {msg.project_type}
                  </span>
                )}

                {/* Status */}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: `${statusColor[msg.status] ?? "#7A7A8A"}18`,
                    color: statusColor[msg.status] ?? "#7A7A8A",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "monospace",
                    flexShrink: 0,
                  }}
                >
                  {msg.status}
                </span>

                {/* Time */}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#7A7A8A",
                    whiteSpace: "nowrap",
                    fontFamily: "monospace",
                  }}
                >
                  {new Date(msg.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
