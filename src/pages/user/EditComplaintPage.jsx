import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './CreateComplaintPage.css'

const TOPIC_CHIPS = ['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Security', 'Pest Control']

function EditComplaintPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef(null)

  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [form, setForm] = useState({ topic: '', description: '' })
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imgLoading, setImgLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Load existing complaint data
  useEffect(() => {
    const flatId = localStorage.getItem('selected_apartment_id')
    if (!flatId || !id) return
    setLoadingData(true)
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
        if (!c) { setLoadError('Complaint not found.'); return }
        setForm({ topic: c.topic ?? '', description: c.description ?? '' })
        if (c.complaint_image) {
          setExistingImageUrl(c.complaint_image)
          setImagePreview(c.complaint_image)
        }
      })
      .catch(() => setLoadError('Failed to load complaint.'))
      .finally(() => setLoadingData(false))
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleFileSelect = file => {
    if (!file) return
    setImgLoading(true)
    setExistingImageUrl(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = e => {
    e.stopPropagation()
    setImageFile(null)
    setImagePreview(null)
    setExistingImageUrl(null)
    setImgLoading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
    body.append('complaint_id', id)
    body.append('flat_id', flatId)
    body.append('building_id', buildingId)
    body.append('topic', form.topic.trim())
    body.append('description', form.description.trim())
    if (imageFile) body.append('complaint_image', imageFile)

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/update_complaint`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body,
    })
      .then(res => res.json())
      .then(data => {
        if (data.error || data.errors) {
          setError(data.error ?? data.errors ?? 'Update failed.')
          setSubmitting(false)
          return
        }
        navigate(`/user/complaints/${id}`)
      })
      .catch(() => {
        setError('Failed to update complaint. Please try again.')
        setSubmitting(false)
      })
  }

  if (loadingData) return <div className="cc-page"><p className="cc-load-msg">Loading complaint…</p></div>
  if (loadError) return <div className="cc-page"><p className="cc-load-msg cc-load-error">{loadError}</p></div>

  return (
    <div className="cc-page">
      {/* Breadcrumbs */}
      <nav className="cc-breadcrumbs">
        <button type="button" className="cc-breadcrumb-link" onClick={() => navigate('/user/dashboard')}>Dashboard</button>
        <span className="material-symbols-outlined cc-breadcrumb-sep">chevron_right</span>
        <button type="button" className="cc-breadcrumb-link" onClick={() => navigate('/user/complaints')}>Complaints</button>
        <span className="material-symbols-outlined cc-breadcrumb-sep">chevron_right</span>
        <button type="button" className="cc-breadcrumb-link" onClick={() => navigate(`/user/complaints/${id}`)}>Complaint Details</button>
        <span className="material-symbols-outlined cc-breadcrumb-sep">chevron_right</span>
        <span className="cc-breadcrumb-current">Edit Complaint</span>
      </nav>

      {/* Editorial Header */}
      <header className="cc-header">
        <span className="cc-header-eyebrow">Update Request</span>
        <h1 className="cc-header-title">
          Edit Your<br />
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
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div className="cc-field">
                <label className="cc-label">Image / Evidence</label>
                <div
                  className={`cc-dropzone ${dragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <>
                      {imgLoading && (
                        <div className="cc-preview-uploading">
                          <span className="cc-spinner" />
                          <span>Loading…</span>
                        </div>
                      )}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="cc-preview-img"
                        onLoad={() => setImgLoading(false)}
                        style={imgLoading ? { visibility: 'hidden' } : {}}
                      />
                      {!imgLoading && !submitting && (
                        <label htmlFor="ec-file-input" className="cc-preview-overlay">
                          <span className="material-symbols-outlined">photo_camera</span>
                          <span>Change image</span>
                        </label>
                      )}
                      {!imgLoading && submitting && (
                        <div className="cc-preview-uploading">
                          <span className="cc-spinner" />
                          <span>Uploading…</span>
                        </div>
                      )}
                      {!imgLoading && !submitting && (
                        <button
                          type="button"
                          className="cc-preview-remove"
                          onClick={handleRemoveImage}
                          aria-label="Remove image"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <label htmlFor="ec-file-input" className="cc-upload-label">
                      <div className="cc-dropzone-icon">
                        <span className="material-symbols-outlined">cloud_upload</span>
                      </div>
                      <p className="cc-dropzone-title">Drag and drop evidence here</p>
                      <p className="cc-dropzone-sub">JPG, PNG up to 10MB each</p>
                    </label>
                  )}
                  <input
                    ref={fileInputRef}
                    id="ec-file-input"
                    type="file"
                    accept="image/*"
                    className="cc-hidden-input"
                    onChange={e => handleFileSelect(e.target.files?.[0])}
                  />
                </div>
                <div className="cc-media-icons">
                  <div className="cc-media-icon"><span className="material-symbols-outlined">image</span></div>
                  <div className="cc-media-icon"><span className="material-symbols-outlined">videocam</span></div>
                  <div className="cc-media-icon"><span className="material-symbols-outlined">mic</span></div>
                </div>
              </div>

              {error && <p className="cc-error">{error}</p>}

              {/* Actions */}
              <div className="cc-edit-actions">
                <button
                  type="button"
                  className="cc-cancel-edit-btn"
                  onClick={() => navigate(`/user/complaints/${id}`)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="cc-submit-btn cc-submit-btn--flex" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Changes'}
                  {!submitting && <span className="material-symbols-outlined">check</span>}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="cc-sidebar">
          <div className="cc-guidelines-card">
            <h4 className="cc-guidelines-title">Editing Guidelines</h4>
            <ul className="cc-guidelines-list">
              <li className="cc-guideline-item">
                <span className="cc-guideline-num">01</span>
                <p>Update the topic and description to reflect the current state of the issue.</p>
              </li>
              <li className="cc-guideline-item">
                <span className="cc-guideline-num">02</span>
                <p>You can replace the existing image by selecting or dragging a new one.</p>
              </li>
              <li className="cc-guideline-item">
                <span className="cc-guideline-num">03</span>
                <p>Complaints that are already resolved or closed may not be editable.</p>
              </li>
            </ul>
          </div>

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

export default React.memo(EditComplaintPage)
