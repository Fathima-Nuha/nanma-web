import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AddFlatPage.css'

function AddFlatPage() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('user_name') || ''
  const [form, setForm] = useState({ buildingId: '', buildingName: '', flatNumber: '', flatId: '' })
  const [buildings, setBuildings] = useState([])
  const [apartments, setApartments] = useState([])
  const [buildingSearch, setBuildingSearch] = useState('')
  const [flatSearch, setFlatSearch] = useState('')
  const [showBuildingSuggestions, setShowBuildingSuggestions] = useState(false)
  const [showFlatSuggestions, setShowFlatSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/get_building_list`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setBuildings(data.buildings?.filter(b => b.status) ?? []))
      .catch(() => {})
  }, [])

  const fetchApartments = (buildingId) => {
    const token = localStorage.getItem('access_token')
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/list_available_appartments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ building_id: buildingId }),
    })
      .then(r => r.json())
      .then(data => setApartments(data.available_appartments ?? []))
      .catch(() => {})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.buildingName.trim() || !form.flatNumber.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/add_flat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          building_id: form.buildingId,
          flat_id: form.flatId,
          flat_number: form.flatNumber.trim(),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Failed to add flat. Please try again.')
        return
      }
      navigate('/select-apartment')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="nanma-add-flat-page">
      {/* ── Left Panel ── */}
      <section className="nanma-add-flat-left">
        {/* Diamond star SVG */}
        <svg className="nanma-add-flat-star" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
          <path d="M100 0C100 55.2285 55.2285 100 0 100C55.2285 100 100 144.772 100 200C100 144.772 144.772 100 200 100C144.772 100 100 55.2285 100 0Z" />
        </svg>

        <div className="nanma-add-flat-brand">Nanma Living</div>

        <div className="nanma-add-flat-quote">
          <p>
            "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
          </p>
          <cite>— Le Corbusier</cite>
        </div>

        <div className="nanma-add-flat-left-line" aria-hidden="true" />
      </section>

      {/* ── Right Panel ── */}
      <section className="nanma-add-flat-right">
        <div className="nanma-add-flat-header">
          <h1>Add New Flat</h1>
          <p>Register a new property unit within the management system.</p>
        </div>

        <div className="nanma-add-flat-card">
          <form onSubmit={handleSubmit} noValidate>
            {/* Name — pre-filled from login, read-only */}
            <div className="nanma-add-flat-field">
              <label htmlFor="add-flat-name">Name</label>
              <div className="nanma-add-flat-input-wrap">
                <input
                  id="add-flat-name"
                  type="text"
                  value={userName}
                  readOnly
                  className="nanma-add-flat-input-readonly"
                />
              </div>
            </div>

            {/* Building Name */}
            <div className="nanma-add-flat-field">
              <label htmlFor="add-flat-building">Building Name</label>
              <div className="nanma-add-flat-input-wrap nanma-add-flat-search-wrap">
                <input
                  id="add-flat-building"
                  type="text"
                  placeholder="Search building…"
                  value={buildingSearch}
                  autoComplete="off"
                  onChange={e => {
                    setBuildingSearch(e.target.value)
                    setForm(prev => ({ ...prev, buildingName: '', buildingId: '', flatNumber: '', flatId: '' }))
                    setApartments([])
                    setFlatSearch('')
                    setShowBuildingSuggestions(true)
                  }}
                  onFocus={() => setShowBuildingSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowBuildingSuggestions(false), 150)}
                />
                {/* Clear button - shows only when there's text */}
                {
                  buildingSearch && (
                    <button
                      type="button" 
                      className="nanma-add-flat-clear-btn"
                      onClick={() => {
                        setBuildingSearch('')
                        setForm(prev => ({ ...prev, buildingName: '', buildingId: '', flatNumber: '', flatId: '' }))
                        setApartments([])
                        setFlatSearch('')
                      }}
                      aria-label="Clear building selection"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )
                }
                
                <span className="nanma-add-flat-input-icon material-symbols-outlined" aria-hidden="true">domain</span>
                {showBuildingSuggestions && (
                  <ul className="nanma-add-flat-suggestions">
                    {buildings
                      .filter(b => b.name.toLowerCase().includes(buildingSearch.toLowerCase()))
                      .map(b => (
                        <li
                          key={b.id}
                          onMouseDown={() => {
                            setForm(prev => ({ ...prev, buildingId: b.id, buildingName: b.name, flatNumber: '', flatId: '' }))
                            setBuildingSearch(b.name)
                            setFlatSearch('')
                            setApartments([])
                            setShowBuildingSuggestions(false)
                            fetchApartments(b.id)
                          }}
                        >
                          {b.name}
                        </li>
                      ))
                    }
                    {buildings.filter(b => b.name.toLowerCase().includes(buildingSearch.toLowerCase())).length === 0 && (
                      <li className="nanma-add-flat-suggestions-empty">No buildings found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Flat Number */}
            <div className="nanma-add-flat-field">
              <label htmlFor="add-flat-number">Flat Number</label>
              <div className="nanma-add-flat-input-wrap nanma-add-flat-search-wrap">
                <input
                  id="add-flat-number"
                  type="text"
                  placeholder={form.buildingId ? 'Search flat…' : 'Select a building first'}
                  value={flatSearch}
                  autoComplete="off"
                  disabled={!form.buildingId}
                  onChange={e => {
                    setFlatSearch(e.target.value)
                    setForm(prev => ({ ...prev, flatNumber: '', flatId: '' }))
                    setShowFlatSuggestions(true)
                  }}
                  onFocus={() => setShowFlatSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowFlatSuggestions(false), 150)}
                />
                <span className="nanma-add-flat-input-icon material-symbols-outlined" aria-hidden="true">numbers</span>
                {showFlatSuggestions && form.buildingId && (
                  <ul className="nanma-add-flat-suggestions">
                    {apartments
                      .filter(a => a.appartment_number.toLowerCase().includes(flatSearch.toLowerCase()))
                      .map(a => (
                        <li
                          key={a.appartment_id}
                          onMouseDown={() => {
                            setForm(prev => ({ ...prev, flatNumber: a.appartment_number, flatId: a.appartment_id }))
                            setFlatSearch(a.appartment_number)
                            setShowFlatSuggestions(false)
                          }}
                        >
                          {a.appartment_number}
                        </li>
                      ))
                    }
                    {apartments.filter(a => a.appartment_number.toLowerCase().includes(flatSearch.toLowerCase())).length === 0 && (
                      <li className="nanma-add-flat-suggestions-empty">No flats available</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {error && <p className="nanma-add-flat-error">{error}</p>}

            <button
              type="submit"
              className="nanma-add-flat-btn"
              disabled={loading}
            >
              <span>{loading ? 'Adding…' : 'Add Flat'}</span>
              {!loading && (
                <span className="material-symbols-outlined nanma-add-flat-btn-icon" aria-hidden="true">add_circle</span>
              )}
            </button>

            <button
              type="button"
              className="nanma-add-flat-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel &amp; Go Back
            </button>
          </form>
        </div>

        {/* Decorative progress-style line */}
        <div className="nanma-add-flat-progress" aria-hidden="true">
          <div className="nanma-add-flat-progress-line active" />
          <div className="nanma-add-flat-progress-dot active" />
          <div className="nanma-add-flat-progress-line" />
        </div>
      </section>
    </main>
  )
}

export default AddFlatPage
