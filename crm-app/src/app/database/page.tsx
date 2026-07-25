import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export default async function FullDatabase() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT * FROM prospects ORDER BY id DESC LIMIT 500`; // Limit to 500 for performance

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📋 Full Database <span className="badge badge-gray" style={{ fontSize: '10px' }}>{rows.length} loaded</span>
          </h2>
        </div>
        
        <div className="crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>City</th>
                <th>State</th>
                <th>Batch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead, i) => {
                let badgeClass = "badge-gray";
                if (lead.last_status === 'REPLIED' || lead.last_status === 'HOT_LEAD') badgeClass = "badge-green";
                else if (lead.last_status === 'SENT') badgeClass = "badge-gold";
                
                return (
                  <tr key={i}>
                    <td><strong style={{ color: '#EDEFF3' }}>{lead.company || 'Unknown'}</strong></td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '12px' }}>{lead.email}</td>
                    <td>{lead.city}</td>
                    <td>{lead.state}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{lead.batch}</td>
                    <td><span className={`badge ${badgeClass}`}>{lead.last_status || 'PENDING'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
