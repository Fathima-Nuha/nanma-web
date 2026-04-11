import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateServiceRequestPage.css'

const TIME_SLOTS = [
  'Morning(8:00AM-11:00AM)',
  'Noon(11:00AM-2:00PM)',
  'Afternoon(2:00PM-5:00PM)',
]

function CreateCommunityServiceRequestPage() {
  const navigate = useNavigate()
  const goBack = () => navigate('/user/services?tab=community')

  const [services, setServices] = useState([])
  const [form, setForm] = useState({
    serviceName: '',
    serviceCharge: '',
    serviceDate: '',
    serviceTime: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [serviceOpen, setServiceOpen] = useState(false)
  const serviceRef = useRef(null)

  useEffect(() => {
    const buildingId = localStorage.getItem('selected_building_id')
    if (!buildingId) return
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/get_admin_services`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ building_id: Number(buildingId), admin: { building_id: Number(buildingId) } }),
      }
    )
      .then(res => res.json())
      .then(data => setServices(data.services ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClick = e => {
      if (serviceRef.current && !serviceRef.current.contains(e.target)) setServiceOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const appartmentId = localStorage.getItem('selected_apartment_id')
    if (!appartmentId) {
      setError('Apartment details missing. Please re-login.')
      return
    }
    setSubmitting(true)
    setError(null)

    const serviceDateFormatted = form.serviceDate
      ? new Date(form.serviceDate).toISOString()
      : new Date().toISOString()

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/create_service_request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          flat_id: appartmentId,
          service_name: form.serviceName,
          service_charge: parseFloat(form.serviceCharge) || 0,
          service_date: serviceDateFormatted,
          service_time: form.serviceTime,
          service_description: form.description,
        }),
      }
    )
      .then(res => res.json())
      .then(() => navigate('/user/services?tab=community'))
      .catch(() => setError('Failed to submit request. Please try again.'))
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="csr-page">
      {/* Breadcrumb */}
      <div className="csr-breadcrumb">
        <button type="button" className="csr-breadcrumb-link" onClick={goBack}>Requests</button>
        <span className="material-symbols-outlined csr-breadcrumb-sep">chevron_right</span>
        <span>Create Community Request</span>
      </div>

      <h1 className="csr-title">Community Service Request</h1>
      <p className="csr-subtitle">Request a shared service for your community. Available for all residents in your building.</p>

      <div className="csr-layout">
        {/* Form */}
        <form className="csr-form" onSubmit={handleSubmit}>

          <div className="csr-field">
            <label className="csr-label">Service Name</label>
            <div className="csr-custom-select" ref={serviceRef}>
              <button
                type="button"
                className={`csr-custom-select-btn${serviceOpen ? ' open' : ''}`}
                onClick={() => setServiceOpen(o => !o)}
              >
                <span className={form.serviceName ? '' : 'csr-placeholder'}>
                  {form.serviceName || 'Select a service type'}
                </span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              {serviceOpen && (
                <div className="csr-custom-select-dropdown">
                  {services.length === 0 ? (
                    <span className="csr-custom-select-option" style={{ color: '#aaa', cursor: 'default' }}>No services available</span>
                  ) : services.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      className={`csr-custom-select-option${form.serviceName === s.name ? ' selected' : ''}`}
                      onClick={() => {
                        setForm(f => ({ ...f, serviceName: s.name, serviceCharge: String(s.charge) }))
                        setServiceOpen(false)
                      }}
                    >
                      <span className="csr-option-name">{s.name}</span>
                      <span className="csr-option-type">₹{s.charge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="csr-row">
            <div className="csr-field">
              <label className="csr-label">Service Charge (₹)</label>
              <input
                type="number"
                name="serviceCharge"
                className="csr-input"
                value={form.serviceCharge}
                placeholder="Auto-filled from service selection"
                readOnly
              />
            </div>
            <div className="csr-field">
              <label className="csr-label">Service Date</label>
              <label className="csr-input-icon-wrap">
                <input
                  type="date"
                  name="serviceDate"
                  className="csr-input"
                  value={form.serviceDate}
                  onChange={handleChange}
                />
                <span className="material-symbols-outlined csr-input-icon">calendar_month</span>
              </label>
            </div>
          </div>

          <div className="csr-field">
            <label className="csr-label">Preferred Time Slot</label>
            <select
              name="serviceTime"
              className="csr-input"
              value={form.serviceTime}
              onChange={handleChange}
            >
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot.replace(/([A-Z])/g, ' $1').trim()}</option>
              ))}
            </select>
          </div>

          <div className="csr-field">
            <label className="csr-label">Description</label>
            <textarea
              name="description"
              className="csr-textarea"
              placeholder="Describe the service needed..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {error && <p className="csr-error">{error}</p>}

          <div className="csr-footer">
            <button type="button" className="csr-draft-btn" onClick={goBack}>Cancel</button>
            <button type="submit" className="csr-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>

        {/* Right Panel */}
        <aside className="csr-right">
          <div className="csr-guidelines">
            <div className="csr-guidelines-icon">
              <span className="material-symbols-outlined">info</span>
            </div>
            <h3 className="csr-guidelines-title">Community Guidelines</h3>
            <ul className="csr-guidelines-list">
              <li>Community requests are shared across all residents in your building.</li>
              <li>Service charges shown are per household unless stated otherwise.</li>
              <li>Requests are subject to admin approval before scheduling.</li>
            </ul>
          </div>

          <div className="csr-image-card">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70"
              alt="Community Services"
              className="csr-image-card-img"
            />
            <div className="csr-image-card-overlay">
              <span className="csr-image-card-title">Better Together</span>
              <span className="csr-image-card-desc">Shared services make community living more affordable and convenient.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CreateCommunityServiceRequestPage
