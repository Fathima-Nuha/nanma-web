import React, { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './MpinVerifyPage.css'

const MPIN_LENGTH = 6

function MpinVerifyPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const phoneNo = state?.phoneNo || localStorage.getItem('phone_no') || ''

  const [mpin, setMpin] = useState(Array(MPIN_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef([])

  const handleChange = (index, e) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...mpin]
    next[index] = ch
    setMpin(next)
    if (ch && index < MPIN_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const mpinValue = mpin.join('')
    if (mpinValue.length < MPIN_LENGTH) {
      setError('Please enter your complete 6-digit MPIN.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login_with_mpin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_no: phoneNo, mpin: mpinValue }),
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.message || 'Incorrect MPIN. Please try again.')
        return
      }
      localStorage.setItem('access_token', data.tokens?.access ?? '')
      localStorage.setItem('refresh_token', data.tokens?.refresh ?? '')
      localStorage.setItem('csrf_token', data.csrf ?? '')
      localStorage.setItem('user_id', data.user_id ?? '')
      navigate('/portal-select')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mpinv-page">
      <nav className="mpinv-nav">
        <div className="mpinv-nav-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="#fff" opacity="0.9"/>
            <rect x="14" y="3" width="7" height="7" rx="1" fill="#fff" opacity="0.9"/>
            <rect x="3" y="14" width="7" height="7" rx="1" fill="#fff" opacity="0.9"/>
            <rect x="14" y="14" width="7" height="7" rx="1" fill="#fff" opacity="0.9"/>
          </svg>
        </div>
        <span className="mpinv-nav-brand">Nanma Living</span>
      </nav>

      <div className="mpinv-body">
        <div className="mpinv-left">
          <h1 className="mpinv-heading">
            Welcome back to
            <span className="mpinv-heading-gold">curated living.</span>
          </h1>
          <p className="mpinv-subtext">
            Securely access your property dashboard and concierge services with your unique 6-digit security code.
          </p>
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80"
            alt="Luxury apartment interior"
            className="mpinv-photo"
          />
        </div>

        <div className="mpinv-right">
          <div className="mpinv-card">
            <h2 className="mpinv-card-title">MPIN Verification</h2>
            <p className="mpinv-card-subtitle">
              Please enter your 6-digit security code to proceed
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="mpinv-boxes">
                {mpin.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => (inputRefs.current[i] = el)}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="mpinv-box"
                  />
                ))}
              </div>

              {error && <p className="mpinv-error">{error}</p>}

              <button type="submit" className="mpinv-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify MPIN'}
                {!loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12,5 19,12 12,19"/>
                  </svg>
                )}
              </button>
            </form>

            <div className="mpinv-forgot">
              Forgot MPIN?{' '}
              <button type="button" onClick={() => navigate('/otp', { state: { phoneNo } })}>
                Click here to reset
              </button>
            </div>

            <div className="mpinv-divider" />

            <button className="mpinv-touchid" type="button">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8a5 5 0 0 0-10 0v4a5 5 0 0 0 10 0V8z"/>
                <path d="M12 8v4"/>
                <path d="M9 11a3 3 0 0 0 6 0"/>
                <path d="M7 6A7 7 0 0 1 19 8"/>
                <path d="M5 10a9 9 0 0 0 14 7.5"/>
              </svg>
              Login with Touch ID
            </button>
          </div>
        </div>
      </div>

      <footer className="mpinv-footer">
        <span className="mpinv-footer-brand">Nanma Living</span>
        <span className="mpinv-footer-copy">
          © 2024 Nanma Living. Curated Excellence in Property Management.
        </span>
        <div className="mpinv-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  )
}

export default MpinVerifyPage
