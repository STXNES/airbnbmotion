import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Fetch real data
  const rows = await sql`SELECT * FROM prospects ORDER BY id DESC`;
  
  // Calculate metrics
  const totalProspects = rows.length;
  const emailsSent = rows.filter(r => ['SENT', 'REPLIED', 'CLOSED'].includes(r.last_status)).length;
  const replies = rows.filter(r => r.reply_status === 'REPLIED' || r.last_status === 'REPLIED' || r.last_status === 'HOT_LEAD').length;
  const clients = rows.filter(r => r.client && r.client.toUpperCase() === 'YES').length;
  
  const sentPct = totalProspects > 0 ? ((emailsSent / totalProspects) * 100).toFixed(1) : '0';
  const replyPct = emailsSent > 0 ? ((replies / emailsSent) * 100).toFixed(1) : '0';

  // Get Hot Leads (Replied)
  const hotLeads = rows.filter(r => r.reply_status === 'REPLIED' || r.last_status === 'HOT_LEAD' || r.last_status === 'REPLIED').slice(0, 5);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Buenos días, Axell</h1>
          <p>Altus Real Estate — pipeline de propiedades y propietarios</p>
        </div>
        <div className="topbar-actions">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Buscar propiedad o propietario..." />
          </div>
          <button className="btn btn-outline">Exportar</button>
          <button className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo prospecto
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon" style={{background: 'var(--neutral-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8D98" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/></svg>
            </div>
          </div>
          <div className="kpi-val">{totalProspects}</div>
          <div className="kpi-label">Total Prospects — Active Database</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon" style={{background: 'var(--info-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
            </div>
          </div>
          <div className="kpi-val">{emailsSent}</div>
          <div className="kpi-label">Emails Sent — {sentPct}% Processed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon" style={{background: 'var(--warn-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
          </div>
          <div className="kpi-val">{replies}</div>
          <div className="kpi-label">Replies — {replyPct}% Response Rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon" style={{background: 'var(--ok-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
          </div>
          <div className="kpi-val">{clients}</div>
          <div className="kpi-label">Clients — {clients} Converted</div>
        </div>
      </div>

      <div className="two-col">
        <div className="panel" style={{marginBottom: 0}}>
          <div className="panel-head">
            <h2>Hot Leads</h2>
            <span className="hot-badge">{hotLeads.length} Recent</span>
          </div>
          
          {hotLeads.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {hotLeads.map((lead, i) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)'}}>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <div className="thumb" style={{width: 30, height: 30, fontSize: 11}}>{(lead.company || lead.email || '?').charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{fontSize: 13, fontWeight: 600}}>{lead.company || lead.email}</div>
                      <div style={{fontSize: 11, color: 'var(--text-dim)'}}>{lead.city || 'Unknown'}, {lead.state || ''}</div>
                    </div>
                  </div>
                  <div className="badge replied"><span className="dot"></span>HOT</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5C5E68" strokeWidth="1.5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <p>No recent replies detected.<br/>Keep pushing!</p>
            </div>
          )}
        </div>

        <div className="panel" style={{marginBottom: 0}}>
          <div className="panel-head">
            <h2>Conversion Funnel</h2>
          </div>
          <div className="funnel">
            
            <div className="funnel-row">
              <span className="stage">Total Prospects</span>
              <span className="count-inline">{totalProspects} (100%)</span>
            </div>
            <div className="funnel-track">
              <div className="funnel-fill" style={{'--w': '100%', background: 'linear-gradient(90deg,#5A5D68,#8B8D98)'} as any}></div>
            </div>

            <div className="funnel-row" style={{marginTop: '6px'}}>
              <span className="stage">Contacted</span>
              <span className="count-inline">{emailsSent} ({sentPct}%)</span>
            </div>
            <div className="funnel-track">
              <div className="funnel-fill" style={{'--w': `${Math.max(parseFloat(sentPct), 1)}%`, background: 'linear-gradient(90deg,#3B6FAE,#60A5FA)'} as any}></div>
            </div>

            <div className="funnel-row" style={{marginTop: '6px'}}>
              <span className="stage">Replied</span>
              <span className="count-inline">{replies} ({replyPct}%)</span>
            </div>
            <div className="funnel-track">
              <div className="funnel-fill" style={{'--w': `${Math.max(parseFloat(replyPct), 1)}%`, background: 'linear-gradient(90deg,#B8891F,#FBBF24)'} as any}></div>
            </div>

            <div className="funnel-row" style={{marginTop: '6px'}}>
              <span className="stage">Converted</span>
              <span className="count-inline">{clients} ({totalProspects > 0 ? (clients/totalProspects*100).toFixed(1) : 0}%)</span>
            </div>
            <div className="funnel-track">
              <div className="funnel-fill" style={{'--w': `${Math.max(totalProspects > 0 ? (clients/totalProspects*100) : 0, 1)}%`, background: 'linear-gradient(90deg,#2F9E5F,#4ADE80)'} as any}></div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
