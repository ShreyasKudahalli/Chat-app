import { useState } from 'react'

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Account creation is not connected yet. Your details have not been sent.')
  }

  return (
    <section className="form-panel" aria-labelledby="register-heading">
      <div className="form-topline">
        <span>Already have an account?</span>
        <a href="#sign-in">Sign in <span aria-hidden="true">↗</span></a>
      </div>

      <div className="form-content">
        <p className="form-kicker">Join the conversation</p>
        <h2 id="register-heading">Create your account</h2>
        <p className="form-intro">A name, an email, and you're in.</p>

        <form className="register-form" onSubmit={handleSubmit} onChange={() => setNotice('')}>
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
          <p className="form-notice" role="status">{notice}</p>
        </form>

        <p className="security-note"><span aria-hidden="true">✳</span> Your conversations are yours. Always.</p>
      </div>
    </section>
  )
}

export default RegisterForm
