function LoginForm({ onBack }) {
  return (
    <section className="form-panel" aria-labelledby="login-heading">
      <div className="form-topline">
        <span>New to Commonroom?</span>
        <button className="text-button" type="button" onClick={onBack}>Create an account</button>
      </div>

      <div className="form-content">
        <p className="form-kicker">Welcome back</p>
        <h2 id="login-heading">Sign in</h2>
        <p className="form-intro">Account sign-in will be available when the backend is connected.</p>
        <div className="login-unavailable" role="status">
          <span aria-hidden="true">i</span>
          <p>This project does not have a sign-in API yet. Create a local demo profile to explore the chat interface.</p>
        </div>
        <button className="submit-button" type="button" onClick={onBack}>
          Back to registration <span aria-hidden="true">→</span>
        </button>
        <p className="security-note"><span aria-hidden="true">✳</span> No password is stored in this browser.</p>
      </div>
    </section>
  )
}

export default LoginForm
