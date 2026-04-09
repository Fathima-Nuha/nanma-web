import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import './PortalSelectPage.css'

function PortalSelectPage() {
  const navigate = useNavigate()
  const { state } = useLocation()


  const goAdmin = () => navigate('/admin/dashboard')
  const goUser = () => navigate('/user-setup', { state: state })

  return (
    <div className="nanma-portal-page">
      <nav className="nanma-portal-navbar">
        <div className="nanma-portal-brand">Nanma Living</div>
      </nav>

      <main className="nanma-portal-main">
        <section className="nanma-portal-left">
          <div className="nanma-portal-left-overlay"></div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBariAS-9kodnlTALWQ8Yz372D8zHNVUsiecWvi9nHFzNeESXaHChJzOSlAYoZX4iSNjCK93y8qKYdUF-DWfxrmarx7IdNBmxYAGqLw9NwHxEIHKhCVsn6eci4rR9-R3juNYKlgh9iIw8JBLEwLYiUgNEtcqjGWDyjy7eTG60a2uAglfXtNCHhLz8fuSE70-tXgBvo7ioQy-9o8-OVEOs8cohCzXEvUBeNg5w-9tazr3QkZxs4wtar05FDv1VYTMEfu-a_FMGvukw"
            alt="Luxury interior"
            className="nanma-portal-left-image"
          />
          <div className="nanma-portal-left-text">
            <h2>One account, two worlds of access.</h2>
            <p>Manage your community or enjoy it — the choice is yours.</p>
          </div>
        </section>

        <section className="nanma-portal-right">
          <div className="nanma-portal-card">
            <div className="nanma-portal-card-header">
              <h1>How would you like to continue?</h1>
              <p>Select the portal that matches what you want to do today.</p>
            </div>

            <div className="nanma-portal-options">
              <button className="nanma-portal-option nanma-portal-option-admin" onClick={goAdmin}>
                <span className="nanma-portal-option-icon material-symbols-outlined">admin_panel_settings</span>
                <div className="nanma-portal-option-text">
                  <span className="nanma-portal-option-label">Admin Portal</span>
                  <span className="nanma-portal-option-desc">Manage buildings, flats and residents</span>
                </div>
                <span className="nanma-portal-option-arrow material-symbols-outlined">arrow_forward</span>
              </button>

              <button className="nanma-portal-option nanma-portal-option-user" onClick={goUser}>
                <span className="nanma-portal-option-icon material-symbols-outlined">home</span>
                <div className="nanma-portal-option-text">
                  <span className="nanma-portal-option-label">My Apartment</span>
                  <span className="nanma-portal-option-desc">View your resident dashboard</span>
                </div>
                <span className="nanma-portal-option-arrow material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PortalSelectPage
