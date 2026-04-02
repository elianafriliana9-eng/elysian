"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, ChevronDown, ChevronUp, Plus, Trash2, Star } from "lucide-react";

type Feature = { id: number; text: string; sort_order: number };
type Plan = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  cta: string;
  is_popular: boolean;
  is_mobile: boolean;
  badge: string | null;
  addon: string | null;
  includes: string | null;
  has_stacks: boolean;
  sort_order: number;
  features?: Feature[];
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

export default function PricingPage() {
  const [items, setItems] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const sb = createClient();
    const { data: plans } = await sb.from("pricing_plans").select("*").order("sort_order");
    const { data: feats } = await sb.from("pricing_features").select("*").order("sort_order");
    const merged = (plans ?? []).map((p) => ({
      ...p,
      features: (feats ?? []).filter((f) => f.plan_id === p.id),
    }));
    setItems(merged);
    if (editing) {
      const updated = merged.find((p) => p.id === editing.id);
      if (updated) setEditing(updated);
    }
    setLoading(false);
  }

  function startEdit(p: Plan) {
    setEditing({ ...p });
    setExpanded(p.id);
  }

  async function savePlan() {
    if (!editing) return;
    setSaving(true);
    const sb = createClient();
    const { id, features, ...data } = editing;
    await sb.from("pricing_plans").update(data).eq("id", id);
    await loadData();
    setEditing(null);
    setSaving(false);
  }

  async function addFeature() {
    if (!editing || !newFeature.trim()) return;
    const sb = createClient();
    const maxOrder = (editing.features?.length ?? 0) + 1;
    await sb.from("pricing_features").insert({ plan_id: editing.id, text: newFeature.trim(), sort_order: maxOrder });
    setNewFeature("");
    await loadData();
  }

  async function deleteFeature(id: number) {
    const sb = createClient();
    await sb.from("pricing_features").delete().eq("id", id);
    await loadData();
  }

  if (loading) return <p style={{ color: "#7A7A8A", fontSize: "13px" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F0EEE9", marginBottom: "4px" }}>Pricing</h1>
        <p style={{ fontSize: "13px", color: "#7A7A8A" }}>Edit paket harga dan fitur di landing page</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((plan) => {
          const isExpanded = expanded === plan.id;
          const isEditing = editing?.id === plan.id;

          return (
            <div key={plan.id} style={{ background: "#111118", border: plan.is_popular ? "1px solid rgba(200,169,110,0.25)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#F0EEE9" }}>{plan.name}</span>
                    <span style={{ fontSize: "12px", color: "#7A7A8A" }}>· {plan.subtitle}</span>
                    {plan.is_popular && <Star size={12} fill="#C8A96E" color="#C8A96E" />}
                    {plan.badge && <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", background: "rgba(100,255,218,0.1)", color: "#64FFDA", fontFamily: "monospace" }}>{plan.badge}</span>}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#C8A96E" }}>{plan.price}</span>
                </div>
                <button onClick={() => { isEditing ? setEditing(null) : startEdit(plan); setExpanded(isExpanded && !isEditing ? null : plan.id); }}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => setExpanded(isExpanded ? null : plan.id)}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {isExpanded && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {isEditing ? (
                    <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={lbl}>Nama Paket</label>
                          <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>Subtitle</label>
                          <input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} style={inp} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={lbl}>Harga</label>
                          <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>CTA Button</label>
                          <input value={editing.cta} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} style={inp} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={lbl}>Badge (opsional)</label>
                          <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })} placeholder="e.g. NEW" style={inp} />
                        </div>
                        <div>
                          <label style={lbl}>Add-on note</label>
                          <input value={editing.addon ?? ""} onChange={(e) => setEditing({ ...editing, addon: e.target.value || null })} style={inp} />
                        </div>
                      </div>
                      <div>
                        <label style={lbl}>Includes note</label>
                        <input value={editing.includes ?? ""} onChange={(e) => setEditing({ ...editing, includes: e.target.value || null })} placeholder="e.g. Cloud server + domain included (year 1)" style={inp} />
                      </div>

                      {/* Fitur */}
                      <div>
                        <label style={lbl}>Fitur / Features</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
                          {editing.features?.map((f) => (
                            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <span style={{ flex: 1, fontSize: "13px", color: "#F0EEE9" }}>{f.text}</span>
                              <button onClick={() => deleteFeature(f.id)} style={{ background: "none", border: "none", color: "#7A7A8A", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#fc8181")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#7A7A8A")}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addFeature()}
                            placeholder="Tambah fitur..." style={{ ...inp, flex: 1 }} />
                          <button onClick={addFeature} style={{ padding: "10px 14px", borderRadius: "8px", border: "none", background: "rgba(200,169,110,0.15)", color: "#C8A96E", cursor: "pointer", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 600 }}>
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button onClick={() => setEditing(null)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#7A7A8A", fontSize: "13px", cursor: "pointer" }}>Batal</button>
                        <button onClick={savePlan} disabled={saving} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#C8A96E", color: "#09090E", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                          {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul style={{ paddingTop: "14px", display: "flex", flexDirection: "column", gap: "6px", listStyle: "none", padding: "14px 0 0" }}>
                      {plan.features?.map((f) => (
                        <li key={f.id} style={{ fontSize: "13px", color: "#7A7A8A", display: "flex", gap: "8px" }}>
                          <span style={{ color: "#C8A96E" }}>✓</span>{f.text}
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
