import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateComplaintPage.css'

const TOPIC_CHIPS = ['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Security', 'Pest Control']

function CreateComplaintPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ topic: '', description: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleFileSelect = file => {
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFileSelect(file)
  }

  const handleSubmit = e => {
    e.preventDefault()
    const flatId = localStorage.getItem('selected_apartment_id')
    const buildingId = localStorage.getItem('selected_building_id')
    if (!flatId || !buildingId) { setError('Apartment details missing. Please re-login.'); return }
    if (!form.topic.trim()) { setError('Please enter a complaint topic.'); return }
    if (!form.description.trim()) { setError('Please enter a description.'); return }

    setSubmitting(true)
    setError(null)

    const body = new FormData()
    body.append('flat_id', flatId)
    body.append('building_id', buildingId)
    body.append('topic', form.topic.trim())
    body.append('description', form.description.trim())
    if (imageFile) body.append('complaint_image', imageFile)

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/create_complaint`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body,
    })
      .then(res => res.json())
      .then(data => {
        if (data.error || data.errors) {
          setError(data.error ?? data.errors ?? 'Submission failed.')
          setSubmitting(false)
          return
        }
        navigate('/user/complaints')
      })
      .catch(() => {
        setError('Failed to submit complaint. Please try again.')
        setSubmitting(false)
      })
  }

  return (
    <div className="cc-page">
      {/* Breadcrumbs */}
      <nav className="cc-breadcrumbs">
        <button type="button" className="cc-breadcrumb-link" onClick={() => navigate('/user/dashboard')}>Dashboard</button>
        <span className="material-symbols-outlined cc-breadcrumb-sep">chevron_right</span>
        <button type="button" className="cc-breadcrumb-link" onClick={() => navigate('/user/complaints')}>Complaints</button>
        <span className="material-symbols-outlined cc-breadcrumb-sep">chevron_right</span>
        <span className="cc-breadcrumb-current">File New Complaint</span>
      </nav>

      {/* Editorial Header */}
      <header className="cc-header">
        <span className="cc-header-eyebrow">Request Maintenance</span>
        <h1 className="cc-header-title">
          File a New<br />
          <span className="cc-header-accent">Complaint</span>
        </h1>
      </header>

      <div className="cc-layout">
        {/* Form */}
        <section className="cc-form-section">
          <div className="cc-form-card">
            <form className="cc-form" onSubmit={handleSubmit}>
              {/* Topic */}
              <div className="cc-field">
                <label className="cc-label">Complaint Topic</label>
                <div className="cc-input-wrap">
                  <input
                    className="cc-input"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    placeholder="e.g., Plumbing, Electrical, Security"
                    autoComplete="off"
                  />
                </div>
                {/* Quick chips */}
                <div className="cc-chips">
                  {TOPIC_CHIPS.map(chip => (
                    <button
                      key={chip}
                      type="button"
                      className={`cc-chip ${form.topic === chip ? 'active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, topic: chip }))}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="cc-field">
                <label className="cc-label">Description</label>
                <textarea
                  className="cc-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about the issue..."
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="cc-field">
                <label className="cc-label">Add Image / Evidence</label>
                <div
                  className={`cc-dropzone ${dragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="cc-preview-img" />
                      <div className="cc-preview-overlay">
                        <span className="material-symbols-outlined">photo_camera</span>
                        <span>Change image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="cc-dropzone-icon">
                        <span className="material-symbols-outlined">cloud_upload</span>
                      </div>
                      <p className="cc-dropzone-title">Drag and drop evidence here</p>
                      <p className="cc-dropzone-sub">JPG, PNG up to 10MB each</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="cc-hidden-input"
                    onChange={e => handleFileSelect(e.target.files?.[0])}
                  />
                </div>
                {/* Media type icons */}
                <div className="cc-media-icons">
                  <div className="cc-media-icon"><span className="material-symbols-outlined">image</span></div>
                  <div className="cc-media-icon"><span className="material-symbols-outlined">videocam</span></div>
                  <div className="cc-media-icon"><span className="material-symbols-outlined">mic</span></div>
                </div>
              </div>

              {error && <p className="cc-error">{error}</p>}

              {/* Submit */}
              <button type="submit" className="cc-submit-btn" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Complaint'}
                {!submitting && <span className="material-symbols-outlined">send</span>}
              </button>
            </form>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="cc-sidebar">
          {/* Guidelines */}
          <div className="cc-guidelines-card">
            <h4 className="cc-guidelines-title">Complaint Guidelines</h4>
            <ul className="cc-guidelines-list">
              <li className="cc-guideline-item">
                <span className="cc-guideline-num">01</span>
                <p>Be specific about the location and nature of the issue to help our team respond faster.</p>
              </li>
              <li className="cc-guideline-item">
                <span className="cc-guideline-num">02</span>
                <p>Attach photos or videos when possible to provide visual context for the technicians.</p>
              </li>
              <li className="cc-guideline-item">
                <span className="cc-guideline-num">03</span>
                <p>For urgent safety matters, please contact our support desk directly.</p>
              </li>
            </ul>
          </div>

          {/* Common topics */}
          <div className="cc-chips-block">
            {TOPIC_CHIPS.map(chip => (
              <button
                key={chip}
                type="button"
                className={`cc-chip ${form.topic === chip ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, topic: chip }))}
              >
                {chip}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default React.memo(CreateComplaintPage)
