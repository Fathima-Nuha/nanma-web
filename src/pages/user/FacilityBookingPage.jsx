import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './FacilityBookingPage.css'

function formatAmount(amount) {
  const num = parseFloat(amount)
  if (isNaN(num)) return amount
  return num % 1 === 0 ? `Rs. ${num.toFixed(0)}` : `Rs. ${num.toFixed(2)}`
}

// Build hour options 00–23 and minute options 00, 15, 30, 45
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
      <select
        className="fb-time-select"
        value={hh || ''}
        onChange={handleHour}
        required={required}
      >
        <option value="" disabled>HH</option>
        {HOURS.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className="fb-time-sep">:</span>
      <select
        className="fb-time-select"
        value={mm || ''}
        onChange={handleMinute}
        required={required}
      >
        <option value="" disabled>MM</option>
        {MINUTES.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <span className="material-symbols-outlined fb-time-icon">schedule</span>
    </div>
  )
}

const GUIDELINES = [
  'Reservations must be made at least 24 hours in advance to ensure space preparation.',
  'Private facility usage is limited to 4 hours per session for optimal resident access.',
  'Cancellation requires 6 hours notice to avoid a maintenance surcharge.',
]

function FacilityBookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const facility = location.state?.facility ?? null

  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null) // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const isValid = date && startTime && endTime && endTime > startTime

  const handleSubmit = async e => {
    e.preventDefault()
    if (!isValid || !facility) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/create_booking_slots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            common_facilities_id: facility.id,
            building_id: localStorage.getItem('selected_building_id'),
            flat_id: localStorage.getItem('selected_apartment_id'),
            user_id: localStorage.getItem('user_id'),
            book_date: `${date}T00:00:00`,
            start_time: `${startTime}:00`,
            end_time: `${endTime}:00`,
          }),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.status !== 'error') {
        setResult('success')
      } else {
        setErrorMsg(data.message ?? 'Booking failed. Please try again.')
        setResult('error')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.')
      setResult('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fb-page">
      {/* ── Back ── */}
      <button type="button" className="fb-back" onClick={() => navigate('/user/facilities')}>
        <span className="material-symbols-outlined">arrow_back</span>
        All Facilities
      </button>

      {/* ── Header ── */}
      <div className="fb-header">
        <span className="fb-eyebrow">Reservation Portal</span>
        <h1 className="fb-title">
          Amenity <br />
          <span>Booking</span>
        </h1>
      </div>

      <div className="fb-layout">
        {/* ── Form Card ── */}
        <div className="fb-form-card">
          {/* Facility strip */}
          {facility && (
            <div className="fb-facility-strip">
              <div className="fb-facility-icon">
                <span className="material-symbols-outlined">apartment</span>
              </div>
              <div className="fb-facility-info">
                <p className="fb-facility-name">{facility.name}</p>
                <p className="fb-facility-desc">{facility.description}</p>
              </div>
              <div className="fb-facility-rate">
                <span className="fb-facility-rate-label">Per booking</span>
                <span className="fb-facility-rate-value">{formatAmount(facility.amount)}</span>
              </div>
            </div>
          )}

          {result === 'success' ? (
            <div className="fb-result">
              <span className="material-symbols-outlined fb-result-icon success">check_circle</span>
              <p className="fb-result-title">Reservation Submitted!</p>
              <p className="fb-result-body">
                Your booking for <strong>{facility?.name}</strong> on {date} is now <strong>pending approval</strong>.
              </p>
              <button
                type="button"
                className="fb-result-btn"
                onClick={() => navigate('/user/facilities', { state: { tab: 'requests' } })}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>calendar_month</span>
                View My Bookings
              </button>
            </div>
          ) : result === 'error' ? (
            <div className="fb-result">
              <span className="material-symbols-outlined fb-result-icon error">error_outline</span>
              <p className="fb-result-title">Booking Failed</p>
              <p className="fb-result-body">{errorMsg}</p>
              <button type="button" className="fb-result-btn" onClick={() => setResult(null)}>
                Try Again
              </button>
            </div>
          ) : (
            <form className="fb-form" onSubmit={handleSubmit}>
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

              {/* Notes */}
              <div className="fb-field">
                <label className="fb-label">Notes (optional)</label>
                <textarea
                  className="fb-textarea"
                  rows={3}
                  placeholder="Any special requirements or details…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="fb-submit"
                disabled={!isValid || submitting}
              >
                {submitting ? 'Confirming…' : 'Confirm Reservation'}
              </button>
            </form>
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
            <h3 className="fb-guidelines-title">Booking Guidelines</h3>
            <ul className="fb-guidelines-list">
              {GUIDELINES.map((text, i) => (
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

export default FacilityBookingPage
