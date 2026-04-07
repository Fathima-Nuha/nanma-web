import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './OtpPage.css'

const OTP_LENGTH = 6
const RESEND_SECONDS = 120

function OtpPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const phoneNo = state?.phoneNo || ''

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [seconds])

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login?phone_no=${phoneNo}&otp=${otpValue}`,
        { method: 'POST' }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.message || 'Invalid OTP. Please try again.')
        return
      }
      // Persist auth tokens
      localStorage.setItem('access_token', data.tokens?.access ?? '')
      localStorage.setItem('refresh_token', data.tokens?.refresh ?? '')
      localStorage.setItem('csrf_token', data.csrf ?? '')
      localStorage.setItem('user_id', data.user_id ?? '')
      localStorage.setItem('phone_no', phoneNo)
      localStorage.setItem('access_expires_at', data.tokens?.access_expires_at ?? '')
      localStorage.setItem('refresh_expires_at', data.tokens?.refresh_expires_at ?? '')
      navigate('/mpin')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (seconds > 0) return
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/generate_otp?phone_no=${phoneNo}`,
        { method: 'POST' }
      )
      setSeconds(RESEND_SECONDS)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } catch {
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="nanma-otp-page">
      {/* ── Left dark panel ── */}
      <aside className="nanma-otp-left">
        <div className="nanma-otp-left-inner">
          <div className="nanma-otp-temple-icon">
            <svg viewBox="0 0 64 76" fill="#c4a265" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="5" r="3" />
              <rect x="31" y="7" width="2" height="7" />
              <path d="M22 14 L32 10 L42 14 L44 19 L20 19Z" />
              <rect x="25" y="19" width="14" height="5" />
              <path d="M14 24 L32 19 L50 24 L52 30 L12 30Z" />
              <rect x="21" y="30" width="22" height="5" />
              <path d="M6 35 L32 29 L58 35 L60 42 L4 42Z" />
              <rect x="17" y="42" width="30" height="8" />
              <rect x="28" y="44" width="8" height="6" fill="#13100b" />
              <rect x="13" y="50" width="38" height="3" />
              <rect x="9" y="53" width="46" height="3" />
            </svg>
          </div>
          <blockquote className="nanma-otp-quote">
            "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
          </blockquote>
        </div>
        <p className="nanma-otp-left-footer">NANMA LIVING © 2024 • MODERN CURATOR</p>
      </aside>

      {/* ── Right cream panel ── */}
      <main className="nanma-otp-right">
        <div className="nanma-otp-brand">
          <span className="nanma-otp-brand-bold">NANMA </span>
          <span className="nanma-otp-brand-light">LIVING</span>
        </div>

        <div className="nanma-otp-card">
          <h1 className="nanma-otp-title">OTP Verification</h1>
          <p className="nanma-otp-subtitle">
            Enter OTP sent to your registered mobile number
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="nanma-otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="·"
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="nanma-otp-box"
                />
              ))}
            </div>

            {error && <p className="nanma-otp-error">{error}</p>}

            <button
              type="submit"
              className="nanma-otp-verify-btn"
              disabled={loading}
            >
              {loading ? 'VERIFYING...' : 'VERIFY OTP'}
            </button>
          </form>

          <div className="nanma-otp-resend-row">
            {seconds > 0 ? (
              <span>
                <svg className="nanma-otp-clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {' '}Resend OTP in <strong>:{formatTime(seconds)}</strong>
              </span>
            ) : (
              <button className="nanma-otp-resend-btn" type="button" onClick={handleResend}>
                Resend OTP
              </button>
            )}
          </div>

          <button
            className="nanma-otp-change-btn"
            type="button"
            onClick={() => navigate('/login')}
          >
            Change Mobile Number
          </button>
        </div>

        <p className="nanma-otp-right-footer">NANMA LIVING © 2024 • MODERN CURATOR</p>
      </main>
    </div>
  )
}

export default OtpPage
