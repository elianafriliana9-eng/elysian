"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "13px 16px",
    fontSize: "14px",
    color: "#F0EEE9",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const inputFocused: React.CSSProperties = {
    ...inputBase,
    borderColor: "rgba(200,169,110,0.6)",
    boxShadow: "0 0 0 3px rgba(200,169,110,0.08)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundImage:
          "radial-gradient(circle, rgba(200,169,110,0.05) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "26px",
                fontStyle: "italic",
                fontWeight: 600,
                color: "#C8A96E",
                letterSpacing: "-0.5px",
              }}
            >
              Elysian
            </span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#F0EEE9",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Project
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#7A7A8A", marginTop: "4px", fontFamily: "monospace" }}>
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "40px 36px",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(200,169,110,0.1)",
                border: "1px solid rgba(200,169,110,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "#C8A96E",
              }}
            >
              <Lock size={18} />
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#F0EEE9",
                letterSpacing: "-0.3px",
                marginBottom: "6px",
              }}
            >
              Sign in
            </h1>
            <p style={{ fontSize: "13px", color: "#7A7A8A" }}>
              Masuk ke dashboard admin Elysian Project
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#7A7A8A",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="admin@elysianproject.id"
                required
                style={focused === "email" ? inputFocused : inputBase}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#7A7A8A",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                required
                style={focused === "password" ? inputFocused : inputBase}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(252,129,129,0.08)",
                  border: "1px solid rgba(252,129,129,0.2)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#fc8181",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "13px",
                background: loading ? "rgba(200,169,110,0.5)" : "#C8A96E",
                color: "#09090E",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.2s, transform 0.2s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#b8973e";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#C8A96E";
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#7A7A8A" }}>
          Akun dibuat langsung dari Supabase dashboard
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #3A3A4A; }
      `}</style>
    </div>
  );
}
