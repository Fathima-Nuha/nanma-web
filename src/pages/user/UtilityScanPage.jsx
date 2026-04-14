import React, { useState, useRef, useEffect } from 'react'
import './UtilityScanPage.css'

const UTILITY_TABS = [
    { key: 'gas', label: 'Gas', icon: 'local_fire_department' },
    { key: 'water', label: 'Water', icon: 'water_drop' },
    { key: 'electricity', label: 'Electricity', icon: 'bolt' },
]

const ELECTRICITY_CONFIG = {
  unit: 'kWh',
  placeholder: '00000.0',
  rateAmount: '₹ 7.50',
  rateUnit: 'per kWh unit',
  rateNote: '*Rates are subject to KSEB tariff adjustments.',
  previousReading: '4,820.5',
  utilityType: 'electricity',
  rateChipIcon: 'bolt',
}

const GAS_CONFIG = {
  unit: 'SCM',
  placeholder: '0000.00',
  rateAmount: '₹ 48.50',
  rateUnit: 'per SCM unit',
  rateNote: '*Rates are subject to municipal adjustments.',
  previousReading: '1,240.50',
  utilityType: 'gas',
  rateChipIcon: 'local_fire_department',
  ratePerUnit: 48.5,
  editorialTag: 'Sustainable Living',
  editorialTitle: 'Architecture of Responsibility',
  editorialImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
}

const WATER_CONFIG = {
  unit: 'KL',
  placeholder: '00000.0',
  rateAmount: '₹ 18.00',
  rateUnit: 'per KL',
  rateNote: '*Rates are subject to KWA tariff adjustments.',
  previousReading: '320.5',
  utilityType: 'water',
  rateChipIcon: 'water_drop',
  ratePerUnit: 18.0,
  editorialTag: 'Water Conservation',
  editorialTitle: 'Every Drop Counts',
  editorialImg: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&q=80',
}

const GUIDELINES = [
  {
    title: 'Ensure Good Lighting',
    desc: 'Use your phone flash if the meter is located in a dark utility area.',
  },
  {
    title: 'Capture All Digits',
    desc: 'Focus on the display showing the full numeric reading including decimals.',
  },
  {
    title: 'Submission Window',
    desc: 'Readings must be submitted between the 1st and 5th of each month.',
  },
]

function getCurrentPeriod() {
  return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

const SAMPLE_BILLS = [
  { id: 1, period: 'March 2026',   uploaded_at: '2026-04-01T10:00:00Z', bill_image_url: 'https://placehold.co/600x800?text=March+2026' },
  { id: 2, period: 'February 2026', uploaded_at: '2026-03-02T10:00:00Z', bill_image_url: 'https://placehold.co/600x800?text=Feb+2026' },
  { id: 3, period: 'January 2026',  uploaded_at: '2026-02-01T10:00:00Z', bill_image_url: 'https://placehold.co/600x800?text=Jan+2026' },
]

function ElectricityTab() {
  const [bills, setBills] = useState(SAMPLE_BILLS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lightboxUrl, setLightboxUrl] = useState(null)

  useEffect(() => {
    const flatId = localStorage.getItem('selected_apartment_id')
    const buildingId = localStorage.getItem('selected_building_id')
    const token = localStorage.getItem('access_token')
    if (!flatId || !buildingId) return
    setLoading(true)
    setError(null)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/get_electricity_bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ flat_id: flatId, building_id: buildingId }),
    })
      .then(res => res.json())
      .then(data => setBills(data.bills?.length ? data.bills : SAMPLE_BILLS))
      .catch(() => setError('Failed to load bills. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="ec-wrap">
      <div className="ec-bills-header">
        <div>
          <h3 className="ec-bills-title">Electricity Bills</h3>
          <p className="ec-bills-subtitle">Bills uploaded by management. Tap any bill to view the full image.</p>
        </div>
        <div className="ec-bills-header-icon-wrap">
          <span className="material-symbols-outlined">electric_bolt</span>
        </div>
      </div>

      {loading && (
        <div className="ec-state-wrap">
          <div className="ec-loading-spinner" />
          <p>Loading bills…</p>
        </div>
      )}

      {!loading && error && (
        <div className="ec-state-wrap">
          <span className="material-symbols-outlined ec-state-icon error">error_outline</span>
          <p className="ec-state-text">{error}</p>
        </div>
      )}

      {!loading && !error && bills.length === 0 && (
        <div className="ec-state-wrap">
          <span className="material-symbols-outlined ec-state-icon">receipt_long</span>
          <p className="ec-state-text">No bills have been uploaded yet.</p>
          <p className="ec-state-sub">Your electricity bills will appear here once management uploads them.</p>
        </div>
      )}

      {!loading && !error && bills.length > 0 && (
        <div className="ec-bills-list">
          <div className="ec-list-header">
            <span>Billing Period</span>
            <span>Action</span>
          </div>
          <div className="ec-list-body">
            {bills.map((bill, i) => (
              <div key={bill.id ?? i} className="ec-list-row">
                <div className="ec-list-period">
                  <p className="ec-list-period-name">{bill.period ?? '—'}</p>
                  <p className="ec-list-period-sub">
                    {bill.uploaded_at
                      ? `Uploaded on ${new Date(bill.uploaded_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
                      : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="ec-list-view-btn"
                  onClick={() => setLightboxUrl(bill.bill_image_url)}
                >
                  View Bill
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="ec-lightbox-backdrop"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="ec-lightbox-close"
            onClick={() => setLightboxUrl(null)}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <img
            src={lightboxUrl}
            alt="Bill"
            className="ec-lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

function ComingSoonTab({ label, icon }) {
  return (
    <div className="us-coming-soon">
      <span className="material-symbols-outlined">{icon}</span>
      <h3>{label} Utility Scan</h3>
      <p>This feature is coming soon. You'll be able to track your {label.toLowerCase()} consumption and submit monthly readings here.</p>
    </div>
  )
}

function UtilityReadingTab({ config }) {
  const [readingValue, setReadingValue] = useState('')
  const [meterImage, setMeterImage] = useState(null)
  const [meterPreview, setMeterPreview] = useState(null)
  const [imgLoading, setImgLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const fileInputRef = useRef(null)

  const prevReading = parseFloat(config.previousReading.replace(/,/g, '')) || 0
  const currentReading = parseFloat(readingValue) || 0
  const consumed = currentReading > prevReading ? (currentReading - prevReading).toFixed(2) : null
  const estimatedBill =
    consumed !== null
      ? `₹ ${(parseFloat(consumed) * config.ratePerUnit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '---'

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setMeterImage(file)
    setImgLoading(true)
    setMeterPreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setMeterImage(null)
    setMeterPreview(null)
    setImgLoading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit() {
    if (!readingValue) {
      setSubmitError('Please enter the current meter reading.')
      return
    }
    if (currentReading <= prevReading) {
      setSubmitError('Current reading must be greater than the previous reading.')
      return
    }
    const flatId = localStorage.getItem('selected_apartment_id')
    const buildingId = localStorage.getItem('selected_building_id')
    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('access_token')
    const body = new FormData()
    body.append('flat_id', flatId)
    body.append('building_id', buildingId)
    body.append('user_id', userId)
    body.append('utility_type', config.utilityType)
    body.append('current_reading', readingValue)
    if (meterImage) body.append('meter_image', meterImage)
    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/submit_utility_reading`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed.')
      setSubmitSuccess(true)
      setReadingValue('')
      handleRemoveImage()
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fileInputId = `us-file-input-${config.utilityType}`

  return (
    <div className="us-grid">
      <div>
        <div className="us-card">
          <div className="us-card-period">
            <div>
              <p className="us-period-label">Billing Period</p>
              <h3 className="us-period-value">{getCurrentPeriod()}</h3>
            </div>
            <div className="us-card-period-right">
              <a href="#" className="us-history-link">View Bill History</a>
              <div className="us-rate-chip">
                <span className="material-symbols-outlined us-rate-chip-icon">{config.rateChipIcon}</span>
                <div className="us-rate-chip-body">
                  <span className="us-rate-chip-label">Current Rate</span>
                  <span className="us-rate-chip-value">
                    {config.rateAmount}
                    <span className="us-rate-chip-unit"> / {config.unit}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="us-card-body">
            <div className="us-input-col">
              <div className="us-input-group">
                <label className="us-input-label">Current Reading ({config.unit})</label>
                <input
                  className="us-reading-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={config.placeholder}
                  value={readingValue}
                  onChange={e => setReadingValue(e.target.value)}
                />
                <span className="us-input-unit">{config.unit}</span>
              </div>
              <div className="us-summary">
                <div className="us-summary-row">
                  <span className="us-summary-label">Previous Reading</span>
                  <span className="us-summary-value">{config.previousReading}</span>
                </div>
                <div className="us-summary-row">
                  <span className="us-summary-label">Consumed Units</span>
                  <span className="us-summary-value">{consumed !== null ? `${consumed} ${config.unit}` : '---'}</span>
                </div>
                <hr className="us-summary-divider" />
                <div className="us-summary-row">
                  <span className="us-summary-total-label">Est. Bill Amount</span>
                  <span className="us-summary-total-value">{estimatedBill}</span>
                </div>
              </div>
            </div>

            <div className="us-upload-col">
              <label htmlFor={fileInputId}>
                <div className={`us-dropzone${meterPreview ? ' has-image' : ''}`}>
                  {meterPreview ? (
                    <>
                      <img
                        src={meterPreview}
                        alt="Meter preview"
                        className="us-preview-img"
                        style={{ display: imgLoading ? 'none' : 'block' }}
                        onLoad={() => setImgLoading(false)}
                      />
                      {imgLoading && (
                        <div className="us-preview-loading">
                          <div className="us-preview-spinner" />
                          <span>Loading…</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="us-dropzone-icon-wrap">
                        <span className="material-symbols-outlined">photo_camera</span>
                      </div>
                      <div className="us-dropzone-hint">
                        <p>Scan Meter</p>
                        <p>or upload a clear photo of the display</p>
                      </div>
                    </>
                  )}
                </div>
              </label>
              {meterPreview && (
                <button type="button" className="us-preview-remove" onClick={handleRemoveImage} aria-label="Remove image">
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
              <input
                id={fileInputId}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="us-hidden-input"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          <div className="us-submit-row">
            <button type="button" className="us-submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <><div className="us-btn-spinner" />Submitting…</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>Submit Reading</>
              )}
            </button>
          </div>
          {submitSuccess && <p className="us-feedback success">Reading submitted successfully!</p>}
          {submitError && <p className="us-feedback error">{submitError}</p>}
        </div>
      </div>

      <div className="us-sidebar">
        <div className="us-editorial">
          <img className="us-editorial-img" src={config.editorialImg} alt={config.editorialTag} />
          <div className="us-editorial-overlay" />
          <div className="us-editorial-caption">
            <p className="us-editorial-caption-tag">{config.editorialTag}</p>
            <h4 className="us-editorial-caption-title">{config.editorialTitle}</h4>
          </div>
        </div>
        <div className="us-guidelines">
          <h5 className="us-guidelines-title">Reading Guidelines</h5>
          <ul className="us-guidelines-list">
            {GUIDELINES.map((g, i) => (
              <li key={i} className="us-guideline-item">
                <span className="material-symbols-outlined">check_circle</span>
                <div>
                  <p className="us-guideline-title">{g.title}</p>
                  <p className="us-guideline-desc">{g.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function UtilityScanPage() {
  const [activeTab, setActiveTab] = useState('gas')

  return (
    <div className="us-page">
      <header className="us-header">
        <h1 className="us-title">Utility Management</h1>
        <p className="us-subtitle">
          Submit your monthly meter readings to ensure accurate billing and track your sustainable living goals.
        </p>
      </header>

      {/* Utility type tabs */}
      <div className="us-tabs">
        {UTILITY_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`us-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'gas' && <UtilityReadingTab config={GAS_CONFIG} />}
      {activeTab === 'water' && <UtilityReadingTab config={WATER_CONFIG} />}
      {activeTab === 'electricity' && <ElectricityTab />}
    </div>
  )
}

export default UtilityScanPage
