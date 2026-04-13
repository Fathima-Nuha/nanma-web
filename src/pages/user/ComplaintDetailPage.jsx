import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ComplaintDetailPage.css'

const STATUS_ID_MAP = {
  1: { label: 'NEW', cls: 'new' },
  2: { label: 'PENDING', cls: 'pending' },
  3: { label: 'COMPLETED', cls: 'completed' },
  4: { label: 'CLOSED', cls: 'closed' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' • ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getTimelineSteps(statusClass, createdAt) {
  const isPending = statusClass === 'pending' || statusClass === 'completed' || statusClass === 'closed'
  const isResolved = statusClass === 'completed' || statusClass === 'closed'
  return [
    { icon: 'check', label: 'Complaint Filed', sub: createdAt, done: true },
    { icon: 'pending', label: 'Assigned to Maintenance', sub: 'Pending review', done: isPending },
    { icon: 'engineering', label: 'In Progress', sub: 'Awaiting technician', done: isResolved },
  ]
}

function ComplaintDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgZoom, setImgZoom] = useState(false)

  useEffect(() => {
    const flatId = localStorage.getItem('selected_apartment_id')
    if (!flatId || !id) return
    setLoading(true)
    setError(null)
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/get_complaint`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ flat_id: flatId, complaint_id: id }),
      }
    )
      .then(res => res.json())
      .then(data => {
        const c = (data.complaint ?? [])[0]
        if (!c) { setError('Complaint not found.'); return }
        const statusInfo = STATUS_ID_MAP[c.complaint_status_id] ?? { label: 'NEW', cls: 'new' }
        setComplaint({
          id: c.id,
          title: c.topic ?? '',
          description: c.description ?? '',
          createdAt: formatDate(c.created_at),
          createdAtShort: formatDateShort(c.created_at),
          updatedAt: formatDate(c.updated_at),
          image: c.complaint_image ?? null,
          paymentFlag: c.payment_flag ?? false,
          status: statusInfo.label,
          statusClass: statusInfo.cls,
        })
      })
      .catch(() => setError('Failed to load complaint details.'))
      .finally(() => setLoading(false))
  }, [id])

  const timelineSteps = complaint ? getTimelineSteps(complaint.statusClass, complaint.createdAt) : []

  return (
    <div className="cd-page">
      {/* Breadcrumbs */}
      <nav className="cd-breadcrumbs">
        <button type="button" className="cd-breadcrumb-link" onClick={() => navigate('/user/dashboard')}>Dashboard</button>
        <span className="material-symbols-outlined cd-breadcrumb-sep">chevron_right</span>
        <button type="button" className="cd-breadcrumb-link" onClick={() => navigate('/user/complaints')}>Complaints</button>
        <span className="material-symbols-outlined cd-breadcrumb-sep">chevron_right</span>
        <span className="cd-breadcrumb-current">Complaint Details</span>
      </nav>

      {loading ? (
        <p className="cd-empty">Loading…</p>
      ) : error ? (
        <p className="cd-empty">{error}</p>
      ) : complaint && (
        <>
          {/* Page Header */}
          <div className="cd-page-header">
            <div className="cd-header-left">
              <div className="cd-header-title-row">
                <h1 className="cd-page-title">Complaint Details</h1>
                <span className={`cd-status-pill ${complaint.statusClass}`}>
                  <span className="cd-status-dot" />
                  {complaint.status}
                </span>
              </div>
              <p className="cd-header-sub">
                Track the progress of your maintenance or service requests. Our team has been notified and is reviewing the details provided below.
              </p>
            </div>
            <div className="cd-header-actions">
              <button type="button" className="cd-btn-outline">
                <span className="material-symbols-outlined">edit</span>
                Edit Complaint
              </button>
              {/* <button type="button" className="cd-btn-primary">
                Resolve Case
              </button> */}
            </div>
          </div>

          {/* Bento Grid */}
          <div className="cd-bento">
            {/* Main */}
            <div className="cd-main">
              {/* Complaint Information */}
              <div className="cd-card">
                <h3 className="cd-card-title">
                  <span className="material-symbols-outlined">info</span>
                  Complaint Information
                </h3>
                <div className="cd-info-grid">
                  <div className="cd-info-item">
                    <p className="cd-info-label">Reference ID</p>
                    <p className="cd-info-value">#{complaint.id}</p>
                  </div>
                  <div className="cd-info-item">
                    <p className="cd-info-label">Date Reported</p>
                    <p className="cd-info-value">{complaint.createdAtShort}</p>
                  </div>
                  <div className="cd-info-item">
                    <p className="cd-info-label">Topic</p>
                    <p className="cd-info-value">{complaint.title}</p>
                  </div>
                </div>
                <div className="cd-desc-block">
                  <p className="cd-info-label">Detailed Description</p>
                  <div className="cd-desc-quote">
                    <p>"{complaint.description}"</p>
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div className="cd-card">
                <div className="cd-card-header-row">
                  <h3 className="cd-card-title">
                    <span className="material-symbols-outlined">attachment</span>
                    Evidence &amp; Attachments
                  </h3>
                </div>
                {complaint.image ? (
                  <div className="cd-evidence-grid">
                    <div className="cd-evidence-item" onClick={() => setImgZoom(true)}>
                      <img src={complaint.image} alt="Complaint Evidence" className="cd-evidence-img" />
                      <div className="cd-evidence-overlay">
                        <span className="material-symbols-outlined">zoom_in</span>
                      </div>
                      <div className="cd-evidence-footer">
                        <span className="cd-evidence-name">complaint_image.jpg</span>
                        <span className="material-symbols-outlined cd-evidence-dl">open_in_full</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="cd-no-evidence">No attachments provided.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="cd-sidebar">
              {/* Timeline
              <div className="cd-sidebar-card cd-timeline-card">
                <h4 className="cd-sidebar-card-title">Status Timeline</h4>
                <div className="cd-timeline">
                  <div className="cd-timeline-line" />
                  {timelineSteps.map((step, i) => (
                    <div key={i} className={`cd-timeline-step ${step.done ? 'done' : 'faded'}`}>
                      <div className="cd-timeline-node">
                        <span className="material-symbols-outlined">{step.icon}</span>
                      </div>
                      <div>
                        <p className="cd-timeline-label">{step.label}</p>
                        <p className="cd-timeline-sub">{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Support Concierge */}
              <div className="cd-sidebar-card cd-concierge-card">
                <h4 className="cd-sidebar-card-title cd-concierge-title">Support Concierge</h4>
                <p className="cd-concierge-desc">Need immediate assistance with this complaint? Our concierge is available 24/7.</p>
                <div className="cd-concierge-actions">
                  <button type="button" className="cd-concierge-btn">
                    <span className="material-symbols-outlined">chat_bubble</span>
                    Live Chat
                  </button>
                  <button type="button" className="cd-concierge-btn">
                    <span className="material-symbols-outlined">call</span>
                    Call Desk
                  </button>
                </div>
              </div>

              {/* Cancel */}
              <button type="button" className="cd-cancel-btn">
                <span className="material-symbols-outlined">delete</span>
                Cancel Complaint
              </button>
            </div>
          </div>
        </>
      )}

      {/* Lightbox */}
      {imgZoom && complaint?.image && (
        <div className="cd-lightbox" onClick={() => setImgZoom(false)}>
          <button type="button" className="cd-lightbox-close" onClick={e => { e.stopPropagation(); setImgZoom(false) }}>
            <span className="material-symbols-outlined">close</span>
          </button>
          <img src={complaint.image} alt="Complaint preview" />
        </div>
      )}
    </div>
  )
}

export default React.memo(ComplaintDetailPage)
