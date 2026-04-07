import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './MpinPage.css'

const MPIN_LENGTH = 6

function MpinBoxes({ value, onChange, inputRefs, label }) {
  const handleChange = (index, e) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    const next = value.split('')
    while (next.length < MPIN_LENGTH) next.push('')
    next[index] = ch
    onChange(next.join(''))
    if (ch && index < MPIN_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <>
      <span className="nanma-mpin-box-label">{label}</span>
      <div className="nanma-mpin-boxes">
        {Array(MPIN_LENGTH).fill('').map((_, i) => (
          <input
            key={i}
            ref={el => (inputRefs.current[i] = el)}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="nanma-mpin-box"
          />
        ))}
      </div>
    </>
  )
}

function MpinPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mpin, setMpin] = useState('')
  const [confirmMpin, setConfirmMpin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const mpinRefs = useRef([])
  const confirmRefs = useRef([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mpin.length < MPIN_LENGTH || confirmMpin.length < MPIN_LENGTH) {
      setError('Please enter all 6 digits for both MPIN fields.')
      return
    }
    if (mpin !== confirmMpin) {
      setError('MPINs do not match. Please try again.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const userId = localStorage.getItem('user_id')
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/create_profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            name: fullName,
            email,
            mpin,
            confirm_mpin: confirmMpin,
          }),
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.message || 'Failed to set MPIN. Please try again.')
        return
      }
      navigate('/mpin-verify', { state: { phoneNo: localStorage.getItem('phone_no') } })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nanma-mpin-page">
      {/* ── Left dark panel ── */}
      <aside className="nanma-mpin-left">
        <p className="nanma-mpin-left-label">Philosophy</p>
        <blockquote className="nanma-mpin-quote">
          "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
        </blockquote>
        <span className="nanma-mpin-left-divider" />
        <p className="nanma-mpin-author">Le Corbusier</p>
      </aside>

      {/* ── Right cream panel ── */}
      <main className="nanma-mpin-right">
        <div className="nanma-mpin-brand">
          <span className="nanma-mpin-brand-bold">Nanma </span>
          <span className="nanma-mpin-brand-light">Living</span>
        </div>

        <div className="nanma-mpin-card">
          <h1 className="nanma-mpin-card-title">Secure your experience.</h1>
          <p className="nanma-mpin-card-subtitle">
            Create a 6-digit MPIN to easily access your dashboard and concierge services.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="nanma-mpin-field">
              <label className="nanma-mpin-field-label" htmlFor="full-name">Full Name</label>
              <input
                id="full-name"
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="nanma-mpin-text-input"
                required
              />
            </div>

            <div className="nanma-mpin-field">
              <label className="nanma-mpin-field-label" htmlFor="email">Email ID</label>
              <input
                id="email"
                type="email"
                placeholder="example@nanmaliving.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="nanma-mpin-text-input"
                required
              />
            </div>

            <MpinBoxes
              label="6-Digit MPIN"
              value={mpin}
              onChange={setMpin}
              inputRefs={mpinRefs}
            />

            <MpinBoxes
              label="Re-Enter 6-Digit MPIN"
              value={confirmMpin}
              onChange={setConfirmMpin}
              inputRefs={confirmRefs}
            />

            {error && <p className="nanma-mpin-error">{error}</p>}

            <button
              type="submit"
              className="nanma-mpin-submit-btn"
              disabled={loading}
            >
              {loading ? 'Setting MPIN...' : 'Set MPIN'}
            </button>
          </form>

          <div className="nanma-mpin-login-link">
            Already have an <button type="button" onClick={() => navigate('/mpin-verify')}>MPIN? Login</button>
          </div>
        </div>

        <footer className="nanma-mpin-footer">
          <span>© 2024 Nanma Living. All rights reserved.</span>
          <div className="nanma-mpin-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Sustainability</a>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default MpinPage