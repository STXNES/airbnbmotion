import streamlit as st
import pandas as pd
import os
from pathlib import Path

# --- Configuración de página ---
st.set_page_config(page_title="AirbnbMotion HQ — Outreach Command Center", page_icon="⚡", layout="wide")

# --- Rutas de datos ---
ROOT = Path(__file__).resolve().parents[2]
MASTER_DB_PATH = ROOT / "03-MASTER_DATABASE" / "master_database.csv"

# --- Estilos CSS Personalizados (Inyección de Diseño del Mockup) ---
# Hemos ocultado por completo el Header y Footer por defecto de Streamlit
# Esto elimina el menú flotante en inglés (Rerun, Auto rerun) y la barra superior
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    /* Permitimos que el Header se vea para poder cambiar de tema (Modo Claro/Oscuro) */
    [data-testid="stHeader"] {
        background-color: transparent !important;
    }
    footer {
        visibility: hidden !important;
    }
    
    /* Aplicar fondo oscuro de forma segura */
    [data-testid="stAppViewContainer"] {
        background-color: #0E1116 !important;
        font-family: 'Sora', sans-serif !important;
    }
    
    /* Regla de seguridad: Evitar que el color de texto custom altere los menús de Streamlit */
    div[data-role="dialog"], [class*="stPopover"], [data-testid="stMainMenu"] {
        color: initial !important;
        font-family: system-ui, sans-serif !important;
    }
    
    [data-testid="stSidebar"] {
        background-color: #161A21 !important;
        border-right: 1px solid #252B35 !important;
    }
    
    /* Estilo de Tarjetas de Métricas */
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin-bottom: 20px;
    }
    @media (max-width: 900px) {
        .metric-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    .metric-card {
        background: #161A21;
        border: 1px solid #252B35;
        border-radius: 10px;
        padding: 20px;
        text-align: left;
    }
    .metric-label {
        font-size: 12px;
        color: #8A909C;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .metric-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 30px;
        font-weight: 500;
        color: #EDEFF3;
    }
    .metric-delta {
        font-size: 11px;
        margin-top: 8px;
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
    }
    .delta-up { color: #4CA779; background: rgba(76,167,121,0.12); }
    .delta-flat { color: #8A909C; background: rgba(138,144,156,0.1); }

    /* Contenedor Panel */
    .dashboard-panel {
        background: #161A21;
        border: 1px solid #252B35;
        border-radius: 10px;
        padding: 24px;
        margin-bottom: 20px;
        text-align: left;
    }
    .dashboard-panel h2 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #EDEFF3;
    }

    /* Gráfico Funnel */
    .funnel-row {
        display: grid;
        grid-template-columns: 100px 1fr 50px;
        align-items: center;
        gap: 14px;
        margin-bottom: 16px;
    }
    .funnel-stage {
        font-size: 12px;
        color: #8A909C;
    }
    .funnel-bar-track {
        background: #1D222B;
        border-radius: 6px;
        height: 26px;
        overflow: hidden;
    }
    .funnel-bar {
        height: 100%;
        background: #5B9FE3;
        border-radius: 6px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #0E1116;
        font-weight: 600;
    }
    .funnel-count {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: #8A909C;
        text-align: right;
    }

    /* Status Breakdown */
    .status-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .status-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
    }
    .status-tag {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #8A909C;
    }
    .status-sw {
        width: 8px;
        height: 8px;
        border-radius: 2px;
    }
    .status-pct {
        font-family: 'JetBrains Mono', monospace;
        color: #EDEFF3;
    }
    .status-bar {
        height: 6px;
        border-radius: 4px;
        background: #1D222B;
        margin-top: 6px;
        overflow: hidden;
    }
    .status-bar-fill {
        height: 100%;
        border-radius: 4px;
    }

    /* Leads Table Styling */
    .badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        background: #1D222B;
        color: #8A909C;
        padding: 4px 10px;
        border-radius: 12px;
        margin-left: 8px;
    }
    .empty-banner {
        background: rgba(91,159,227,0.08);
        border: 1px solid rgba(91,159,227,0.2);
        color: #5B9FE3;
        font-size: 13px;
        padding: 14px 18px;
        border-radius: 8px;
        margin-top: 10px;
    }
    .state-chip {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        background: #1D222B;
        padding: 3px 8px;
        border-radius: 4px;
        color: #C9903C;
    }

    /* Tablas personalizadas */
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        color: #EDEFF3;
    }
    th {
        text-align: left;
        font-weight: 500;
        color: #8A909C;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 10px 12px;
        border-bottom: 1px solid #252B35;
    }
    td {
        padding: 12px;
        border-bottom: 1px solid #252B35;
    }
    tr:last-child td {
        border-bottom: none;
    }
    .mono {
        font-family: 'JetBrains Mono', monospace;
        color: #8A909C;
        font-size: 12px;
    }
</style>
""", unsafe_allow_html=True)

# --- Cargar Datos ---
def load_data():
    if not os.path.exists(MASTER_DB_PATH):
        return pd.DataFrame()
    try:
        df = pd.read_csv(MASTER_DB_PATH)
        # Asegurar columnas mínimas
        for col in ["Company", "Website", "Email", "City", "State", "First_Added", "Batch", "Last_Status", "Reply_Status", "Client"]:
            if col not in df.columns:
                df[col] = ""
        return df
    except Exception:
        return pd.DataFrame()

df = load_data()

# --- Sidebar (Navegación Dinámica) ---
with st.sidebar:
    st.markdown("""
    <div style='margin-bottom: 30px;'>
        <div style='font-size: 18px; font-weight: 700; color: #EDEFF3;'>Airbnb<span style='color: #C9903C;'>Motion</span></div>
        <div style='font-family: "JetBrains Mono", monospace; font-size: 10px; color: #8A909C; letter-spacing: 1.5px; text-transform: uppercase;'>Outreach ops</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Navegación real
    nav_selection = st.radio(
        "Navegación",
        ["Overview", "Full Database"],
        index=0,
        label_visibility="collapsed"
    )
    
    st.markdown("---")
    st.markdown("### Enlaces Rápidos (HQ)")
    
    st.markdown("""
    <div style='display: flex; flex-direction: column; gap: 8px; margin-top: 10px;'>
        <a href='https://www.airbnbmotion.studio' target='_blank' style='text-decoration: none; color: #EDEFF3; background: #1D222B; padding: 10px; border-radius: 6px; display: block; border: 1px solid #252B35; font-size: 13px;'>
            🌐 Landing Page (Estudio)
        </a>
        <a href='https://mail.zoho.com' target='_blank' style='text-decoration: none; color: #EDEFF3; background: #1D222B; padding: 10px; border-radius: 6px; display: block; border: 1px solid #252B35; font-size: 13px;'>
            📧 Zoho Mail (Bandeja)
        </a>
        <a href='https://github.com/STXNES/airbnbmotion/actions' target='_blank' style='text-decoration: none; color: #EDEFF3; background: #1D222B; padding: 10px; border-radius: 6px; display: block; border: 1px solid #252B35; font-size: 13px;'>
            🚀 GitHub Actions (Bot)
        </a>
        <a href='https://higgsfield.ai' target='_blank' style='text-decoration: none; color: #EDEFF3; background: #1D222B; padding: 10px; border-radius: 6px; display: block; border: 1px solid #252B35; font-size: 13px;'>
            🎬 Higgsfield (IA Video)
        </a>
        <a href='https://www.paypal.com/invoice/create' target='_blank' style='text-decoration: none; color: #EDEFF3; background: #1D222B; padding: 10px; border-radius: 6px; display: block; border: 1px solid #252B35; font-size: 13px;'>
            💳 PayPal (Cobros)
        </a>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    st.markdown("### Estado del Sistema")
    st.info("Autopilot configurado vía Zoho SMTP.")

# --- Cabecera Principal ---
col_title, col_btn = st.columns([4, 1])
with col_title:
    st.markdown("# Outreach dashboard")
    st.markdown(f"<p style='color: #8A909C; margin-top: -10px;'>Sección actual: {nav_selection}</p>", unsafe_allow_html=True)
with col_btn:
    st.markdown("<br><div style='text-align: right;'><span style='font-family: \"JetBrains Mono\", monospace; font-size: 12px; background: #C9903C; color: #1a1206; padding: 9px 18px; border-radius: 6px; font-weight: 600;'>LIVE ON VERCEL</span></div>", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

if df.empty:
    st.warning("No hay datos cargados en master_database.csv. Comienza tu primera campaña para ver estadísticas.")
    st.stop()

# --- Procesar Métricas Generales ---
total_prospects = len(df)
emails_sent = len(df[df["Last_Status"].isin(["SENT", "REPLIED", "CLOSED"])])
replies = len(df[df["Reply_Status"] == "REPLIED"])
clients = len(df[df["Client"].str.upper() == "YES"])

sent_pct = (emails_sent / total_prospects * 100) if total_prospects > 0 else 0.0
replied_pct = (replies / emails_sent * 100) if emails_sent > 0 else 0.0

# --- SECCIÓN: OVERVIEW ---
if nav_selection == "Overview":
    # Renderizar Tarjetas de Métricas
    st.markdown(f"""
    <div class="metric-grid">
        <div class="metric-card">
            <div class="metric-label">Total prospects</div>
            <div class="metric-value">{total_prospects}</div>
            <span class="metric-delta delta-flat">Active Database</span>
        </div>
        <div class="metric-card">
            <div class="metric-label">Emails sent</div>
            <div class="metric-value">{emails_sent}</div>
            <span class="metric-delta delta-flat">{sent_pct:.1f}% Processed</span>
        </div>
        <div class="metric-card">
            <div class="metric-label">Replies</div>
            <div class="metric-value">{replies}</div>
            <span class="metric-delta delta-up">↑ {replied_pct:.1f}% Response Rate</span>
        </div>
        <div class="metric-card">
            <div class="metric-label">Clients</div>
            <div class="metric-value">{clients}</div>
            <span class="metric-delta delta-flat">{clients} Converted</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Fila 1: Funnel & Breakdown
    col_funnel, col_breakdown = st.columns([1.4, 1])

    with col_funnel:
        funnel_stages = [
            {"name": "Prospects", "count": total_prospects, "pct": 100},
            {"name": "Sent", "count": emails_sent, "pct": int((emails_sent/total_prospects*100) if total_prospects > 0 else 0)},
            {"name": "Replied", "count": replies, "pct": int((replies/total_prospects*100) if total_prospects > 0 else 0)},
            {"name": "Clients", "count": clients, "pct": int((clients/total_prospects*100) if total_prospects > 0 else 0)}
        ]
        
        funnel_html = "<div class='dashboard-panel'><h2>Pipeline Funnel</h2>"
        for stage in funnel_stages:
            width_pct = max(stage["pct"], 2)
            bg_color = '#5B9FE3' if stage['pct'] > 0 else '#1D222B'
            text_color = '#0E1116' if stage['pct'] > 0 else '#8A909C'
            label_val = str(stage['count']) if stage['count'] > 0 else '0'
            
            funnel_html += f"<div class='funnel-row'><span class='funnel-stage'>{stage['name']}</span><div class='funnel-bar-track'><div class='funnel-bar' style='width: {width_pct}%; background-color: {bg_color}; color: {text_color};'>&nbsp;{label_val}</div></div><span class='funnel-count'>{stage['pct']}%</span></div>"
        st.markdown(funnel_html + "</div>", unsafe_allow_html=True)

    with col_breakdown:
        status_counts = df["Last_Status"].replace("", "PENDING").fillna("PENDING").value_counts()
        
        pending_count = status_counts.get("PENDING", 0)
        sent_count = status_counts.get("SENT", 0)
        replied_count = status_counts.get("REPLIED", 0)
        
        p_pct = int(pending_count / total_prospects * 100) if total_prospects > 0 else 0
        s_pct = int(sent_count / total_prospects * 100) if total_prospects > 0 else 0
        r_pct = int(replied_count / total_prospects * 100) if total_prospects > 0 else 0
        
        breakdown_html = f"""
        <div class='dashboard-panel'>
            <h2>Status Breakdown</h2>
            <div class="status-list">
                <div>
                    <div class="status-item">
                        <span class="status-tag"><span class="status-sw" style="background:#5B9FE3"></span>Pending / Unsent</span>
                        <span class="status-pct">{p_pct}%</span>
                    </div>
                    <div class="status-bar"><div class="status-bar-fill" style="width:{p_pct}%; background:#5B9FE3"></div></div>
                </div>
                <div>
                    <div class="status-item">
                        <span class="status-tag"><span class="status-sw" style="background:#C9903C"></span>Contacted (Sent)</span>
                        <span class="status-pct">{s_pct}%</span>
                    </div>
                    <div class="status-bar"><div class="status-bar-fill" style="width:{s_pct}%; background:#C9903C"></div></div>
                </div>
                <div>
                    <div class="status-item">
                        <span class="status-tag"><span class="status-sw" style="background:#4CA779"></span>Hot Lead (Replied)</span>
                        <span class="status-pct">{r_pct}%</span>
                    </div>
                    <div class="status-bar"><div class="status-bar-fill" style="width:{r_pct}%; background:#4CA779"></div></div>
                </div>
            </div>
        </div>
        """
        st.markdown(breakdown_html, unsafe_allow_html=True)

    # Hot Leads Section (Unificada en un solo st.markdown)
    replied_df = df[df["Reply_Status"] == "REPLIED"].copy()
    
    # Renderizamos la cabecera del panel usando Streamlit nativo para el buscador
    col_h2, col_search = st.columns([3, 1])
    with col_h2:
        st.markdown(f"<div style='margin-top: 15px;'><h2 style='font-size: 14px; font-weight: 600; color: #EDEFF3;'>🔥 Hot Leads <span class='badge'>{len(replied_df)} replied</span></h2></div>", unsafe_allow_html=True)
    with col_search:
        search_query = st.text_input("", placeholder="Search company or email...", label_visibility="collapsed", key="search_hot")

    if replied_df.empty:
        st.markdown("<div class='dashboard-panel'><div class='empty-banner'>No replies detected yet. Keep outreach active!</div></div>", unsafe_allow_html=True)
    else:
        if search_query:
            replied_df = replied_df[
                replied_df["Company"].str.contains(search_query, case=False, na=False) |
                replied_df["Email"].str.contains(search_query, case=False, na=False)
            ]
        
        table_html = "<div class='dashboard-panel'><table><thead><tr><th>Company</th><th>Website</th><th>Email</th><th>City</th><th>State</th><th>Last Sent</th><th>Batch</th></tr></thead><tbody>"
        for _, row in replied_df.iterrows():
            table_html += f"<tr><td><strong>{row['Company']}</strong></td><td class='mono'>{row['Website']}</td><td class='mono'>{row['Email']}</td><td>{row['City']}</td><td><span class='state-chip'>{row['State']}</span></td><td class='mono'>{row['Last_Sent']}</td><td class='mono'>{row['Batch']}</td></tr>"
        table_html += "</tbody></table></div>"
        st.markdown(table_html, unsafe_allow_html=True)

# --- SECCIÓN: FULL DATABASE ---
elif nav_selection == "Full Database":
    col_db_h2, col_db_search = st.columns([3, 1])
    with col_db_h2:
        st.markdown(f"<div style='margin-top: 15px;'><h2 style='font-size: 14px; font-weight: 600; color: #EDEFF3;'>📋 Full Database <span class='badge'>{total_prospects} total</span></h2></div>", unsafe_allow_html=True)
    with col_db_search:
        db_search_query = st.text_input("", placeholder="Search database...", label_visibility="collapsed", key="search_db")
        
    display_df = df.copy()
    if db_search_query:
        display_df = display_df[
            display_df["Company"].str.contains(db_search_query, case=False, na=False) |
            display_df["Email"].str.contains(db_search_query, case=False, na=False) |
            display_df["City"].str.contains(db_search_query, case=False, na=False)
        ]
        
    table_html = "<div class='dashboard-panel'><table><thead><tr><th>Company</th><th>Email</th><th>City</th><th>State</th><th>Status</th><th>Batch</th></tr></thead><tbody>"
    for _, row in display_df.iterrows():
        status_color = "#5B9FE3"
        status_label = row["Last_Status"] if row["Last_Status"] else "PENDING"
        if status_label == "SENT":
            status_color = "#C9903C"
        elif status_label == "REPLIED":
            status_color = "#4CA779"
            
        table_html += f"<tr><td><strong>{row['Company']}</strong></td><td class='mono'>{row['Email']}</td><td>{row['City']}</td><td><span class='state-chip'>{row['State']}</span></td><td><span class='state-chip' style='color: {status_color}; border-color: {status_color};'>{status_label}</span></td><td class='mono'>{row['Batch']}</td></tr>"
    table_html += "</tbody></table></div>"
    st.markdown(table_html, unsafe_allow_html=True)
