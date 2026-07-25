import type { Metadata } from "next";
import "./globals.css";
import { LayoutDashboard, Users, Zap, Settings, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AirbnbMotion CRM HQ",
  description: "Next.js Command Center for Outreach Ops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          
          {/* Sidebar */}
          <aside style={{ width: '280px', background: 'var(--bg-panel-solid)', borderRight: '1px solid var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#EDEFF3' }}>
                Airbnb<span style={{ color: 'var(--gold)' }}>Motion</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>
                Outreach Ops
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 500 }}>
                <LayoutDashboard size={18} /> Overview
              </a>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>
                <Users size={18} /> Full Database
              </a>
              
              <div style={{ marginTop: '24px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Quick Links
              </div>
              
              <a href="https://mail.zoho.com" target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', background: 'var(--bg-main)' }}>
                <span>📧 Zoho Mail</span> <ArrowUpRight size={14} />
              </a>
              <a href="https://github.com/STXNES/airbnbmotion/actions" target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', background: 'var(--bg-main)' }}>
                <span>🚀 GitHub Actions</span> <ArrowUpRight size={14} />
              </a>
            </nav>

            <div style={{ marginTop: 'auto' }}>
              <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Zap size={16} /> AI Assistant (Soon)
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '4px' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Welcome back to your command center.</p>
              </div>
              <div className="badge badge-gold">
                LIVE ON VERCEL
              </div>
            </div>
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}
