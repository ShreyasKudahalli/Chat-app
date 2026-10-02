import RegisterForm from './RegisterForm.jsx'
import WelcomePanel from './WelcomePanel.jsx'

function RegisterPage({ onRegister, onSignIn }) {
  return (
    <main className="register-page">
      <WelcomePanel />
      <RegisterForm onRegister={onRegister} onSignIn={onSignIn} />
    </main>
  )
}

export default RegisterPage
