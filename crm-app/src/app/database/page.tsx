import { neon } from '@neondatabase/serverless';
import { EditableRow } from "@/components/EditableRow";

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
                <th>Location</th>
                <th>Notes</th>
                <th>Client?</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead, i) => (
                <EditableRow key={i} lead={lead as any} showNotes={true} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
