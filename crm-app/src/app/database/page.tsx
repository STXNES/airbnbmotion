import { neon } from '@neondatabase/serverless';
import { EditableRow } from "@/components/EditableRow";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FullDatabase({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, country?: string }>
}) {
  const sql = neon(process.env.DATABASE_URL!);
  
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;
  const countryFilter = params.country || '';

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
    <>
      <div className="topbar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px'}}>
        <div>
          <h1 style={{fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, marginBottom: '6px'}}>Base de datos</h1>
          <p style={{color: 'var(--text-muted)', fontSize: '14.5px'}}>Neon Postgres — Total: {totalCount} prospectos</p>
        </div>
        <div className="topbar-actions" style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px'}}>
          <form action="/database" method="GET" className="search" style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '9px', padding: '9px 14px', width: '260px'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              name="country"
              defaultValue={countryFilter}
              placeholder="Filtrar por país..." 
              style={{background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '13.5px', width: '100%'}} 
            />
          </form>
          <button className="btn btn-primary">
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="panel" style={{background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '22px 0'}}>
        {/* We use an internal scrollable container so the main page doesn't scroll horizontally if the table is wide */}
        <div style={{width: '100%', overflowX: 'auto', maxHeight: '70vh', overflowY: 'auto', padding: '0 24px'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '900px'}}>
            <thead style={{position: 'sticky', top: 0, background: 'var(--bg-panel-solid)', zIndex: 10, boxShadow: '0 1px 0 var(--border-color)'}}>
              <tr>
                <th style={{textAlign: 'left', padding: '16px 12px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Company</th>
                <th style={{textAlign: 'left', padding: '16px 12px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Contact</th>
                <th style={{textAlign: 'left', padding: '16px 12px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Location</th>
                <th style={{textAlign: 'left', padding: '16px 12px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Country</th>
                <th style={{textAlign: 'left', padding: '16px 12px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Notes</th>
                <th style={{textAlign: 'left', padding: '16px 12px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Client?</th>
                <th style={{textAlign: 'left', padding: '16px 12px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead, i) => (
                <EditableRow key={i} lead={lead as any} showNotes={true} showCountry={true} />
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '0 24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Página {page} de {totalPages || 1}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {page > 1 && (
              <a href={`/database?page=${page - 1}${countryFilter ? `&country=${countryFilter}` : ''}`}>
                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>Anterior</button>
              </a>
            )}
            {page < totalPages && (
              <a href={`/database?page=${page + 1}${countryFilter ? `&country=${countryFilter}` : ''}`}>
                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>Siguiente</button>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
