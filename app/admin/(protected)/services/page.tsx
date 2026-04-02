"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

type ServicePoint = { id: number; text: string; sort_order: number };
type Service = {
  id: number;
  title: string;
  price: string;
  timeline: string;
  badge: string | null;
  addon: string | null;
  includes: string | null;
  has_stacks: boolean;
  is_active: boolean;
  sort_order: number;
  points?: ServicePoint[];
};

const inp: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", borderWidth: "1px", borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px",
  fontSize: "13px", color: "#F0EEE9", outline: "none", boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.1em", color: "#7A7A8A", marginBottom: "6px",
};

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPoint, setNewPoint] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const sb = createClient();
    const { data: svcs } = await sb.from("services").select("*").order("sort_order");
    const { data: pts } = await sb.from("service_points").select("*").order("sort_order");
    const merged = (svcs ?? []).map((s) => ({
      ...s,
      points: (pts ?? []).filter((p) => p.service_id === s.id),
    }));
    setItems(merged);
    if (editing) {
      const updated = merged.find((s) => s.id === editing.id);
      if (updated) setEditing(updated);
    }
    setLoading(false);
  }

  function startEdit(s: Service) {
    setEditing({ ...s });
    setExpanded(s.id);
  }

  async function saveService() {
    if (!editing) return;
    setSaving(true);
    const sb = createClient();
    const { id, points, ...data } = editing;
    await sb.from("services").update(data).eq("id", id);
    await loadData();
    setEditing(null);
    setSaving(false);
  }

  async function addPoint() {
    if (!editing || !newPoint.trim()) return;
    const sb = createClient();
    const maxOrder = (editing.points?.length ?? 0) + 1;
    await sb.from("service_points").insert({ service_id: editing.id, text: newPoint.trim(), sort_order: maxOrder });
    setNewPoint("");
    await loadData();
  }

  async function deletePoint(id: number) {
    const sb = createClient();
    await sb.from("service_points").delete().eq("id", id);
    await loadData();
  }

  if (loading) return <p style={{ color: "#7A7A8A", fontSize: "13px" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F0EEE9", marginBottom: "4px" }}>Services</h1>
        <p style={{ fontSize: "13px", color: "#7A7A8A" }}>Edit konten kartu layanan di landing page</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((svc) => {
          const isExpanded = expanded === svc.id;
          const isEditing = editing?.id === svc.id;

          return (
            <div key={svc.id} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#F0EEE9" }}>{svc.title}</span>
                    {svc.badge && <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", background: "rgba(100,255,218,0.1)", color: "#64FFDA", fontFamily: "monospace" }}>{svc.badge}</span>}
                  </div>
                  <span style={{ fontSize: "12px", color: "#C8A96E" }}>{svc.price}</span>
                  <span style={{ fontSize: "12px", color: "#7A7A8A" }}> · {svc.timeline}</span>
                </div>
                <button onClick={() => { isEditing ? setEditing(null) : startEdit(svc); setExpanded(isExpanded && !isEditing ? null : svc.id); }}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => setExpanded(isExpanded ? null : svc.id)}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {isEditing ? (
                    <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={lbl}>Judul</label>
                          <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>Harga</label>
                          <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} style={inp} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={lbl}>Timeline</label>
                          <input value={editing.timeline} onChange={(e) => setEditing({ ...editing, timeline: e.target.value })} style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>Badge (opsional)</label>
                          <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })} placeholder="e.g. NEW" style={inp} />
                        </div>
                      </div>
                      <div>
                        <label style={lbl}>Add-on note (opsional)</label>
                        <input value={editing.addon ?? ""} onChange={(e) => setEditing({ ...editing, addon: e.target.value || null })} placeholder="e.g. + Custom domain available" style={inp} />
                      </div>
                      <div>
                        <label style={lbl}>Includes note (opsional)</label>
                        <input value={editing.includes ?? ""} onChange={(e) => setEditing({ ...editing, includes: e.target.value || null })} placeholder="e.g. Cloud server + domain included (year 1)" style={inp} />
                      </div>

                      {/* Points */}
                      <div>
                        <label style={lbl}>Bullet Points</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
                          {editing.points?.map((pt) => (
                            <div key={pt.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <span style={{ flex: 1, fontSize: "13px", color: "#F0EEE9" }}>{pt.text}</span>
                              <button onClick={() => deletePoint(pt.id)} style={{ background: "none", border: "none", color: "#7A7A8A", cursor: "pointer", padding: "2px" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#fc8181")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#7A7A8A")}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input value={newPoint} onChange={(e) => setNewPoint(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addPoint()}
                            placeholder="Tambah bullet point..." style={{ ...inp, flex: 1 }} />
                          <button onClick={addPoint} style={{ padding: "10px 14px", borderRadius: "8px", border: "none", background: "rgba(200,169,110,0.15)", color: "#C8A96E", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button onClick={() => setEditing(null)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#7A7A8A", fontSize: "13px", cursor: "pointer" }}>Batal</button>
                        <button onClick={saveService} disabled={saving} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#C8A96E", color: "#09090E", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                          {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul style={{ paddingTop: "14px", display: "flex", flexDirection: "column", gap: "6px", listStyle: "none", padding: "14px 0 0" }}>
                      {svc.points?.map((pt) => (
                        <li key={pt.id} style={{ fontSize: "13px", color: "#7A7A8A", display: "flex", gap: "8px" }}>
                          <span style={{ color: "#C8A96E" }}>✦</span>{pt.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
