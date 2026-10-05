import { useState } from 'react'
import { loginUser } from '../services/api.js'

function LoginForm({ onBack, onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')

    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await loginUser({ email, password })
      const profile = {
        email,
        name: email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase()),
        access: response.access,
        refresh: response.refresh,
      }

      if (typeof onLogin === 'function') {
        onLogin(profile)
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Invalid email or password. Please try again.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-panel" aria-labelledby="login-heading">
      <div className="form-topline">
        <span>New to Commonroom?</span>
        <button className="text-button" type="button" onClick={onBack}>Create an account</button>
      </div>

      <div className="form-content">
        <p className="form-kicker">Welcome back</p>
        <h2 id="login-heading">Sign in</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="form-error" role="alert">{errorMessage}</div>
          )}

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
                autoComplete="current-password"
                placeholder="Enter your password"
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

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'} <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="security-note"><span aria-hidden="true">✳</span> No password is stored in this browser.</p>
      </div>
    </section>
  )
}

export default LoginForm
