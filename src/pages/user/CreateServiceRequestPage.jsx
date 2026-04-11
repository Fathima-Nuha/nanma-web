import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateServiceRequestPage.css'

function CreateServiceRequestPage() {
  const navigate = useNavigate()
  const goBack = () => navigate('/user/services')
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    const buildingId = localStorage.getItem('selected_building_id')
    if (!buildingId) return
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/service_vendors_in_a_building?building_id=${buildingId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      }
    )
      .then(res => res.json())
      .then(data => setVendors(data.service_vendors ?? []))
      .catch(() => {})
  }, [])

  const LAUNDRY_TYPES = ['Iron_Only', 'Wash_Only', 'Iron_And_Wash']

  const [form, setForm] = useState({
    vendor: '',
    vendorServiceId: '',
    serviceName: '',
    serviceType: '',
    serviceDate: '',
    serviceTime: '',
    noOfPieces: '',
    description: '',
  })

  const isLaundryService = LAUNDRY_TYPES.includes(form.serviceType)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [vendorOpen, setVendorOpen] = useState(false)
  const vendorRef = useRef(null)

  useEffect(() => {
    const handleClick = e => {
      if (vendorRef.current && !vendorRef.current.contains(e.target)) setVendorOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleVendorSelect = v => {
    setForm(f => ({
      ...f,
      vendorServiceId: String(v.vendor_service_id),
      vendor: v.vendor_name,
      serviceType: v.service_type,
      serviceName: v.service_type.replace(/_/g, ' '),
      noOfPieces: '',
      serviceDate: '',
      serviceTime: '',
    }))
    setVendorOpen(false)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const buildingId = localStorage.getItem('selected_building_id')
    const appartmentId = localStorage.getItem('selected_apartment_id')
    if (!buildingId || !appartmentId) {
      setError('Apartment details missing. Please re-login.')
      return
    }
    setSubmitting(true)
    setError(null)

    const now = new Date()
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const yyyy = now.getFullYear()
    const hh = String(now.getHours() % 12 || 12).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const sec = String(now.getSeconds()).padStart(2, '0')
    const ampm = now.getHours() < 12 ? 'am' : 'pm'
    const serviceDateFormatted = `${dd}/${mm}/${yyyy} ${hh}:${min}:${sec} ${ampm}`

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/create_personal_service_request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          building_id: buildingId,
          appartment_id: appartmentId,
          vendor_service_id: form.vendorServiceId,
          service_category: '',
          service_date: serviceDateFormatted,
          service_time: form.serviceTime,
          no_of_pieces: isLaundryService ? form.noOfPieces : '',
          description: form.description,
        }),
      }
    )
      .then(res => res.json())
      .then(() => navigate('/user/services'))
      .catch(() => setError('Failed to submit request. Please try again.'))
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="csr-page">
      {/* Breadcrumb */}
      <div className="csr-breadcrumb">
        <button type="button" className="csr-breadcrumb-link" onClick={goBack}>Requests</button>
        <span className="material-symbols-outlined csr-breadcrumb-sep">chevron_right</span>
        <span>Create New</span>
      </div>

      <h1 className="csr-title">Personal Service Request</h1>
      <p className="csr-subtitle">Curate your living experience. Request maintenance or premium concierge services for your private residence.</p>

      <div className="csr-layout">
        {/* Form */}
        <form className="csr-form" onSubmit={handleSubmit}>

          <div className="csr-field">
            <label className="csr-label">Select Vendor</label>
            <div className="csr-custom-select" ref={vendorRef}>
              <button
                type="button"
                className={`csr-custom-select-btn${vendorOpen ? ' open' : ''}`}
                onClick={() => setVendorOpen(o => !o)}
              >
                <span className={form.vendor ? '' : 'csr-placeholder'}>
                  {form.vendor || 'Choose a preferred service provider'}
                </span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              {vendorOpen && (
                <div className="csr-custom-select-dropdown">
                  {vendors.map(v => (
                    <button
                      key={v.vendor_service_id}
                      type="button"
                      className={`csr-custom-select-option${form.vendorServiceId === String(v.vendor_service_id) ? ' selected' : ''}`}
                      onClick={() => handleVendorSelect(v)}
                    >
                      <span className="csr-option-name">{v.vendor_name}</span>
                      <span className="csr-option-type">{v.service_type.replace(/_/g, ' ')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="csr-field">
            <label className="csr-label">Service Name</label>
            <input
              type="text"
              name="serviceName"
              className="csr-input"
              value={form.serviceName}
              placeholder="Auto-filled from vendor selection"
              readOnly
            />
          </div>

          {isLaundryService ? (
            <div className="csr-field">
              <label className="csr-label">Number of Pieces</label>
              <input
                type="number"
                name="noOfPieces"
                className="csr-input"
                value={form.noOfPieces}
                onChange={handleChange}
                placeholder="Enter number of pieces"
                min="1"
              />
            </div>
          ) : (
            <div className="csr-row">
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
              <div className="csr-field">
                <label className="csr-label">Preferred Time</label>
                <label className="csr-input-icon-wrap">
                  <input
                    type="time"
                    name="serviceTime"
                    className="csr-input"
                    value={form.serviceTime}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined csr-input-icon">schedule</span>
                </label>
              </div>
            </div>
          )}

          <div className="csr-field">
            <label className="csr-label">Description</label>
            <textarea
              name="description"
              className="csr-textarea"
              placeholder="Please provide specific details or access instructions..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {error && <p className="csr-error">{error}</p>}

          <div className="csr-footer">
            <button type="button" className="csr-draft-btn" onClick={goBack}>Save Draft</button>
            <button type="submit" className="csr-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>

        {/* Right Panel */}
        <aside className="csr-right">
          {/* Guidelines */}
          <div className="csr-guidelines">
            <div className="csr-guidelines-icon">
              <span className="material-symbols-outlined">info</span>
            </div>
            <h3 className="csr-guidelines-title">Service Guidelines</h3>
            <ul className="csr-guidelines-list">
              <li>Requests submitted after 4 PM will be processed the following business day.</li>
              <li>Premium concierge fees may apply for specific time windows.</li>
            </ul>
          </div>

          {/* Image Card */}
          <div className="csr-image-card">
            <img
              src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&q=70"
              alt="Maintaining Excellence"
              className="csr-image-card-img"
            />
            <div className="csr-image-card-overlay">
              <span className="csr-image-card-title">Maintaining Excellence</span>
              <span className="csr-image-card-desc">Our team ensures your residence stays in pristine condition.</span>
            </div>
          </div>

          {/* Need Help */}
          <div className="csr-help">
            <span className="csr-help-label">Need Immediate Help?</span>
            <div className="csr-help-row">
              <div className="csr-help-icon">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div className="csr-help-info">
                <span className="csr-help-phone">+1 800 LUXE-RS</span>
                <span className="csr-help-avail">Available 24/7</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CreateServiceRequestPage
