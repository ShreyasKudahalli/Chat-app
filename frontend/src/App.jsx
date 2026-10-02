
import './App.css'
import { useState } from 'react'
import ChatWorkspace from './components/ChatWorkspace.jsx'
import LoginForm from './components/LoginForm.jsx'
import RegisterPage from './components/RegisterPage.jsx'

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('commonroom-demo-user') || 'null')
    } catch {
      return null
    }
  })
  const [authView, setAuthView] = useState('register')

  function register(profile) {
    try {
      localStorage.setItem('commonroom-demo-user', JSON.stringify(profile))
    } catch {
      // A profile can still be used for this session if storage is unavailable.
    }
    setUser(profile)
  }

  function logout() {
    localStorage.removeItem('commonroom-demo-user')
    setUser(null)
    setAuthView('register')
  }

  if (user) return <ChatWorkspace user={user} onLogout={logout} />
  if (authView === 'login') return <main className="register-page"><WelcomePanelFallback /><LoginForm onBack={() => setAuthView('register')} /></main>

  return <RegisterPage onRegister={register} onSignIn={() => setAuthView('login')} />
}

function WelcomePanelFallback() {
  return (
    <section className="welcome-panel" aria-label="Chat app introduction">
      <a className="brand" href="#home" aria-label="Commonroom home">
        <span className="brand-mark" aria-hidden="true">c</span>
        <span>commonroom</span>
      </a>
      <div className="welcome-copy">
        <p className="eyebrow">A little closer, every day</p>
        <h1>Make room<br />for good<br /><em>conversation.</em></h1>
        <p className="welcome-note">Your people are here. Pick up where you left off, or start something new.</p>
      </div>
      <p className="panel-footer">A quieter corner of the internet.</p>
    </section>
  )
}

export default App
