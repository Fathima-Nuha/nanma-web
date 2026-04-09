import React, {  } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './SelectApartmentPage.css'

function SelectApartmentPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const userApartments = state?.appartment_details ?? []

  const handleSelectApartment = (apt) => {
    localStorage.setItem('selected_apartment_id', apt.appartment_id ?? apt.id ?? '')
    localStorage.setItem('selected_apartment_number', apt.appartment_number ?? apt.flat_number ?? '')
    localStorage.setItem('selected_building_name', apt.building_name ?? '')
    navigate('/user/dashboard')
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <main className="nanma-sapt-page">
      {/* ── Left Panel ── */}
      <section className="nanma-sapt-left">
        <svg className="nanma-sapt-star" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
          <path d="M100 0C100 55.2285 55.2285 100 0 100C55.2285 100 100 144.772 100 200C100 144.772 144.772 100 200 100C144.772 100 100 55.2285 100 0Z" />
        </svg>

        <div className="nanma-sapt-brand">Nanma Living</div>

        <div className="nanma-sapt-quote">
          <p>"Home is the starting place of love, hope and dreams."</p>
          <cite>— Emily Samson</cite>
        </div>

        <div className="nanma-sapt-left-line" aria-hidden="true" />
      </section>

      {/* ── Right Panel ── */}
      <section className="nanma-sapt-right">
        <div className="nanma-sapt-header">
          <h1>Select Your Flat</h1>
          <p>Choose the apartment you want to access from your resident dashboard.</p>
        </div>

        <div className="nanma-sapt-card">
          {userApartments.length === 0 ? (
            <p className="nanma-sapt-empty">No apartments found on your account.</p>
          ) : (
            <ul className="nanma-sapt-apt-list">
              {userApartments.map((apt) => (
                <li key={apt.appartment_id ?? apt.id}>
                  <button
                    type="button"
                    className="nanma-sapt-apt-card"
                    onClick={() => handleSelectApartment(apt)}
                  >
                    <span className="nanma-sapt-apt-icon material-symbols-outlined">apartment</span>
                    <div className="nanma-sapt-apt-info">
                      <span className="nanma-sapt-apt-number">
                        {apt.appartment_number ?? apt.flat_number}
                      </span>
                      <span className="nanma-sapt-apt-building">
                        {apt.building_name ?? '—'}
                      </span>
                    </div>
                    <span className="nanma-sapt-apt-arrow material-symbols-outlined">arrow_forward</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" className="nanma-sapt-logout" onClick={handleLogout}>
          Log out
        </button>
      </section>
    </main>
  )
}

export default SelectApartmentPage
