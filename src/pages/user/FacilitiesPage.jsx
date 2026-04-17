import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './FacilitiesPage.css'

const TABS = [
  { key: 'book', label: 'Book Facility', icon: 'event_available' },
  { key: 'requests', label: 'Booking Requests', icon: 'history' },
]

function formatAmount(amount) {
  const num = parseFloat(amount)
  if (isNaN(num)) return amount
  return num % 1 === 0 ? `Rs. ${num.toFixed(0)}` : `Rs. ${num.toFixed(2)}`
}

function formatBookDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_META = {
  pending:   { label: 'Pending',   cls: 'fac-badge--pending' },
  accepted:  { label: 'Accepted',  cls: 'fac-badge--accepted' },
  confirmed: { label: 'Confirmed', cls: 'fac-badge--accepted' },
  rejected:  { label: 'Rejected',  cls: 'fac-badge--rejected' },
  cancelled: { label: 'Cancelled', cls: 'fac-badge--cancelled' },
  expired:   { label: 'Expired',   cls: 'fac-badge--expired' },
}

function FacilitiesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab ?? 'book')
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsError, setBookingsError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const buildingId = localStorage.getItem('selected_building_id')
    if (!buildingId) return
    setLoading(true)
    setError(null)
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/search_and_list_common_facilities?building_id=${buildingId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      }
    )
      .then(res => res.json())
      .then(data => setFacilities(data.common_facilities ?? []))
      .catch(() => setError('Failed to load facilities.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab !== 'requests') return
    setBookingsLoading(true)
    setBookingsError(null)
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/list_booked_facility_slots`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ flat_id: localStorage.getItem('selected_apartment_id') }),
      }
    )
      .then(res => res.json())
      .then(data => setBookings(data.booked_slots ?? []))
      .catch(() => setBookingsError('Failed to load booking requests.'))
      .finally(() => setBookingsLoading(false))
  }, [activeTab])

  return (
    <div className="fac-page">
      {/* ── Header ── */}
      <div className="fac-header">
        <h2 className="fac-title">Curated Spaces</h2>
        <p className="fac-subtitle">
          Reserve exclusive amenities designed for discerning residents. From sophisticated galas to private professional gatherings.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="fac-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`fac-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'book' && (
        <>
          {loading && (
            <div className="fac-state-msg">
              <span className="material-symbols-outlined fac-state-icon fac-spin">progress_activity</span>
              <p>Loading facilities…</p>
            </div>
          )}

          {error && !loading && (
            <div className="fac-state-msg fac-state-error">
              <span className="material-symbols-outlined fac-state-icon">error_outline</span>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && facilities.length === 0 && (
            <div className="fac-state-msg">
              <span className="material-symbols-outlined fac-state-icon">meeting_room</span>
              <p>No facilities found for your building.</p>
            </div>
          )}

          {!loading && !error && facilities.length > 0 && (
            <>
              <div className="fac-grid">
                {facilities.map(facility => (
                  <div key={facility.id} className="fac-card">
                    <div className={`fac-card-hero${facility.available ? '' : ' fac-card-hero--dim'}`}>
                      <span className="material-symbols-outlined fac-hero-icon">apartment</span>
                      <span className={`fac-avail-badge${facility.available ? ' available' : ' unavailable'}`}>
                        {facility.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="fac-card-body">
                      <h3 className="fac-card-name">{facility.name}</h3>
                      <p className="fac-card-desc">{facility.description}</p>
                      <div className="fac-card-footer">
                        <div className="fac-card-rate">
                          <span className="fac-card-rate-label">Per booking</span>
                          <span className="fac-card-rate-value">{formatAmount(facility.amount)}</span>
                        </div>
                        {facility.available ? (
                          <button
                            className="fac-btn-primary"
                            onClick={() => navigate('/user/facilities/book', { state: { facility } })}
                          >
                            Book Now
                          </button>
                        ) : (
                          <button className="fac-btn-outline" disabled>Unavailable</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Promo Section ── */}
              <div className="fac-promo">
                <div className="fac-promo-bg">
                  <img
                    src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=60"
                    alt="Architecture background"
                  />
                </div>
                <div className="fac-promo-content">
                  <span className="fac-promo-eyebrow">Concierge Privilege</span>
                  <h2 className="fac-promo-title">Your event deserves the touch of a curator.</h2>
                  <p className="fac-promo-body">
                    Need a custom arrangement? Our on-site curators can handle floral arrangements, catering logistics, and digital installations for any booked facility.
                  </p>
                  <button className="fac-promo-link">
                    Inquire with concierge
                    <span className="material-symbols-outlined">arrow_right_alt</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {/* ── Filter Chips ── */}
          <div className="fac-filters">
            {[
              { key: 'all',       label: 'All Requests' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'pending',   label: 'Pending' },
              { key: 'past',      label: 'Past' },
            ].map(f => (
              <button
                key={f.key}
                type="button"
                className={`fac-filter-chip${activeFilter === f.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {bookingsLoading && (
            <div className="fac-state-msg">
              <span className="material-symbols-outlined fac-state-icon fac-spin">progress_activity</span>
              <p>Loading your reservations…</p>
            </div>
          )}

          {bookingsError && !bookingsLoading && (
            <div className="fac-state-msg fac-state-error">
              <span className="material-symbols-outlined fac-state-icon">error_outline</span>
              <p>{bookingsError}</p>
            </div>
          )}

          {!bookingsLoading && !bookingsError && (() => {
            const filtered = bookings.filter(b => {
              const s = (b.status ?? '').toLowerCase()
              if (activeFilter === 'confirmed') return s === 'accepted' || s === 'confirmed'
              if (activeFilter === 'pending') return s === 'pending'
              if (activeFilter === 'past') return s === 'expired' || s === 'cancelled' || s === 'rejected'
              return true
            })

            if (filtered.length === 0) return (
              <div className="fac-state-msg">
                <span className="material-symbols-outlined fac-state-icon">calendar_month</span>
                <p style={{ fontFamily: 'Manrope, Inter, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#1b1c19', margin: '0 0 8px' }}>
                  No reservations found
                </p>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>
                  {activeFilter === 'all'
                    ? 'Your facility booking requests will appear here.'
                    : `No ${activeFilter} requests to show.`}
                </p>
              </div>
            )

            return (
              <div className="fac-booking-list">
                {/* Column header */}
                <div className="fac-list-header">
                  <div className="fac-lh-facility">Facility &amp; Date</div>
                  <div className="fac-lh-time">Time</div>
                  <div className="fac-lh-status">Status</div>
                  <div className="fac-lh-actions">Actions</div>
                </div>

                {filtered.map((b, i) => {
                  const statusKey = (b.status ?? '').toLowerCase()
                  const meta = STATUS_META[statusKey] ?? { label: b.status ?? 'Unknown', cls: 'fac-badge--expired' }
                  const isPast = statusKey === 'expired' || statusKey === 'cancelled' || statusKey === 'rejected'
                  return (
                    <div
                      key={b.id ?? i}
                      className="fac-booking-row"
                      onClick={() => navigate(`/user/facilities/booking/${b.id}`, { state: { booking: b } })}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="fac-br-facility">
                        <div className="fac-br-icon">
                          <span className="material-symbols-outlined">meeting_room</span>
                        </div>
                        <div>
                          <p className="fac-br-name">{b.common_facilities_name ?? `Facility #${b.common_facilities_id ?? ''}`}</p>
                          <p className="fac-br-date">{b.booked_for_date ?? formatBookDate(b.booked_for)}</p>
                        </div>
                      </div>

                      <div className="fac-br-time">
                        {b.starting_time} &ndash; {b.ending_time}
                      </div>

                      <div className="fac-br-status">
                        <span className={`fac-badge ${meta.cls}`}>{meta.label}</span>
                      </div>

                      <div className="fac-br-actions">
                        {isPast
                          ? <button className="fac-br-btn fac-br-btn--primary">Receipt</button>
                          : <>
                              <button className="fac-br-btn fac-br-btn--primary">Details</button>
                              <button className="fac-br-btn fac-br-btn--danger">Cancel</button>
                            </>
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </>
      )}
    </div>
  )
}

export default FacilitiesPage
