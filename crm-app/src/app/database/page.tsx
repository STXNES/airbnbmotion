import { neon } from '@neondatabase/serverless';
import { EditableRow } from "@/components/EditableRow";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FullDatabase({
  searchParams,
}: {
  searchParams: { page?: string, country?: string }
}) {
  const sql = neon(process.env.DATABASE_URL!);
  
  const page = Number(searchParams.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;
  const countryFilter = searchParams.country || '';

  let rows;
  let totalCountQuery;

  if (countryFilter) {
    rows = await sql`SELECT * FROM prospects WHERE country ILIKE ${'%' + countryFilter + '%'} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
    totalCountQuery = await sql`SELECT COUNT(*) FROM prospects WHERE country ILIKE ${'%' + countryFilter + '%'}`;
  } else {
    rows = await sql`SELECT * FROM prospects ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
    totalCountQuery = await sql`SELECT COUNT(*) FROM prospects`;
  }

  const totalCount = Number(totalCountQuery[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Neon Postgres <span className="badge badge-gray" style={{ fontSize: '10px' }}>Total: {totalCount}</span>
          </h2>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <form action="/database" method="GET" style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                name="country"
                defaultValue={countryFilter}
                placeholder="Filtrar por país..." 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', 
                  color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', outline: 'none'
                }} 
              />
              <button type="submit" className="badge badge-gray" style={{ cursor: 'pointer', border: 'none' }}>Buscar</button>
            </form>
          </div>
        </div>
        
        <div className="crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Country</th>
                <th>Notes</th>
                <th>Client?</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead, i) => (
                <EditableRow key={i} lead={lead as any} showNotes={true} showCountry={true} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Página {page} de {totalPages || 1}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {page > 1 && (
              <Link href={`/database?page=${page - 1}${countryFilter ? `&country=${countryFilter}` : ''}`}>
                <button className="badge badge-gray" style={{ cursor: 'pointer', border: 'none', padding: '8px 16px' }}>Anterior</button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/database?page=${page + 1}${countryFilter ? `&country=${countryFilter}` : ''}`}>
                <button className="badge badge-gray" style={{ cursor: 'pointer', border: 'none', padding: '8px 16px' }}>Siguiente</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
