import { neon } from '@neondatabase/serverless';
import { EditableRow } from "@/components/EditableRow";

// Ensure this page is dynamically rendered so it always fetches fresh data from DB
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
  const hotLeads = rows.filter(r => r.reply_status === 'REPLIED' || r.last_status === 'HOT_LEAD' || r.last_status === 'REPLIED').slice(0, 8);

  return (
    <>
      <div className="topbar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px'}}>
        <div>
          <h1 style={{fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, marginBottom: '6px'}}>Buenos días, Axell</h1>
          <p style={{color: 'var(--text-muted)', fontSize: '14.5px'}}>Panel de outreach — pipeline de propiedades y propietarios</p>
        </div>
        <div className="topbar-actions" style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px'}}>
          <div className="search" style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '9px', padding: '9px 14px', width: '260px'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Buscar propiedad o propietario..." style={{background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '13.5px', width: '100%'}} />
          </div>
          <button className="btn btn-outline">Exportar</button>
          <button className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo prospecto
          </button>
        </div>
      </div>

      <div className="kpi-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
        <div className="kpi-card" style={{background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '20px'}}>
          <div className="kpi-top" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px'}}>
            <div className="kpi-icon" style={{width: '34px', height: '34px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8D98" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/></svg>
            </div>
          </div>
          <div className="kpi-val" style={{fontFamily: 'var(--font-sora)', fontSize: '26px', fontWeight: 600}}>{totalProspects}</div>
          <div className="kpi-label" style={{color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '4px'}}>Total Prospects — Active Database</div>
        </div>
        <div className="kpi-card" style={{background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '20px'}}>
          <div className="kpi-top" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px'}}>
            <div className="kpi-icon" style={{width: '34px', height: '34px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--info-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
            </div>
          </div>
          <div className="kpi-val" style={{fontFamily: 'var(--font-sora)', fontSize: '26px', fontWeight: 600}}>{emailsSent}</div>
          <div className="kpi-label" style={{color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '4px'}}>Emails Sent — {sentPct}% Processed</div>
        </div>
        <div className="kpi-card" style={{background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '20px'}}>
          <div className="kpi-top" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px'}}>
            <div className="kpi-icon" style={{width: '34px', height: '34px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warn-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
          </div>
          <div className="kpi-val" style={{fontFamily: 'var(--font-sora)', fontSize: '26px', fontWeight: 600}}>{replies}</div>
          <div className="kpi-label" style={{color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '4px'}}>Replies — {replyPct}% Response Rate</div>
        </div>
        <div className="kpi-card" style={{background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '20px'}}>
          <div className="kpi-top" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px'}}>
            <div className="kpi-icon" style={{width: '34px', height: '34px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ok-bg)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
          </div>
          <div className="kpi-val" style={{fontFamily: 'var(--font-sora)', fontSize: '26px', fontWeight: 600}}>{clients}</div>
          <div className="kpi-label" style={{color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '4px'}}>Clients — {clients} Converted</div>
        </div>
      </div>

      <div className="two-col" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px'}}>
        <div className="panel" style={{background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '22px 24px'}}>
          <div className="panel-head" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{fontFamily: 'var(--font-sora)', fontSize: '15.5px', fontWeight: 600}}>Hot Leads</h2>
            <span style={{fontSize: '11.5px', background: 'var(--neutral-bg)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: '999px', fontWeight: 600}}>{hotLeads.length} Recent</span>
          </div>
          
          {hotLeads.length > 0 ? (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
                <tbody>
                  {hotLeads.map((lead, i) => (
                    <EditableRow key={i} lead={lead as any} showNotes={true} showCountry={false} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '46px 20px', color: 'var(--text-dim)', textAlign: 'center', fontSize: '13.5px'}}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5C5E68" strokeWidth="1.5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <p>No recent replies detected.<br/>Keep pushing!</p>
            </div>
          )}
        </div>

        <div className="panel" style={{background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '22px 24px'}}>
          <div className="panel-head" style={{marginBottom: '20px'}}>
            <h2 style={{fontFamily: 'var(--font-sora)', fontSize: '15.5px', fontWeight: 600}}>Conversion Funnel</h2>
          </div>
          <div className="funnel" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            
            <div className="funnel-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span className="stage" style={{fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500}}>Total Prospects</span>
              <span className="count-inline" style={{fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-jetbrains)'}}>{totalProspects} (100%)</span>
            </div>
            <div className="funnel-track" style={{height: '26px', background: 'var(--neutral-bg)', borderRadius: '6px', overflow: 'hidden', position: 'relative'}}>
              <div className="funnel-fill" style={{height: '100%', borderRadius: '6px', width: '100%', background: 'linear-gradient(90deg,#5A5D68,#8B8D98)'}}></div>
            </div>

            <div className="funnel-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px'}}>
              <span className="stage" style={{fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500}}>Contacted</span>
              <span className="count-inline" style={{fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-jetbrains)'}}>{emailsSent} ({sentPct}%)</span>
            </div>
            <div className="funnel-track" style={{height: '26px', background: 'var(--neutral-bg)', borderRadius: '6px', overflow: 'hidden', position: 'relative'}}>
              <div className="funnel-fill" style={{height: '100%', borderRadius: '6px', width: `${Math.max(parseFloat(sentPct), 1)}%`, background: 'linear-gradient(90deg,#3B6FAE,#60A5FA)'}}></div>
            </div>

            <div className="funnel-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px'}}>
              <span className="stage" style={{fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500}}>Replied</span>
              <span className="count-inline" style={{fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-jetbrains)'}}>{replies} ({replyPct}%)</span>
            </div>
            <div className="funnel-track" style={{height: '26px', background: 'var(--neutral-bg)', borderRadius: '6px', overflow: 'hidden', position: 'relative'}}>
              <div className="funnel-fill" style={{height: '100%', borderRadius: '6px', width: `${Math.max(parseFloat(replyPct), 1)}%`, background: 'linear-gradient(90deg,#B8891F,#FBBF24)'}}></div>
            </div>

            <div className="funnel-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px'}}>
              <span className="stage" style={{fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500}}>Converted</span>
              <span className="count-inline" style={{fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-jetbrains)'}}>{clients} ({totalProspects > 0 ? (clients/totalProspects*100).toFixed(1) : 0}%)</span>
            </div>
            <div className="funnel-track" style={{height: '26px', background: 'var(--neutral-bg)', borderRadius: '6px', overflow: 'hidden', position: 'relative'}}>
              <div className="funnel-fill" style={{height: '100%', borderRadius: '6px', width: `${Math.max(totalProspects > 0 ? (clients/totalProspects*100) : 0, 1)}%`, background: 'linear-gradient(90deg,#2F9E5F,#4ADE80)'}}></div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
