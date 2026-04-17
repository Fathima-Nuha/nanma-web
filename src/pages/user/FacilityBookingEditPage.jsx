import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './FacilityBookingPage.css'
import './FacilityBookingEditPage.css'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

function TimePicker({ value, onChange, required }) {
  const [hh, mm] = value ? value.split(':') : ['', '']

  const handleHour = e => {
    const h = e.target.value
    onChange(`${h}:${mm || '00'}`)
  }
  const handleMinute = e => {
    const m = e.target.value
    onChange(`${hh || '00'}:${m}`)
  }

  return (
    <div className="fb-time-picker">
      <select className="fb-time-select" value={hh || ''} onChange={handleHour} required={required}>
        <option value="" disabled>HH</option>
        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="fb-time-sep">:</span>
      <select className="fb-time-select" value={mm || ''} onChange={handleMinute} required={required}>
        <option value="" disabled>MM</option>
        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <span className="material-symbols-outlined fb-time-icon">schedule</span>
    </div>
  )
}

// Extract HH:MM from an ISO time string like "2000-01-01T13:15:00.000+05:30"
function extractHHMM(isoOrTime) {
  if (!isoOrTime) return ''
  if (isoOrTime.includes('T')) {
    const timePart = isoOrTime.split('T')[1] ?? ''
    return timePart.substring(0, 5)
  }
  return isoOrTime.substring(0, 5)
}

// Extract YYYY-MM-DD from an ISO date string
function extractDate(isoOrDate) {
  if (!isoOrDate) return ''
  if (isoOrDate.includes('T')) return isoOrDate.split('T')[0]
  return isoOrDate
}

function FacilityBookingEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state?.booking ?? null

  const [date, setDate] = useState(extractDate(booking?.booked_for ?? booking?.booked_for_date ?? ''))
  const [startTime, setStartTime] = useState(extractHHMM(booking?.start_time ?? ''))
  const [endTime, setEndTime] = useState(extractHHMM(booking?.end_time ?? ''))

  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [result, setResult] = useState(null) // 'updated' | 'deleted' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const isValid = date && startTime && endTime && endTime > startTime

  const statusKey = (booking?.status ?? '').toLowerCase()
  const bookingDate = booking?.booked_for_date ?? extractDate(booking?.booked_for ?? '')
  const isLocked =
    statusKey === 'accepted' ||
    statusKey === 'cancelled' ||
    statusKey === 'rejected' ||
    statusKey === 'expired' ||
    (bookingDate && bookingDate < today)

  const lockedReason =
    statusKey === 'accepted'  ? 'This booking has already been accepted and cannot be modified.' :
    statusKey === 'cancelled' ? 'This booking has been cancelled.' :
    statusKey === 'rejected'  ? 'This booking was rejected and cannot be modified.' :
    statusKey === 'expired'   ? 'This booking has expired.' :
    (bookingDate && bookingDate < today) ? 'The booking date has already passed.' : ''

  const handleUpdate = async e => {
    e.preventDefault()
    if (!isValid || !booking) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/update_booking_slots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            booking_id: booking.id,
            flat_id: localStorage.getItem('selected_apartment_id'),
            common_facilities_id: booking.common_facilities_id,
            booked_for: `${date}T00:00:00`,
            start_time: `${startTime}:00`,
            end_time: `${endTime}:00`,
          }),
        }
      )
      if (res.ok) {
        setResult('updated')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.message ?? 'Update failed. Please try again.')
        setResult('error')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.')
      setResult('error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!booking) return
    setDeleting(true)
    setErrorMsg('')
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/delete_booking_slots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            booking_id: booking.id,
            flat_id: localStorage.getItem('selected_apartment_id'),
          }),
        }
      )
      if (res.ok) {
        setResult('deleted')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.message ?? 'Cancellation failed. Please try again.')
        setResult('error')
        setShowDeleteConfirm(false)
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.')
      setResult('error')
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fb-page">
      {/* ── Back ── */}
      <button type="button" className="fb-back" onClick={() => navigate('/user/facilities', { state: { tab: 'requests' } })}>
        <span className="material-symbols-outlined">arrow_back</span>
        My Reservations
      </button>

      {/* ── Header ── */}
      <div className="fb-header">
        <span className="fb-eyebrow">Manage Reservation</span>
        <h1 className="fb-title">
          Edit <br />
          <span>Booking</span>
        </h1>
      </div>

      <div className="fb-layout">
        {/* ── Form Card ── */}
        <div className="fb-form-card">
          {/* Booking strip */}
          {booking && (
            <div className="fb-facility-strip">
              <div className="fb-facility-icon">
                <span className="material-symbols-outlined">meeting_room</span>
              </div>
              <div className="fb-facility-info">
                <p className="fb-facility-name">{booking.common_facilities_name}</p>
                <p className="fb-facility-desc">Booking #{booking.id}</p>
              </div>
              <div className="fb-facility-rate">
                <span className="fb-facility-rate-label">Status</span>
                <span className={`fbe-status-pill fbe-status--${(booking.status ?? '').toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
            </div>
          )}

          {result === 'updated' ? (
            <div className="fb-result">
              <span className="material-symbols-outlined fb-result-icon success">check_circle</span>
              <p className="fb-result-title">Booking Updated!</p>
              <p className="fb-result-body">Your reservation has been successfully updated.</p>
              <button type="button" className="fb-result-btn" onClick={() => navigate('/user/facilities', { state: { tab: 'requests' } })}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
                My Reservations
              </button>
            </div>
          ) : result === 'deleted' ? (
            <div className="fb-result">
              <span className="material-symbols-outlined fb-result-icon success">check_circle</span>
              <p className="fb-result-title">Reservation Cancelled</p>
              <p className="fb-result-body">Your booking has been successfully cancelled.</p>
              <button type="button" className="fb-result-btn" onClick={() => navigate('/user/facilities', { state: { tab: 'requests' } })}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
                My Reservations
              </button>
            </div>
          ) : result === 'error' ? (
            <div className="fb-result">
              <span className="material-symbols-outlined fb-result-icon error">error_outline</span>
              <p className="fb-result-title">Something went wrong</p>
              <p className="fb-result-body">{errorMsg}</p>
              <button type="button" className="fb-result-btn" onClick={() => setResult(null)}>Try Again</button>
            </div>
          ) : isLocked ? (
            <div className="fbe-locked">
              <span className="material-symbols-outlined fbe-locked-icon">lock</span>
              <p className="fbe-locked-title">Booking Not Editable</p>
              <p className="fbe-locked-body">{lockedReason}</p>
              <div className="fbe-locked-fields">
                <div className="fbe-locked-row">
                  <span className="fbe-locked-label">Date</span>
                  <span className="fbe-locked-value">{bookingDate}</span>
                </div>
                <div className="fbe-locked-row">
                  <span className="fbe-locked-label">Time</span>
                  <span className="fbe-locked-value">{booking?.starting_time} – {booking?.ending_time}</span>
                </div>
              </div>
              <button type="button" className="fb-result-btn" onClick={() => navigate('/user/facilities', { state: { tab: 'requests' } })}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
                My Reservations
              </button>
            </div>
          ) : (
            <>
              <form className="fb-form" onSubmit={handleUpdate}>
                {/* Date */}
                <div className="fb-field">
                  <label className="fb-label">Date</label>
                  <div className="fb-input-wrap">
                    <input
                      type="date"
                      className="fb-input"
                      min={today}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                    <span className="material-symbols-outlined fb-input-icon">calendar_today</span>
                  </div>
                </div>

                {/* Start / End time */}
                <div className="fb-row">
                  <div className="fb-field">
                    <label className="fb-label">Start Time</label>
                    <TimePicker value={startTime} onChange={setStartTime} required />
                  </div>
                  <div className="fb-field">
                    <label className="fb-label">End Time</label>
                    <TimePicker value={endTime} onChange={setEndTime} required />
                  </div>
                </div>

                {endTime && startTime && endTime <= startTime && (
                  <p style={{ marginTop: '-20px', fontSize: '0.75rem', color: '#ba1a1a' }}>
                    End time must be after start time.
                  </p>
                )}

                {/* Action row */}
                <div className="fbe-actions">
                  <button
                    type="button"
                    className="fbe-btn-delete"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <span className="material-symbols-outlined">cancel</span>
                    Cancel Booking
                  </button>
                  <button
                    type="submit"
                    className="fb-submit"
                    disabled={!isValid || submitting}
                    style={{ flex: 1 }}
                  >
                    {submitting ? 'Saving…' : 'Update Reservation'}
                  </button>
                </div>
              </form>

              {/* Delete confirmation overlay */}
              {showDeleteConfirm && (
                <div className="fbe-confirm-overlay">
                  <div className="fbe-confirm-box">
                    <span className="material-symbols-outlined fbe-confirm-icon">warning</span>
                    <p className="fbe-confirm-title">Cancel this booking?</p>
                    <p className="fbe-confirm-body">
                      This will permanently cancel your reservation for <strong>{booking?.common_facilities_name}</strong>. This action cannot be undone.
                    </p>
                    <div className="fbe-confirm-btns">
                      <button
                        type="button"
                        className="fbe-confirm-btn-secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                      >
                        Keep Booking
                      </button>
                      <button
                        type="button"
                        className="fbe-confirm-btn-danger"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? 'Cancelling…' : 'Yes, Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="fb-sidebar">
          <div className="fb-img-block">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=70"
              alt="Luxury facility interior"
            />
            <div className="fb-img-overlay">
              <p className="fb-img-caption">Elevated Living for the<br />Modern Resident.</p>
            </div>
          </div>
          <div className="fb-guidelines">
            <h3 className="fb-guidelines-title">Modification Policy</h3>
            <ul className="fb-guidelines-list">
              {[
                'Updates must be made at least 24 hours before the booking date.',
                'Cancellations within 6 hours of the booking may incur a maintenance surcharge.',
                'Once cancelled, the slot is released and available to other residents.',
              ].map((text, i) => (
                <li key={i} className="fb-guideline-item">
                  <span className="fb-guideline-num">0{i + 1}</span>
                  <p className="fb-guideline-text">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacilityBookingEditPage
