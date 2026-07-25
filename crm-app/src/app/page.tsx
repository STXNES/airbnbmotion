import { Users, Mail, MessageSquare, Briefcase } from "lucide-react";
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

  const metrics = [
    { label: "Total Prospects", value: totalProspects.toString(), delta: "Active Database", icon: <Users size={20} className="text-gray-400" /> },
    { label: "Emails Sent", value: emailsSent.toString(), delta: `${sentPct}% Processed`, icon: <Mail size={20} className="text-blue-400" /> },
    { label: "Replies", value: replies.toString(), delta: `↑ ${replyPct}% Response Rate`, icon: <MessageSquare size={20} className="text-green-400" /> },
    { label: "Clients", value: clients.toString(), delta: `${clients} Converted`, icon: <Briefcase size={20} className="text-yellow-500" /> },
  ];

  // Get Hot Leads (Replied)
  const hotLeads = rows.filter(r => r.reply_status === 'REPLIED' || r.last_status === 'HOT_LEAD' || r.last_status === 'REPLIED').slice(0, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {metrics.map((m, i) => (
          <div key={i} className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ opacity: 0.5 }}>{m.icon}</div>
            </div>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-sora)', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{m.value}</div>
            <div style={{ fontSize: '12px', color: m.delta.includes('↑') ? 'var(--green)' : 'var(--text-muted)' }}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Hot Leads Table */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '16px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Hot Leads <span className="badge badge-gray" style={{ fontSize: '10px' }}>{hotLeads.length} Recent</span>
          </h2>
          <div className="crm-table-container">
            {hotLeads.length > 0 ? (
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Notes</th>
                    <th>Client?</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hotLeads.map((lead, i) => (
                    <EditableRow key={i} lead={lead as any} showNotes={true} />
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No recent replies detected. Keep pushing!
              </div>
            )}
          </div>
        </div>

        {/* Funnel Widget */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', color: '#fff', marginBottom: '24px' }}>Conversion Funnel</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              {name: 'Total Prospects', count: totalProspects, pct: 100}, 
              {name: 'Contacted', count: emailsSent, pct: parseFloat(sentPct)}, 
              {name: 'Replied', count: replies, pct: parseFloat(replyPct)}, 
              {name: 'Converted', count: clients, pct: totalProspects > 0 ? (clients/totalProspects*100) : 0}
            ].map((stage, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{stage.name}</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{stage.count} ({stage.pct}%)</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-panel-solid)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.max(stage.pct, 1)}%`, background: i === 0 ? 'var(--text-muted)' : i === 1 ? 'var(--blue)' : i === 2 ? 'var(--gold)' : 'var(--green)', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
