import { useState } from 'react'
import { registerUser } from '../services/api.js'

function RegisterForm({ onRegister, onSignIn }) {
  const [showPassword, setShowPassword] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const payload = {
      first_name: String(formData.get('first_name') || '').trim(),
      last_name: String(formData.get('last_name') || '').trim(),
      email: String(formData.get('email') || '').trim().toLowerCase(),
      password: String(formData.get('password') || ''),
    }

    try {
      await registerUser(payload)
      setToastMessage('Registration successful! Redirecting to login...')

      window.setTimeout(() => {
        setToastMessage('')
        onSignIn()
      }, 1500)
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message)
      alert(error.response?.data?.email?.[0] || error.response?.data?.non_field_errors?.[0] || 'Registration failed. Please try again.')
    }
  }

  return (
    <>
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 1000,
            background: '#1f8f5f',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      <section className="form-panel" aria-labelledby="register-heading">
      <div className="form-topline">
        <span>Already have an account?</span>
        <button className="text-button" type="button" onClick={onSignIn}>Sign in <span aria-hidden="true">↗</span></button>
      </div>

      <div className="form-content">
        <p className="form-kicker">Join the conversation</p>
        <h2 id="register-heading">Create your account</h2>
          <p className="form-intro">A name, an email, and you're in.</p>

          <form className="register-form" onSubmit={handleSubmit}>
          <div className="name-fields">
            <label className="field">
              <span>First name</span>
              <input name="first_name" type="text" autoComplete="given-name" placeholder="Jamie" required />
            </label>
            <label className="field">
              <span>Last name</span>
              <input name="last_name" type="text" autoComplete="family-name" placeholder="Rivera" required />
            </label>
          </div>

          <label className="field">
            <span>Email address</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>

          <label className="field">
            <span>Password</span>
            <span className="password-wrap">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>

          <label className="terms-check">
            <input type="checkbox" required />
            <span>I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</span>
          </label>

          <button className="submit-button" type="submit">
            Create account <span aria-hidden="true">→</span>
          </button>
        </form>

          <p className="browser-demo-note">Browser demo only. Your profile and messages stay on this device; your password is not stored.</p>
      </div>
    </section>
    </>
  )
}

export default RegisterForm
