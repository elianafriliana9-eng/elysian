"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",    href: "/admin",              icon: LayoutDashboard },
  { label: "Services",     href: "/admin/services",     icon: ShoppingBag },
  { label: "Portfolio",    href: "/admin/portfolio",    icon: FileText },
  { label: "Pricing",      href: "/admin/pricing",      icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Messages",     href: "/admin/messages",     icon: MessageSquare },
  { label: "Settings",     href: "/admin/settings",     icon: Settings },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "20px",
              fontStyle: "italic",
              fontWeight: 600,
              color: "#C8A96E",
            }}
          >
            Elysian
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 300,
              color: "#F0EEE9",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Project
          </span>
        </div>
        <p
          style={{
            fontSize: "10px",
            color: "#7A7A8A",
            marginTop: "2px",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        >
          ADMIN PANEL
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <button
                key={href}
                onClick={() => {
                  router.push(href);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: active
                    ? "rgba(200,169,110,0.12)"
                    : "transparent",
                  color: active ? "#C8A96E" : "#7A7A8A",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "#F0EEE9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#7A7A8A";
                  }
                }}
              >
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
                {active && (
                  <ChevronRight
                    size={13}
                    style={{ marginLeft: "auto", opacity: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User + Logout */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.03)",
            marginBottom: "8px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#7A7A8A",
              marginBottom: "2px",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            Signed in as
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#F0EEE9",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            color: "#7A7A8A",
            fontSize: "13px",
            cursor: "pointer",
            width: "100%",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(252,129,129,0.08)";
            e.currentTarget.style.color = "#fc8181";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#7A7A8A";
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#09090E" }}>
      {/* Desktop sidebar */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: "220px",
          flexShrink: 0,
          background: "#0D0D14",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 48,
          }}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className="admin-sidebar-mobile"
        style={{
          width: "220px",
          background: "#0D0D14",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 49,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <main
        className="admin-main"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* Top bar */}
        <header
          style={{
            height: "60px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0D0D14",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#7A7A8A",
              cursor: "pointer",
              padding: "4px",
              display: "none",
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div
            className="admin-breadcrumb"
            style={{ fontSize: "13px", color: "#7A7A8A", fontFamily: "monospace" }}
          >
            {navItems.find((n) =>
              n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
            )?.label ?? "Admin"}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "12px",
              color: "#7A7A8A",
              textDecoration: "none",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A96E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7A7A8A")}
          >
            view site →
          </a>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: "32px 24px", overflowY: "auto" }}>
          {children}
        </div>
      </main>

      <style>{`
        .admin-sidebar-mobile { display: none !important; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-sidebar-mobile  { display: block !important; }
          .admin-hamburger       { display: flex !important; }
          .admin-main            { margin-left: 0 !important; }
        }
        @media (min-width: 769px) {
          .admin-main { margin-left: 220px; }
        }
      `}</style>
    </div>
  );
}
