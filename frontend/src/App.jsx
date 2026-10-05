
import './App.css'
import { useState } from 'react'
import ChatWorkspace from './components/ChatWorkspace.jsx'
import LoginForm from './components/LoginForm.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import WelcomePanel from './components/WelcomePanel.jsx'

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('commonroom-demo-user') || 'null')
    } catch {
      return null
    }
  })
  const [authView, setAuthView] = useState('register')

  function normalizeProfile(profile) {
    const firstName = profile?.first_name || profile?.firstName || ''
    const lastName = profile?.last_name || profile?.lastName || ''
    const email = profile?.email || ''
    const fallbackName = [firstName, lastName].filter(Boolean).join(' ') || (
      email ? email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'User'
    )

    return {
      ...profile,
      name: profile?.name || fallbackName,
      first_name: firstName,
      last_name: lastName,
      email,
    }
  }

  function saveUser(profile) {
    const normalizedProfile = normalizeProfile(profile)
    try {
      localStorage.setItem('commonroom-demo-user', JSON.stringify(normalizedProfile))
    } catch {
      // A profile can still be used for this session if storage is unavailable.
    }
    setUser(normalizedProfile)
  }

  function register(profile) {
    saveUser(profile)
  }

  function login(profile) {
    saveUser(profile)
  }

  function logout() {
    try {
      localStorage.removeItem('commonroom-demo-user')
    } catch {
      // Logout still works for the current session when storage is unavailable.
    }
    setUser(null)
    setAuthView('register')
  }

  if (user) return <ChatWorkspace user={user} onLogout={logout} />
  if (authView === 'login') return <main className="register-page"><WelcomePanel /><LoginForm onBack={() => setAuthView('register')} onLogin={login} /></main>

  return <RegisterPage onRegister={register} onSignIn={() => setAuthView('login')} />
}

export default App
