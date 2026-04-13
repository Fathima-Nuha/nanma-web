import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ComplaintsPage.css'

const STATUS_ID_MAP = {
  1: { label: 'NEW', cls: 'new' },
  2: { label: 'PENDING', cls: 'pending' },
  3: { label: 'COMPLETED', cls: 'completed' },
  4: { label: 'CLOSED', cls: 'closed' },
}

const FILTER_TABS = [
  { key: 'all', label: 'All Cases' },
  { key: 'new', label: 'New' },
  { key: 'pending', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '-')
}

function mapComplaint(c) {
  const statusInfo = STATUS_ID_MAP[c.complaint_status_id] ?? { label: 'NEW', cls: 'new' }
  return {
    id: c.id,
    title: c.topic ?? '',
    description: c.description ?? '',
    date: formatDate(c.created_at),
    rawDate: c.created_at,
    image: c.complaint_image ?? null,
    status: statusInfo.label,
    statusClass: statusInfo.cls,
  }
}

function ComplaintsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [sortLatest, setSortLatest] = useState(true)
  const [complaints, setComplaints] = useState([])
  const [counts, setCounts] = useState({ new: 0, pending: 0, completed: 0, closed: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const apartmentId = localStorage.getItem('selected_apartment_id')
    const buildingId = localStorage.getItem('selected_building_id')
    if (!apartmentId || !buildingId) return
    setLoading(true)
    setError(null)
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/search_get_complaints?building_id=${buildingId}&flat_id=${apartmentId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        setComplaints((data.all_complaints ?? []).map(mapComplaint))
        setCounts({
          new: data.new_complaints_count ?? 0,
          pending: data.pending_complaints_count ?? 0,
          completed: data.completed_complaints_count ?? 0,
          closed: data.closed_complaints_count ?? 0,
        })
      })
      .catch(() => setError('Failed to load complaints.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = complaints
    .filter(c => {
      if (filter === 'all') return true
      if (filter === 'new') return c.statusClass === 'new'
      if (filter === 'pending') return c.statusClass === 'pending'
      if (filter === 'completed') return c.statusClass === 'completed' || c.statusClass === 'closed'
      return true
    })
    .sort((a, b) => {
      if (!a.rawDate || !b.rawDate) return 0
      return sortLatest ? new Date(b.rawDate) - new Date(a.rawDate) : new Date(a.rawDate) - new Date(b.rawDate)
    })

  return (
    <div className="cmp-page">
      {/* Header */}
      <div className="cmp-header">
        <div className="cmp-header-text">
          <h1 className="cmp-title">Complaints Management</h1>
          <p className="cmp-subtitle">
            Track, manage, and resolve property-related issues with our streamlined concierge system.
            Each case is curated to ensure your living experience remains impeccable.
          </p>
        </div>
        <button type="button" className="cmp-file-btn" onClick={() => navigate('/user/complaints/create')}>
          <span className="material-symbols-outlined">add</span>
          File New Complaint
        </button>
      </div>

      {/* Filters */}
      <div className="cmp-filters">
        <div className="cmp-filter-tabs">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`cmp-filter-tab${filter === tab.key ? ' active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="cmp-sort">
          <span className="cmp-sort-label">Sorted by:</span>
          <button
            type="button"
            className="cmp-sort-btn"
            onClick={() => setSortLatest(v => !v)}
          >
            {sortLatest ? 'Latest First' : 'Oldest First'}
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <p className="cmp-empty">Loading…</p>
      ) : error ? (
        <p className="cmp-empty">{error}</p>
      ) : (
        <div className="cmp-grid">
          {filtered.map(c => (
            <div key={c.id} className="cmp-card">
              <div className="cmp-card-top">
                <span className="cmp-card-id">ID# {c.id}</span>
                <span className={`cmp-badge ${c.statusClass}`}>{c.status}</span>
              </div>
              <h3 className="cmp-card-title">{c.title}</h3>
              <p className="cmp-card-desc">{c.description}</p>
              <div className="cmp-card-footer">
                <span className="cmp-card-date">
                  <span className="material-symbols-outlined">calendar_today</span>
                  {c.date}
                </span>
                <button type="button" className="cmp-card-action" onClick={() => navigate(`/user/complaints/${c.id}`)}>
                  {c.statusClass === 'completed' || c.statusClass === 'closed' ? 'REVIEW' : 'DETAILS'}
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          ))}

          {/* Have another concern card */}
          {filtered.length === 0 && !loading && !error ? (
            <div className="cmp-card cmp-concern-card">
              <div className="cmp-concern-icon-wrap">
                <span className="material-symbols-outlined cmp-concern-icon">post_add</span>
              </div>
              <h3 className="cmp-concern-title">No complaints found.</h3>
              <p className="cmp-concern-text">You have no {filter !== 'all' ? filter : ''} complaints at the moment.</p>
            </div>
          ) : (
            <div className="cmp-card cmp-concern-card">
              <div className="cmp-concern-icon-wrap">
                <span className="material-symbols-outlined cmp-concern-icon">post_add</span>
              </div>
              <h3 className="cmp-concern-title">Have another concern?</h3>
              <p className="cmp-concern-text">Our concierge team is available 24/7 to address any living discomfort.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(ComplaintsPage)
