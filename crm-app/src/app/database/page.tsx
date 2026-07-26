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
      <div className="topbar">
        <div>
          <h1>Base de datos</h1>
        </div>
        <div className="topbar-actions">
          <form action="/database" method="GET" className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              name="country"
              defaultValue={countryFilter}
              placeholder="Filtrar por país..." 
            />
          </form>
          <button className="btn btn-outline">Exportar</button>
          <button className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo prospecto
          </button>
        </div>
      </div>

      <div className="db-panel" id="db-section">
        <div className="db-head">
          <h2>Prospectos <span className="count">{totalCount} registros</span></h2>
          <div className="filters">
            <Link href="/database" className={`chip ${!countryFilter ? 'active' : ''}`}>Todos</Link>
          </div>
        </div>

        <div className="table-scroll">
          <div className="table-head-row">
            <span>Company</span>
            <span>Contact</span>
            <span>Location</span>
            <span>Notes</span>
            <span>Status</span>
            <span></span>
          </div>
          {rows.map((lead, i) => (
            <EditableRow key={lead.id || i} lead={lead as any} delay={i * 0.03} />
          ))}
        </div>

        <div className="pagination">
          <div className="pg-info">
            Mostrando <b>{offset + 1}–{Math.min(offset + limit, totalCount)}</b> de <b>{totalCount}</b> prospectos
          </div>
          <div className="pg-controls">
            <Link href={`/database?page=${Math.max(1, page - 1)}${countryFilter ? `&country=${countryFilter}` : ''}`}>
              <button className="pg-btn" disabled={page <= 1}>‹</button>
            </Link>
            <button className="pg-btn active">{page}</button>
            <Link href={`/database?page=${Math.min(totalPages, page + 1)}${countryFilter ? `&country=${countryFilter}` : ''}`}>
              <button className="pg-btn" disabled={page >= totalPages}>›</button>
            </Link>
          </div>
          <div className="pg-size">
            Filas por página
            <select defaultValue={50}>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
