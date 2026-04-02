"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, ChevronUp, Inbox } from "lucide-react";

type Submission = {
  id: number;
  name: string;
  email: string;
  business: string | null;
  project_type: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
};

const STATUS_COLOR: Record<string, string> = {
  new: "#C8A96E",
  read: "#64FFDA",
  replied: "#4ade80",
  archived: "#7A7A8A",
};

const PROJECT_LABEL: Record<string, string> = {
  "landing-page": "Landing Page",
  ecommerce: "E-Commerce",
  "flutter-app": "Flutter App",
  "complex-system": "Complex System",
  "not-sure": "Not sure yet",
};

export default function MessagesPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const sb = createClient();
    const { data } = await sb
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  async function setStatus(id: number, status: string) {
    const sb = createClient();
    await sb.from("contact_submissions").update({ status }).eq("id", id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: status as Submission["status"] } : i))
    );
  }

  async function deleteMsg(id: number) {
    if (!confirm("Hapus pesan ini?")) return;
    const sb = createClient();
    await sb.from("contact_submissions").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const newCount = items.filter((i) => i.status === "new").length;

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F0EEE9", marginBottom: "4px" }}>Messages</h1>
          <p style={{ fontSize: "13px", color: "#7A7A8A" }}>
            {newCount > 0 ? <span style={{ color: "#C8A96E" }}>{newCount} pesan baru</span> : "Semua pesan sudah dibaca"}
            {" · "}{items.length} total
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#7A7A8A", fontSize: "13px" }}>Loading...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#7A7A8A" }}>
          <Inbox size={32} style={{ marginBottom: "12px", opacity: 0.4 }} />
          <p style={{ fontSize: "14px" }}>Belum ada pesan masuk</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.status === "new" ? "rgba(200,169,110,0.04)" : "#111118",
                border: item.status === "new" ? "1px solid rgba(200,169,110,0.2)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Row */}
              <div
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <div
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, color: "#C8A96E", flexShrink: 0,
                  }}
                >
                  {item.name?.[0]?.toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#F0EEE9" }}>{item.name}</span>
                    {item.project_type && (
                      <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "#7A7A8A", fontFamily: "monospace" }}>
                        {PROJECT_LABEL[item.project_type] ?? item.project_type}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "12px", color: "#7A7A8A" }}>{item.email}{item.business ? ` · ${item.business}` : ""}</p>
                </div>

                <span
                  style={{
                    fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px",
                    background: `${STATUS_COLOR[item.status]}18`, color: STATUS_COLOR[item.status],
                    textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace", flexShrink: 0,
                  }}
                >
                  {item.status}
                </span>

                <span style={{ fontSize: "11px", color: "#7A7A8A", whiteSpace: "nowrap", fontFamily: "monospace", flexShrink: 0 }}>
                  {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}
                </span>

                {expanded === item.id ? <ChevronUp size={15} color="#7A7A8A" /> : <ChevronDown size={15} color="#7A7A8A" />}
              </div>

              {/* Expanded */}
              {expanded === item.id && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ fontSize: "14px", color: "#F0EEE9", lineHeight: 1.7, padding: "16px 0", whiteSpace: "pre-wrap" }}>
                    {item.message}
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(["new", "read", "replied", "archived"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(item.id, s)}
                        style={{
                          padding: "6px 14px", borderRadius: "6px", border: "1px solid",
                          borderColor: item.status === s ? STATUS_COLOR[s] : "rgba(255,255,255,0.1)",
                          background: item.status === s ? `${STATUS_COLOR[s]}18` : "transparent",
                          color: item.status === s ? STATUS_COLOR[s] : "#7A7A8A",
                          fontSize: "12px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                          transition: "all 0.15s",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                    <div style={{ flex: 1 }} />
                    <a
                      href={`mailto:${item.email}`}
                      style={{ padding: "6px 14px", borderRadius: "6px", background: "rgba(200,169,110,0.1)", color: "#C8A96E", fontSize: "12px", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(200,169,110,0.2)" }}
                    >
                      Reply via Email →
                    </a>
                    <button
                      onClick={() => deleteMsg(item.id)}
                      style={{ padding: "6px 14px", borderRadius: "6px", background: "transparent", color: "#7A7A8A", fontSize: "12px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#fc8181"; e.currentTarget.style.borderColor = "rgba(252,129,129,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#7A7A8A"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
