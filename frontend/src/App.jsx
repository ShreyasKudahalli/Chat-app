
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
  if (authView === 'login') return <main className="register-page"><WelcomePanel /><LoginForm onBack={() => setAuthView('register')} /></main>

  return <RegisterPage onRegister={register} onSignIn={() => setAuthView('login')} />
}

export default App
