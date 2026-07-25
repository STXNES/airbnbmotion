'use client'

import { useState, useTransition } from 'react'
import { updateLeadStatus, updateLeadNotes, updateClientStatus } from '@/app/actions'

interface Lead {
  email: string
  company: string
  city: string
  state: string
  country: string
  last_status: string
  notes?: string
  client?: string
}

export function EditableRow({ lead, showNotes = false, showCountry = false }: { lead: Lead, showNotes?: boolean, showCountry?: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(lead.last_status || 'PENDING')
  const [notes, setNotes] = useState(lead.notes || '')
  const [isClient, setIsClient] = useState(lead.client === 'YES')
  const [savedStatus, setSavedStatus] = useState('')

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    startTransition(async () => {
      await updateLeadStatus(lead.email, newStatus)
      showSaved('✅ Status')
    })
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value)
  }

  const handleNotesBlur = () => {
    if (notes !== lead.notes) {
      startTransition(async () => {
        await updateLeadNotes(lead.email, notes)
        showSaved('✅ Notes')
      })
    }
  }

  const handleClientToggle = () => {
    const newClientStatus = !isClient
    setIsClient(newClientStatus)
    startTransition(async () => {
      await updateClientStatus(lead.email, newClientStatus ? 'YES' : '')
      showSaved('✅ Client')
    })
  }

  const showSaved = (msg: string) => {
    setSavedStatus(msg)
    setTimeout(() => setSavedStatus(''), 2000)
  }

  let badgeClass = "badge-gray";
  if (status === 'REPLIED' || status === 'HOT_LEAD') badgeClass = "badge-green";
  else if (status === 'SENT') badgeClass = "badge-gold";
  else if (status === 'CLOSED' || status === 'BOUNCED') badgeClass = "badge-blue";

  return (
    <tr style={{ opacity: isPending ? 0.7 : 1 }}>
      <td>
        <strong style={{ color: '#EDEFF3' }}>{lead.company || 'Unknown'}</strong>
        {savedStatus && <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--green)' }}>{savedStatus}</span>}
      </td>
      <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '12px' }}>{lead.email}</td>
      <td>{lead.city}, <span style={{ color: 'var(--text-muted)' }}>{lead.state}</span></td>
      
      {showCountry && (
        <td style={{ color: 'var(--text-muted)' }}>{lead.country || 'N/A'}</td>
      )}

      {showNotes && (
        <td>
          <input 
            type="text" 
            value={notes}
            onChange={handleNotesChange}
            onBlur={handleNotesBlur}
            placeholder="Añadir notas..."
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', 
              color: '#fff', padding: '6px 12px', borderRadius: '4px', width: '100%', fontSize: '13px' 
            }}
          />
        </td>
      )}

      {showNotes && (
        <td style={{ textAlign: 'center' }}>
          <input 
            type="checkbox" 
            checked={isClient}
            onChange={handleClientToggle}
            style={{ cursor: 'pointer', accentColor: 'var(--gold)' }}
          />
        </td>
      )}

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select 
            value={status}
            onChange={handleStatusChange}
            className={`badge ${badgeClass}`}
            style={{ 
              appearance: 'none', border: '1px solid transparent', cursor: 'pointer', outline: 'none',
              fontWeight: 500, fontFamily: 'inherit'
            }}
          >
            <option value="PENDING" style={{ background: '#111', color: '#fff' }}>PENDING</option>
            <option value="SENT" style={{ background: '#111', color: '#fff' }}>SENT</option>
            <option value="REPLIED" style={{ background: '#111', color: '#fff' }}>REPLIED</option>
            <option value="HOT_LEAD" style={{ background: '#111', color: '#fff' }}>HOT_LEAD</option>
            <option value="CLOSED" style={{ background: '#111', color: '#fff' }}>CLOSED</option>
            <option value="BOUNCED" style={{ background: '#111', color: '#fff' }}>BOUNCED</option>
          </select>
        </div>
      </td>
    </tr>
  )
}
