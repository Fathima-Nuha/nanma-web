import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './ServicesPage.css'

const SERVICE_ICON_MAP = {
  Internet_Service: 'wifi',
  Wash_Only: 'local_laundry_service',
  House_Cleaning: 'cleaning_services',
  Plumbing: 'plumbing',
  Electrician: 'bolt',
  Carpentry: 'handyman',
  Pest_Control: 'bug_report',
  Laundry: 'local_laundry_service',
  AC_Service: 'ac_unit',
  Gardening: 'yard',
}

const STATUS_MAP = {
  new: { label: 'NEW', cls: 'new' },
  in_progress: { label: 'IN PROGRESS', cls: 'inprogress' },
  inprogress: { label: 'IN PROGRESS', cls: 'inprogress' },
  pending: { label: 'PENDING', cls: 'pending' },
  completed: { label: 'COMPLETED', cls: 'completed' },
  complete: { label: 'COMPLETE', cls: 'completed' },
  closed: { label: 'CLOSED', cls: 'closed' },
}

function formatDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  const datePart = d.toLocaleDateString('en-US', options)
  if (!timeStr) return datePart
  const t = new Date(timeStr)
  const timePart = t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return `${datePart}, ${timePart}`
}

const STATUS_ID_MAP = {
  1: { label: 'NEW', cls: 'new' },
  2: { label: 'IN PROGRESS', cls: 'inprogress' },
  3: { label: 'COMPLETED', cls: 'completed' },
  4: { label: 'CLOSED', cls: 'completed' },
}

function mapRequest(r) {
  const statusKey = (r.status ?? '').toLowerCase()
  const statusInfo = STATUS_MAP[statusKey] ?? { label: (r.status ?? '').toUpperCase(), cls: 'new' }
  const serviceKey = r.service_type ?? ''
  return {
    id: r.personal_service_request_id,
    title: serviceKey.replace(/_/g, ' '),
    icon: SERVICE_ICON_MAP[serviceKey] ?? 'home_repair_service',
    resident: r.vendor_name ?? '',
    date: formatDate(r.service_date, r.service_time),
    details: (r.description ?? '').slice(0, 28) + ((r.description ?? '').length > 28 ? '…' : ''),
    status: statusInfo.label,
    statusClass: statusInfo.cls,
  }
}

function mapCommunityRequest(r) {
  const statusInfo = STATUS_ID_MAP[r.status_id] ?? { label: 'NEW', cls: 'new' }
  const serviceKey = r.service_name ?? ''
  const dateOnly = r.service_date ? new Date(r.service_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const dateDisplay = dateOnly && r.service_time ? `${dateOnly}, ${r.service_time}` : dateOnly
  return {
    id: r.service_id,
    title: serviceKey.replace(/_/g, ' '),
    icon: SERVICE_ICON_MAP[serviceKey] ?? 'home_repair_service',
    resident: 'community',
    date: dateDisplay,
    details: (r.description ?? '').slice(0, 28) + ((r.description ?? '').length > 28 ? '…' : ''),
    status: statusInfo.label,
    statusClass: statusInfo.cls,
  }
}

function ServicesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'community' ? 'community' : 'personal')
  const [search, setSearch] = useState('')
  const [personalRequests, setPersonalRequests] = useState([])
  const [communityRequests, setCommunityRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (tab !== 'personal') return
    const buildingId = localStorage.getItem('selected_building_id')
    const appartmentId = localStorage.getItem('selected_apartment_id')
    if (!buildingId || !appartmentId) return
    setLoading(true)
    setError(null)
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/list_all_personal_servicerequest_for_user?building_id=${buildingId}&appartment_id=${appartmentId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },

      }
    )
      .then(res => res.json())
      .then(data => {
        console.log('personal requests', data)
        setPersonalRequests((data.servicerequest ?? []).map(mapRequest))
      })
      .catch(() => setError('Failed to load service requests.'))
      .finally(() => setLoading(false))
      
  }, [tab])

  useEffect(() => {
    if (tab !== 'community') return
    const appartmentId = localStorage.getItem('selected_apartment_id')
    if (!appartmentId) return
    setLoading(true)
    setError(null)
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/get_service_requests?flat_id=${appartmentId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      }
    )
      .then(res => res.json())
      .then(data => setCommunityRequests((data.service_requests ?? []).map(mapCommunityRequest)))
      .catch(() => setError('Failed to load community requests.'))
      .finally(() => setLoading(false))
  }, [tab])

  const requests = tab === 'personal' ? personalRequests : communityRequests

  const filtered = requests.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.details.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="svc-layout">
      {/* Left / Main */}
      <div className="svc-main">
        {/* Header */}
        <div className="svc-header">
          <div className="svc-header-text">
            <h1 className="svc-title">Service Requests</h1>
            <p className="svc-subtitle">Manage and track your residential amenities and maintenance.</p>
          </div>
          <div className="svc-header-actions">
            <div className="svc-search">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search by ID or type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <span className="svc-search-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            <button type="button" className="svc-create-btn" onClick={() => navigate(tab === 'community' ? '/user/services/create-community' : '/user/services/create')}>
              <span className="material-symbols-outlined">add</span>
              Create New Request
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="svc-tabs">
          <button
            type="button"
            className={`svc-tab${tab === 'personal' ? ' active' : ''}`}
            onClick={() => setTab('personal')}
          >
            Personal
          </button>
          <button
            type="button"
            className={`svc-tab${tab === 'community' ? ' active' : ''}`}
            onClick={() => setTab('community')}
          >
            Community
          </button>
        </div>

        {/* Table */}
        <div className="svc-table">
          <div className="svc-table-header">
            <span>Service &amp; Resident</span>
            <span>Details</span>
            <span>Status</span>

          </div>

          <div className="svc-table-body">
            {loading ? (
              <p className="svc-empty">Loading…</p>
            ) : error ? (
              <p className="svc-empty">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="svc-empty">No requests found.</p>
            ) : filtered.map(req => (
              <div key={req.id} className="svc-table-row">
                <div className="svc-row-service">
                  <div className="svc-row-icon">
                    <span className="material-symbols-outlined">{req.icon}</span>
                  </div>
                  <div className="svc-row-info">
                    <span className="svc-row-title">{req.title}</span>
                    <span className="svc-row-meta">ID#{req.id} &bull; {req.resident}</span>
                  </div>
                </div>
                <div className="svc-row-details">
                  <span className="svc-row-date">{req.date}</span>
                  <span className="svc-row-desc">{req.details}</span>
                </div>
                <div className="svc-row-status">
                  <span className={`svc-status-badge ${req.statusClass}`}>{req.status}</span>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Panel */}
      <aside className="svc-right">
        

        {/* Activity Summary */}
        <div className="svc-activity">
          <h3 className="svc-activity-title">Activity Summary</h3>
          <div className="svc-activity-row">
            <span className="svc-activity-label">Total Requests</span>
            <span className="svc-activity-value">{requests.length}</span>
          </div>
          <div className="svc-activity-bar">
            <div className="svc-activity-bar-fill" style={{ width: requests.length ? `${Math.round((requests.filter(r => r.statusClass === 'completed' || r.statusClass === 'closed').length / requests.length) * 100)}%` : '0%' }} />
          </div>
          <div className="svc-activity-stats">
            <div className="svc-activity-stat">
              <span className="svc-activity-stat-label">ACTIVE</span>
              <span className="svc-activity-stat-num">{requests.filter(r => r.statusClass !== 'completed' && r.statusClass !== 'closed').length}</span>
            </div>
            <div className="svc-activity-stat">
              <span className="svc-activity-stat-label">COMPLETED</span>
              <span className="svc-activity-stat-num">{requests.filter(r => r.statusClass === 'completed' || r.statusClass === 'closed').length}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default React.memo(ServicesPage)
