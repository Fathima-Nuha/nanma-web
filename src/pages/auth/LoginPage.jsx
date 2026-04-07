import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import './LoginPage.css'

function LoginPage() {

  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify_user?phone_no=91${mobileNumber}`, {
        method: 'POST',
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Verification failed. Please try again.')
        return
      }

      if (!data.user_exist || (data.user_exist && !data.mpin_exist)) {
        // New user OR existing user without MPIN — generate OTP and verify
        const otpResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate_otp?phone_no=91${mobileNumber}`, {
          method: 'POST',
        })
        if (!otpResponse.ok) {
          const otpData = await otpResponse.json().catch(() => ({}))
          setError(otpData.message || 'Failed to send OTP. Please try again.')
          return
        }
        navigate('/otp', { state: { phoneNo: `91${mobileNumber}` } })
        return
      }

      if (data.user_exist && data.mpin_exist) {
        // Existing user with MPIN — go straight to MPIN verification
        navigate('/mpin-verify', { state: { phoneNo: `91${mobileNumber}` } })
        return
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nanma-login-page">
      <nav className="nanma-login-navbar">
        <div className="nanma-login-brand">Nanma Living</div>
        <button className="nanma-login-help">?</button>
      </nav>

      <main className="nanma-login-main">
        <section className="nanma-login-left">
          <div className="nanma-login-left-overlay"></div>

          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBariAS-9kodnlTALWQ8Yz372D8zHNVUsiecWvi9nHFzNeESXaHChJzOSlAYoZX4iSNjCK93y8qKYdUF-DWfxrmarx7IdNBmxYAGqLw9NwHxEIHKhCVsn6eci4rR9-R3juNYKlgh9iIw8JBLEwLYiUgNEtcqjGWDyjy7eTG60a2uAglfXtNCHhLz8fuSE70-tXgBvo7ioQy-9o8-OVEOs8cohCzXEvUBeNg5w-9tazr3QkZxs4wtar05FDv1VYTMEfu-a_FMGvukw"
            alt="Luxury interior"
            className="nanma-login-left-image"
          />

          <div className="nanma-login-left-text">
            <h2>Space defined by light and intention.</h2>
            <p>
              Experience a new standard of living where every detail is curated
              for your wellbeing.
            </p>
          </div>
        </section>

        <section className="nanma-login-right">
          <div className="nanma-login-card">
            <div className="nanma-login-card-header">
              <h1>Welcome back to curated living.</h1>
              <p>
                Securely access your property dashboard and concierge services
                with your mobile number.
              </p>
            </div>

            <form className="nanma-login-form" onSubmit={handleSubmit}>
              <div className="nanma-login-input-group">
                <label htmlFor="mobile-number">Mobile Number</label>

                <div className="nanma-login-phone-row">
                  <span>+91</span>
                  <input
                    id="mobile-number"
                    name="mobile-number"
                    type="tel"
                    placeholder="00000 00000"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
                {error && <p className="nanma-login-error">{error}</p>}
              </div>

              <button
                type="submit"
                className="nanma-login-continue"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Continue'}
              </button>
            </form>

            <div className="nanma-login-support">
              Having trouble? <a href="#">Contact Support</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="nanma-login-footer">
        <div>© 2024 Nanma Living. All rights reserved.</div>
        <div className="nanma-login-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage