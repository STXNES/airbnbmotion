'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="mobile-header">
        <div className="brand" style={{fontFamily: 'var(--font-sora)', fontSize: '18px'}}>Outreach<span style={{color: 'var(--gold)'}}>Ops</span></div>
        <button className="hamburger" onClick={toggleSidebar}>☰</button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{
        width: '250px', flexShrink: 0, background: 'var(--bg-panel-solid)',
        borderRight: '1px solid var(--border-color)',
        padding: '26px 18px', display: 'flex', flexDirection: 'column', gap: '28px',
        height: '100vh', position: 'sticky', top: 0
      }}>
        <div className="brand" style={{fontFamily: 'var(--font-sora)', fontSize: '18px'}}>Outreach<span style={{color: 'var(--gold)'}}>Ops</span></div>

        <div>
          <div style={{fontSize: '10.5px', letterSpacing: '.1em', color: 'var(--text-dim)', fontFamily: 'var(--font-jetbrains)', padding: '0 12px', marginBottom: '8px', textTransform: 'uppercase'}}>Menú</div>
          <nav style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
            <a href="/" className={`sidebar-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              Overview
            </a>
            <a href="/database" className={`sidebar-link ${pathname === '/database' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              Prospectos
            </a>
            <a href="#" className="sidebar-link">
              Videos entregados
            </a>
            <a href="#" className="sidebar-link">
              Facturación
            </a>
            <a href="#" className="sidebar-link">
              Configuración
            </a>
          </nav>
        </div>

        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px'}}>
          <div style={{fontSize: '10.5px', letterSpacing: '.1em', color: 'var(--text-dim)', fontFamily: 'var(--font-jetbrains)', padding: '0 12px', marginBottom: '8px', textTransform: 'uppercase'}}>Accesos rápidos</div>
          <a className="quick-link" href="https://www.airbnbmotion.studio/" target="_blank" style={{fontSize: '13px', color: 'var(--text-dim)', padding: '6px 12px', textDecoration: 'none'}}>Bienes Raíces</a>
          <a className="quick-link" href="#" style={{fontSize: '13px', color: 'var(--text-dim)', padding: '6px 12px', textDecoration: 'none'}}>Stripe</a>
          <a className="quick-link" href="https://github.com/STXNES/airbnbmotion/actions" target="_blank" style={{fontSize: '13px', color: 'var(--text-dim)', padding: '6px 12px', textDecoration: 'none'}}>GitHub Actions</a>
          <a className="quick-link" href="https://mail.zoho.com" target="_blank" style={{fontSize: '13px', color: 'var(--text-dim)', padding: '6px 12px', textDecoration: 'none'}}>Zoho Mail</a>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
