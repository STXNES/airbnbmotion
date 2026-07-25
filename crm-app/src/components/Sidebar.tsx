'use client';

import { LayoutDashboard, Database, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: isActive ? '#fff' : 'var(--text-muted)',
      fontWeight: 500,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    };
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={toggleSidebar}
        style={{
          display: 'block',
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'var(--bg-panel-solid)',
          border: '1px solid var(--border-color)',
          color: '#fff',
          padding: '10px',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        className="mobile-menu-btn"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{ 
          width: '260px', 
          background: 'var(--bg-panel)', 
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-color)', 
          padding: '32px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '32px',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 9998,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '20px', color: '#fff', margin: 0, fontFamily: 'var(--font-sora)' }}>
            Outreach<span style={{ color: 'var(--gold)' }}>Ops</span>
          </h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <a href="/" style={getLinkStyle('/')} onClick={() => setIsOpen(false)}>
            <LayoutDashboard size={18} /> Overview
          </a>
          <a href="/database" style={getLinkStyle('/database')} onClick={() => setIsOpen(false)}>
            <Database size={18} /> Neon Postgres
          </a>
          
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '12px' }}>QUICK LINKS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <a href="#" className="quick-link">
                Bienes Raíces
              </a>
              <a href="#" className="quick-link">
                Stripe
              </a>
              <a href="https://github.com/STXNES/airbnbmotion/actions" target="_blank" className="quick-link">
                GitHub Actions
              </a>
              <a href="https://mail.zoho.com" target="_blank" className="quick-link">
                Zoho Email
              </a>
            </div>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="sidebar-overlay"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 9997, backdropFilter: 'blur(2px)'
          }}
        />
      )}
    </>
  );
}
