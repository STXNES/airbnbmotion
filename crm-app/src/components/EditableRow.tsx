'use client'

import { useState, useTransition } from 'react'
import { updateLeadStatus, updateLeadNotes, updateClientStatus } from '@/app/actions'

interface Lead {
  id?: number
  email: string
  company: string
  city: string
  state: string
  country: string
  last_status: string
  notes?: string
  client?: string
}

export function EditableRow({ lead, delay = 0 }: { lead: Lead, delay?: number }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(lead.last_status || 'PENDING')
  const [notes, setNotes] = useState(lead.notes || '')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isClient, setIsClient] = useState(lead.client === 'YES')
  const [savedStatus, setSavedStatus] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

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
    setIsEditingNotes(false)
    if (notes !== lead.notes) {
      startTransition(async () => {
        await updateLeadNotes(lead.email, notes)
        showSaved('✅ Notes')
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  let badgeClass = "queued";
  if (status === 'REPLIED' || status === 'HOT_LEAD') badgeClass = "replied";
  else if (status === 'SENT') badgeClass = "sent";
  else if (status === 'CLOSED' || status === 'BOUNCED') badgeClass = "bounced";
  else if (isClient) badgeClass = "client";

  const firstLetter = (lead.company || lead.email || '?').charAt(0).toUpperCase();

  return (
    <div className="row" style={{ animationDelay: `${delay}s`, opacity: isPending ? 0.7 : undefined }}>
      <div className="prop-cell">
        <div className="thumb">{firstLetter}</div>
        <div className="prop-info">
          <div className="prop-name">
            {lead.company || 'Unknown'}
            {savedStatus && <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--ok)' }}>{savedStatus}</span>}
          </div>
        </div>
      </div>
      
      <div className="contact-cell">
        <span className="contact-email">{lead.email}</span>
      </div>
      
      <div className="location-cell">
        {lead.city || 'Unknown'}, {lead.state || 'N/A'}
        <span className="country">{lead.country || 'N/A'}</span>
      </div>
      
      <div>
        {isEditingNotes ? (
           <input 
             type="text" 
             value={notes}
             onChange={handleNotesChange}
             onBlur={handleNotesBlur}
             onKeyDown={(e) => e.key === 'Enter' && handleNotesBlur()}
             autoFocus
             style={{ 
               background: 'var(--bg-elev)', border: '1px solid var(--border-color)', 
               color: 'var(--text)', padding: '6px 12px', borderRadius: '4px', width: '100%', fontSize: '12px' 
             }}
           />
        ) : (
          <button className="notes-btn" title={notes || "Ver / agregar nota"} onClick={() => setIsEditingNotes(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
        )}
      </div>

      <div>
        <select 
          value={status}
          onChange={handleStatusChange}
          className={`badge ${badgeClass}`}
          style={{ 
            appearance: 'none', cursor: 'pointer', outline: 'none', border: 'none',
            fontFamily: 'inherit'
          }}
        >
          <option value="PENDING" style={{ background: '#111', color: '#fff' }}>QUEUED</option>
          <option value="SENT" style={{ background: '#111', color: '#fff' }}>SENT</option>
          <option value="REPLIED" style={{ background: '#111', color: '#fff' }}>REPLIED</option>
          <option value="HOT_LEAD" style={{ background: '#111', color: '#fff' }}>HOT_LEAD</option>
          <option value="CLOSED" style={{ background: '#111', color: '#fff' }}>CLOSED</option>
          <option value="BOUNCED" style={{ background: '#111', color: '#fff' }}>BOUNCED</option>
        </select>
      </div>

      <div className="row-menu">⋯</div>
    </div>
  )
}
