"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";

type Testimonial = {
  id: number;
  quote: string;
  author_name: string;
  author_role: string;
  rating: number;
  is_visible: boolean;
  sort_order: number;
};

const empty: Omit<Testimonial, "id"> = {
  quote: "", author_name: "", author_role: "", rating: 5, is_visible: true, sort_order: 0,
};

const inp: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", borderWidth: "1px", borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px",
  fontSize: "13px", color: "#F0EEE9", outline: "none", boxSizing: "border-box",
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, "id"> & { id?: number }>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const sb = createClient();
    const { data } = await sb.from("testimonials").select("*").order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  }

  function openAdd() { setForm(empty); setShowForm(true); }
  function openEdit(t: Testimonial) { setForm(t); setShowForm(true); }

  async function handleSave() {
    setSaving(true);
    const sb = createClient();
    const { id, ...data } = form;
    if (id) {
      await sb.from("testimonials").update(data).eq("id", id);
    } else {
      await sb.from("testimonials").insert(data);
    }
    await loadData();
    setShowForm(false);
    setSaving(false);
  }

  async function toggleVisible(t: Testimonial) {
    const sb = createClient();
    await sb.from("testimonials").update({ is_visible: !t.is_visible }).eq("id", t.id);
    setItems((prev) => prev.map((i) => i.id === t.id ? { ...i, is_visible: !i.is_visible } : i));
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus testimonial ini?")) return;
    const sb = createClient();
    await sb.from("testimonials").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F0EEE9", marginBottom: "4px" }}>Testimonials</h1>
          <p style={{ fontSize: "13px", color: "#7A7A8A" }}>{items.length} testimonial</p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "#C8A96E", color: "#09090E", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {loading ? <p style={{ color: "#7A7A8A", fontSize: "13px" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((t) => (
            <div key={t.id} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={12} fill="#C8A96E" color="#C8A96E" />)}
                  </div>
                  <p style={{ fontSize: "14px", color: "#F0EEE9", lineHeight: 1.65, marginBottom: "10px", fontStyle: "italic" }}>
                    "{t.quote}"
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#C8A96E" }}>{t.author_name}</p>
                  <p style={{ fontSize: "12px", color: "#7A7A8A" }}>{t.author_role}</p>
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button onClick={() => toggleVisible(t)} title={t.is_visible ? "Sembunyikan" : "Tampilkan"}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: t.is_visible ? "#4ade80" : "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {t.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(t)}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(t.id)}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7A7A8A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
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

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0EEE9", marginBottom: "24px" }}>
              {form.id ? "Edit Testimonial" : "Tambah Testimonial"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A7A8A", marginBottom: "6px" }}>Quote *</label>
                <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  rows={4} style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A7A8A", marginBottom: "6px" }}>Nama *</label>
                  <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} style={inp} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A7A8A", marginBottom: "6px" }}>Role *</label>
                  <input value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} style={inp} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A7A8A", marginBottom: "6px" }}>Rating (1–5)</label>
                  <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} style={inp} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A7A8A", marginBottom: "6px" }}>Urutan</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} style={inp} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "9px 20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#7A7A8A", fontSize: "13px", cursor: "pointer" }}>
                Batal
              </button>
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
