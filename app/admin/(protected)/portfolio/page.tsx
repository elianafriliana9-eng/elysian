"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Project = {
  id: number;
  name: string;
  type: string;
  description: string;
  year: string;
  is_visible: boolean;
  sort_order: number;
  tech?: string[];
};

const TYPE_OPTIONS = ["E-Commerce", "Web App", "Landing Page", "Complex System"];

const empty: Omit<Project, "id"> = {
  name: "", type: "E-Commerce", description: "", year: new Date().getFullYear().toString(),
  is_visible: true, sort_order: 0, tech: [],
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

const TYPE_COLOR: Record<string, string> = {
  "E-Commerce": "#63b3ed", "Web App": "#9a75ea", "Landing Page": "#48bb78", "Complex System": "#fc814a",
};

export default function PortfolioPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Project, "id"> & { id?: number; techStr?: string }>(empty);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const sb = createClient();
    const { data: projects } = await sb.from("portfolio_projects").select("*").order("sort_order");
    const { data: techs } = await sb.from("portfolio_tech").select("*").order("sort_order");
    const merged = (projects ?? []).map((p) => ({
      ...p,
      tech: (techs ?? []).filter((t) => t.project_id === p.id).map((t) => t.tech),
    }));
    setItems(merged);
    setLoading(false);
  }

  function openAdd() {
    setForm({ ...empty, techStr: "" });
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setForm({ ...p, techStr: p.tech?.join(", ") ?? "" });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    const sb = createClient();
    const { id, techStr, tech, ...data } = form;
    const techArr = (techStr ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    if (id) {
      const { error } = await sb.from("portfolio_projects").update(data).eq("id", id);
      if (error) {
        setSaveError(`Gagal menyimpan: ${error.message}`);
        setSaving(false);
        return;
      }
      await sb.from("portfolio_tech").delete().eq("project_id", id);
      if (techArr.length) {
        await sb.from("portfolio_tech").insert(techArr.map((t, i) => ({ project_id: id, tech: t, sort_order: i + 1 })));
      }
    } else {
      const { data: inserted, error } = await sb.from("portfolio_projects").insert(data).select().single();
      if (error) {
        setSaveError(`Gagal menyimpan: ${error.message}`);
        setSaving(false);
        return;
      }
      if (inserted && techArr.length) {
        await sb.from("portfolio_tech").insert(techArr.map((t, i) => ({ project_id: inserted.id, tech: t, sort_order: i + 1 })));
      }
    }

    await loadData();
    setShowForm(false);
    setSaving(false);
  }

  async function toggleVisible(p: Project) {
    const sb = createClient();
    await sb.from("portfolio_projects").update({ is_visible: !p.is_visible }).eq("id", p.id);
    setItems((prev) => prev.map((i) => i.id === p.id ? { ...i, is_visible: !i.is_visible } : i));
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus project ini?")) return;
    const sb = createClient();
    await sb.from("portfolio_projects").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F0EEE9", marginBottom: "4px" }}>Portfolio</h1>
          <p style={{ fontSize: "13px", color: "#7A7A8A" }}>{items.length} project</p>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "#C8A96E", color: "#09090E", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
          <Plus size={14} /> Tambah
        </button>
      </div>

      {loading ? <p style={{ color: "#7A7A8A", fontSize: "13px" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((p) => (
            <div key={p.id} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#F0EEE9" }}>{p.name}</span>
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", background: `${TYPE_COLOR[p.type]}20`, color: TYPE_COLOR[p.type], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {p.type}
                    </span>
                    <span style={{ fontSize: "12px", color: "#7A7A8A", marginLeft: "auto" }}>{p.year}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#7A7A8A", lineHeight: 1.6, marginBottom: "10px" }}>{p.description}</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {p.tech?.map((t) => (
                      <span key={t} style={{ fontSize: "11px", padding: "2px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", color: "#7A7A8A" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button onClick={() => toggleVisible(p)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: p.is_visible ? "#4ade80" : "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {p.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(p)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fc8181")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7A7A8A")}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0EEE9", marginBottom: "24px" }}>
              {form.id ? "Edit Project" : "Tambah Project"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={lbl}>Nama Project *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Tahun</label>
                  <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={inp} />
                </div>
              </div>
              <div>
                <label style={lbl}>Tipe</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...inp, appearance: "none" }}>
                  {TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Deskripsi *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div>
                <label style={lbl}>Tech Stack (pisahkan dengan koma)</label>
                <input value={form.techStr ?? ""} onChange={(e) => setForm({ ...form, techStr: e.target.value })} placeholder="Next.js, Tailwind, PostgreSQL" style={inp} />
              </div>
              <div>
                <label style={lbl}>Urutan</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} style={inp} />
              </div>
            </div>
            {saveError && (
              <div style={{ marginTop: "16px", padding: "10px 14px", background: "rgba(252,129,129,0.08)", border: "1px solid rgba(252,129,129,0.2)", borderRadius: "8px", fontSize: "13px", color: "#fc8181" }}>
                {saveError}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowForm(false); setSaveError(""); }} style={{ padding: "9px 20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#7A7A8A", fontSize: "13px", cursor: "pointer" }}>Batal</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#C8A96E", color: "#09090E", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
