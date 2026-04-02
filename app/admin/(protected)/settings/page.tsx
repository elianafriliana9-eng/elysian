"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle } from "lucide-react";

type Setting = { key: string; value: string };

const FIELDS: { key: string; label: string; placeholder: string; type?: string }[] = [
  { key: "email",         label: "Email",            placeholder: "hello@elysianproject.id",            type: "email" },
  { key: "whatsapp",      label: "WhatsApp (format: 62812...)", placeholder: "6281234567890" },
  { key: "instagram_url", label: "Instagram URL",    placeholder: "https://instagram.com/elysianproject" },
  { key: "linkedin_url",  label: "LinkedIn URL",     placeholder: "https://linkedin.com/company/elysianproject" },
  { key: "footer_tagline",label: "Footer Tagline",   placeholder: "Crafting digital experiences..." },
  { key: "hero_badge",    label: "Hero Status Badge",placeholder: "ACCEPTING PROJECTS" },
];

const inp: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", borderWidth: "1px", borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px",
  fontSize: "13px", color: "#F0EEE9", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const sb = createClient();
    const { data } = await sb.from("site_settings").select("*");
    const map: Record<string, string> = {};
    (data as Setting[] ?? []).forEach((s) => { map[s.key] = s.value; });
    setSettings(map);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const sb = createClient();
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await sb.from("site_settings").upsert(upserts, { onConflict: "key" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <p style={{ color: "#7A7A8A", fontSize: "13px" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "620px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F0EEE9", marginBottom: "4px" }}>Settings</h1>
        <p style={{ fontSize: "13px", color: "#7A7A8A" }}>Konfigurasi global konten landing page</p>
      </div>

      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {FIELDS.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7A7A8A", marginBottom: "8px" }}>
                {label}
              </label>
              <input
                type={type ?? "text"}
                value={settings[key] ?? ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                onFocus={() => setFocused(key)}
                onBlur={() => setFocused(null)}
                placeholder={placeholder}
                style={focused === key ? { ...inp, borderColor: "rgba(200,169,110,0.5)" } : inp}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
          {saved && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4ade80" }}>
              <CheckCircle size={14} /> Tersimpan
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 22px", borderRadius: "8px", border: "none", background: saving ? "rgba(200,169,110,0.5)" : "#C8A96E", color: "#09090E", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "#b8973e"; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = "#C8A96E"; }}
          >
            <Save size={14} />
            {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>
      </div>
    </div>
  );
}
