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
  previousReading: '0',
  utilityType: 'gas',
  rateChipIcon: 'local_fire_department',
  ratePerUnit: 48.5,
  editorialTag: 'Sustainable Living',
  editorialTitle: 'Architecture of Responsibility',
  editorialImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  detailApi: '/api/v1/get_gas_utility_detail',
  statusApi: '/api/v1/get_gas_utility_status',
  submitApi: '/api/v1/add_current_reading',
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
  statusApi: '/api/v1/water_utility_status',
  detailApi: '/api/v1/get_water_generated_entries',
  submitApi: '/api/v1/request_to_verify_water',
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

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

const SAMPLE_BILLS = [
  { month: 3, year: 2026, image: 'https://placehold.co/600x800?text=March+2026',    updated_by: 'Management' },
  { month: 2, year: 2026, image: 'https://placehold.co/600x800?text=Feb+2026',      updated_by: 'Management' },
  { month: 1, year: 2026, image: 'https://placehold.co/600x800?text=Jan+2026',      updated_by: 'Management' },
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
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/get_electricity_bill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appartment_id: flatId, building_id: buildingId }),
    })
      .then(res => res.json())
      .then(data => setBills(data.electricity_details?.length ? data.electricity_details : SAMPLE_BILLS))
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
            <div className="ec-list-header-left">
              <div className="ec-list-header-spacer" />
              <span>Billing Period</span>
            </div>
            <span>Action</span>
          </div>
          <div className="ec-list-body">
            {bills.map((bill, i) => {
              const period = bill.month && bill.year
                ? `${MONTH_NAMES[bill.month - 1]} ${bill.year}`
                : '—'
              const subText = bill.updated_by ? `Updated by ${bill.updated_by}` : ''
              const imageUrl = bill.image
              return (
                <div key={bill.id ?? i} className="ec-list-row">
                  <div className="ec-list-row-left">
                    <div className="ec-list-row-icon">
                      <span className="material-symbols-outlined">receipt_long</span>
                    </div>
                    <div className="ec-list-period">
                      <p className="ec-list-period-name">{period}</p>
                      <p className="ec-list-period-sub">{subText}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ec-list-view-btn"
                    onClick={() => setLightboxUrl(imageUrl)}
                  >
                    <span className="material-symbols-outlined">open_in_new</span>
                    View Bill
                  </button>
                </div>
              )
            })}
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
  const [meterImage, setMeterImage]     = useState(null)
  const [meterPreview, setMeterPreview] = useState(null)
  const [imgLoading, setImgLoading]     = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError]   = useState(null)
  const fileInputRef = useRef(null)

  // ── Detail API ──────────────────────────────────
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError]     = useState(null)
  const [fetchedDetail, setFetchedDetail] = useState(null)
  const [noBill, setNoBill]               = useState(false)
  const [billStatus, setBillStatus]       = useState(null)

  useEffect(() => {
    if (!config.statusApi) return
    const flatId     = localStorage.getItem('selected_apartment_id')
    const buildingId = localStorage.getItem('selected_building_id')
    const token      = localStorage.getItem('access_token')
    if (!flatId || !buildingId) return

    setDetailLoading(true)
    setDetailError(null)
    setNoBill(false)
    setBillStatus(null)

    const base    = import.meta.env.VITE_API_BASE_URL
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    const common  = { appartment_id: flatId, building_id: buildingId }

    // Step 1 — get status
    fetch(`${base}${config.statusApi}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(common),
    })
      .then(res => res.json())
      .then(status => {
        setBillStatus(status.status)
        if (status.status === 4) {
          setNoBill(true)
          setDetailLoading(false)
          return
        }

        // Step 2 — get detail using month/year from status
        return fetch(`${base}${config.detailApi}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...common, month: status.month, year: status.year }),
        })
          .then(res => res.json())
          .then(data => {
            setFetchedDetail(data)
            // gas uses 'current_reading', water uses 'reading'
            const submittedReading = parseFloat(data.current_reading ?? data.reading ?? 0)
            if (submittedReading > 0) {
              setReadingValue(submittedReading.toString())
            }
          })
      })
      .catch(() => setDetailError('Could not load utility details. Showing defaults.'))
      .finally(() => setDetailLoading(false))
  }, [config.statusApi, config.detailApi])

  // ── Derive live values from API or fall back to config ──
  const prevReading = parseFloat(
    String(fetchedDetail?.previous_reading ?? config.previousReading).replace(/,/g, '')
  ) || 0

  const liveRatePerUnit = fetchedDetail?.unit_rate
    ? parseFloat(fetchedDetail.unit_rate)
    : config.ratePerUnit

  const liveRateAmount = fetchedDetail?.unit_rate
    ? `₹ ${parseFloat(fetchedDetail.unit_rate).toFixed(2)}`
    : config.rateAmount

  const prevReadingDisplay = fetchedDetail?.previous_reading
    ? parseFloat(fetchedDetail.previous_reading).toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : config.previousReading

  const alreadySubmitted = billStatus === 1

  // ── Calculations ─────────────────────────────────
  const currentReading = parseFloat(readingValue) || 0
  const consumed = currentReading > prevReading
    ? (currentReading - prevReading).toFixed(2)
    : null
  const estimatedBill = consumed !== null
    ? `₹ ${(parseFloat(consumed) * liveRatePerUnit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '---'

  // ── File handlers ─────────────────────────────────
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

  // ── Submit ────────────────────────────────────────
  async function handleSubmit() {
    if (!readingValue) {
      setSubmitError('Please enter the current meter reading.')
      return
    }
    if (currentReading <= prevReading) {
      setSubmitError('Current reading must be greater than the previous reading.')
      return
    }
    const token = localStorage.getItem('access_token')

    const consumedUnits = consumed !== null ? parseFloat(consumed) : 0
    const additionalCharge = parseFloat(fetchedDetail?.additional_charge ?? 0)
    const billAmount = (consumedUnits * liveRatePerUnit + additionalCharge).toFixed(2)

    const body = new FormData()
    body.append('current_reading', readingValue)
    body.append('consumed_unit',   consumedUnits.toFixed(2))

    if (config.utilityType === 'gas') {
      // gas_utility_detail_id (singular) is what the submit API expects
      body.append('gas_utility_detail_id', fetchedDetail?.gas_utility_details_id ?? '')
      body.append('current_bill_amount',   billAmount)
      if (meterImage) body.append('image', meterImage)
    } else if (config.utilityType === 'water') {
      body.append('water_utility_details_id', fetchedDetail?.water_utility_details_id ?? '')
      body.append('total_amount', billAmount)
      if (meterImage) body.append('bill_image', meterImage)
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      const res  = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${config.submitApi}`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed.')
      setSubmitSuccess(true)
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
          {/* Detail loading overlay */}
          {detailLoading && (
            <div className="us-detail-loading">
              <div className="us-btn-spinner" style={{ width: 22, height: 22, borderColor: 'rgba(110,92,55,0.2)', borderTopColor: '#6e5c37' }} />
              <span>Loading utility details…</span>
            </div>
          )}

          {/* Already submitted banner */}
          {!detailLoading && alreadySubmitted && (
            <div className="us-submitted-banner">
              <span className="material-symbols-outlined">check_circle</span>
              Reading already submitted for this month. You can update it below.
            </div>
          )}

          {/* No active bill — all cancelled or none created */}
          {!detailLoading && noBill && (
            <div className="us-no-bill">
              <div className="us-no-bill-icon">
                <span className="material-symbols-outlined">remove_circle</span>
              </div>
              <div>
                <p className="us-no-bill-title">No Active Bill Pending</p>
                <p className="us-no-bill-sub">Your gas bill for this month hasn&apos;t been generated yet and no pending bills exist. Please contact management for more information.</p>
              </div>
            </div>
          )}

          {/* Detail fetch error */}
          {!detailLoading && detailError && (
            <div className="us-submitted-banner warn">
              <span className="material-symbols-outlined">info</span>
              {detailError}
            </div>
          )}

          <div className="us-card-period" style={{ display: noBill ? 'none' : '' }}>
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
                    {liveRateAmount}
                    <span className="us-rate-chip-unit"> / {config.unit}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="us-card-body" style={{ display: noBill ? 'none' : '' }}>
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
                  <span className="us-summary-value">
                    {detailLoading ? '—' : prevReadingDisplay}
                  </span>
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

          <div className="us-submit-row" style={{ display: noBill ? 'none' : '' }}>
            {billStatus === 2 ? (
              <button type="button" className="us-submit-btn us-pay-now-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payment</span>
                Pay Now
              </button>
            ) : (
              <button
                type="button"
                className="us-submit-btn"
                onClick={billStatus === 1 ? undefined : handleSubmit}
                disabled={submitting || billStatus === 1}
              >
                {submitting ? (
                  <><div className="us-btn-spinner" />Submitting…</>
                ) : billStatus === 1 ? (
                  <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>Already Submitted</>
                ) : (
                  <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>Submit Reading</>
                )}
              </button>
            )}
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
