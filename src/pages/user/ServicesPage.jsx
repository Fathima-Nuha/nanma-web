import React, { useState } from 'react'
import './ServicesPage.css'

const PERSONAL_REQUESTS = [
  {
    id: 71,
    title: 'Internet Service',
    icon: 'wifi',
    resident: 'subin krishna',
    date: 'Oct 24, 2023',
    details: 'Slow connection in…',
    status: 'IN PROGRESS',
    statusClass: 'inprogress',
  },
  {
    id: 19,
    title: 'Wash Only',
    icon: 'local_laundry_service',
    resident: 'subin krishna',
    date: 'Oct 22, 2023',
    details: '3 bags of delicate…',
    status: 'COMPLETED',
    statusClass: 'completed',
  },
  {
    id: 25,
    title: 'House Cleaning',
    icon: 'cleaning_services',
    resident: 'subin krishna',
    date: 'Today, 09:15 AM',
    details: 'Deep cleaning for gues…',
    status: 'NEW',
    statusClass: 'new',
  },
]

const COMMUNITY_REQUESTS = [
  {
    id: 88,
    title: 'Gym Equipment Repair',
    icon: 'fitness_center',
    resident: 'community',
    date: 'Apr 8, 2026',
    details: 'Treadmill belt broken…',
    status: 'IN PROGRESS',
    statusClass: 'inprogress',
  },
  {
    id: 91,
    title: 'Pool Maintenance',
    icon: 'pool',
    resident: 'community',
    date: 'Apr 5, 2026',
    details: 'Water level low, filter…',
    status: 'COMPLETED',
    statusClass: 'completed',
  },
]

const HISTORY = [
  { id: 1, date: 'SEPT 12, 2023', title: 'Leak Repair', desc: 'The kitchen faucet was dripping since morning….', icon: 'plumbing' },
  { id: 2, date: 'AUG 28, 2023', title: 'Fuse Replacement', desc: 'Main living area lights were flickering. Fuse unit replace…', icon: 'bolt' },
  { id: 3, date: 'AUG 15, 2023', title: 'Terrace Pruning', desc: 'Seasonal landscaping for the private terrace garden…', icon: 'yard' },
]

function ServicesPage() {
  const [tab, setTab] = useState('personal')
  const [search, setSearch] = useState('')

  const requests = tab === 'personal' ? PERSONAL_REQUESTS : COMMUNITY_REQUESTS
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
            </div>
            <button type="button" className="svc-create-btn">
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
            <span>Actions</span>
          </div>

          <div className="svc-table-body">
            {filtered.length === 0 ? (
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
                <div className="svc-row-actions">
                  <button type="button" className="svc-action-btn">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History & Archive */}
        <div className="svc-history">
          <h2 className="svc-history-title">History &amp; Archive</h2>
          <div className="svc-history-grid">
            {HISTORY.map(h => (
              <div key={h.id} className="svc-history-card">
                <div className="svc-history-top">
                  <span className="svc-history-date">{h.date}</span>
                  <div className="svc-history-icon">
                    <span className="material-symbols-outlined">{h.icon}</span>
                  </div>
                </div>
                <span className="svc-history-name">{h.title}</span>
                <span className="svc-history-desc">{h.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <aside className="svc-right">
        {/* Featured Upgrade */}
        <div className="svc-featured">
          <span className="svc-featured-label">Featured Upgrade</span>
          <h3 className="svc-featured-title">Professional Concierge Valet Service</h3>
          <button type="button" className="svc-featured-btn">Learn More</button>
        </div>

        {/* Activity Summary */}
        <div className="svc-activity">
          <h3 className="svc-activity-title">Activity Summary</h3>
          <div className="svc-activity-row">
            <span className="svc-activity-label">Total Requests</span>
            <span className="svc-activity-value">42</span>
          </div>
          <div className="svc-activity-bar">
            <div className="svc-activity-bar-fill" style={{ width: '72%' }} />
          </div>
          <div className="svc-activity-stats">
            <div className="svc-activity-stat">
              <span className="svc-activity-stat-label">ACTIVE</span>
              <span className="svc-activity-stat-num">12</span>
            </div>
            <div className="svc-activity-stat">
              <span className="svc-activity-stat-label">COMPLETED</span>
              <span className="svc-activity-stat-num">30</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default ServicesPage
