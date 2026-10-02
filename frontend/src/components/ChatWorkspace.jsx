import { useEffect, useRef, useState } from 'react'

const storageKey = 'commonroom-demo-conversations'

const starterConversations = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    initials: 'MC',
    color: 'coral',
    online: true,
    kind: 'Direct message',
    preview: 'That sounds like the perfect Sunday.',
    time: '10:42 AM',
    unread: 2,
    messages: [
      { id: 'm1', author: 'them', text: 'I found that little bookshop you were talking about.', time: '10:31 AM', day: 'Today' },
      { id: 'm2', author: 'me', text: 'The one tucked behind the flower stand?', time: '10:34 AM', day: 'Today' },
      { id: 'm3', author: 'them', text: 'Yes! They have a tiny coffee counter in the back, too.', time: '10:38 AM', day: 'Today' },
      { id: 'm4', author: 'them', text: 'That sounds like the perfect Sunday.', time: '10:42 AM', day: 'Today' },
    ],
  },
  {
    id: 'weekend-plans',
    name: 'Weekend plans',
    initials: 'WP',
    color: 'yellow',
    online: false,
    kind: 'Group conversation',
    members: 'You, Theo, Nina, Alex',
    preview: 'Theo: bringing the good speakers 🎶',
    time: '9:18 AM',
    unread: 0,
    messages: [
      { id: 'w1', author: 'them', sender: 'Theo', text: 'I can bring the good speakers for the picnic.', time: '9:04 AM', day: 'Today' },
      { id: 'w2', author: 'me', text: 'Perfect. I will bring something to snack on.', time: '9:12 AM', day: 'Today' },
      { id: 'w3', author: 'them', sender: 'Nina', text: 'Theo: bringing the good speakers 🎶', time: '9:18 AM', day: 'Today' },
    ],
  },
  {
    id: 'theo-brooks',
    name: 'Theo Brooks',
    initials: 'TB',
    color: 'blue',
    online: true,
    kind: 'Direct message',
    preview: 'Sent you the playlist!',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 't1', author: 'them', text: 'I finally finished that playlist.', time: 'Yesterday', day: 'Yesterday' },
      { id: 't2', author: 'them', text: 'Sent you the playlist!', time: 'Yesterday', day: 'Yesterday' },
    ],
  },
  {
    id: 'nina-okafor',
    name: 'Nina Okafor',
    initials: 'NO',
    color: 'lilac',
    online: false,
    kind: 'Direct message',
    preview: 'You: I will send it over tonight.',
    time: 'Tue',
    unread: 0,
    messages: [
      { id: 'n1', author: 'them', text: 'Could you send me the recipe when you have a moment?', time: 'Tuesday', day: 'Tuesday' },
      { id: 'n2', author: 'me', text: 'Absolutely, I will send it over tonight.', time: 'Tuesday', day: 'Tuesday' },
    ],
  },
  {
    id: 'alex-morgan',
    name: 'Alex Morgan',
    initials: 'AM',
    color: 'mint',
    online: false,
    kind: 'Direct message',
    preview: 'Thanks again for today!',
    time: 'Mon',
    unread: 0,
    messages: [
      { id: 'a1', author: 'them', text: 'Thanks again for today! I needed that catch-up.', time: 'Monday', day: 'Monday' },
    ],
  },
]

const directory = [
  { id: 'maya-chen', name: 'Maya Chen', initials: 'MC', color: 'coral', online: true },
  { id: 'theo-brooks', name: 'Theo Brooks', initials: 'TB', color: 'blue', online: true },
  { id: 'nina-okafor', name: 'Nina Okafor', initials: 'NO', color: 'lilac', online: false },
  { id: 'alex-morgan', name: 'Alex Morgan', initials: 'AM', color: 'mint', online: false },
  { id: 'weekend-plans', name: 'Weekend plans', initials: 'WP', color: 'yellow', online: false, group: true },
]

function loadConversations() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    return Array.isArray(saved) && saved.length ? saved : starterConversations
  } catch {
    return starterConversations
  }
}

function Avatar({ person, size = 'regular' }) {
  return (
    <span className={`avatar avatar-${person.color} avatar-${size}`} aria-hidden="true">
      {person.initials}
      {person.online && <span className="online-indicator" />}
    </span>
  )
}

function IconButton({ label, children, onClick, className = '' }) {
  return (
    <button className={`icon-button ${className}`} type="button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  )
}

function ChatWorkspace({ user, onLogout }) {
  const [conversations, setConversations] = useState(loadConversations)
  const [selectedId, setSelectedId] = useState(() => loadConversations()[0]?.id ?? null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const messagesEndRef = useRef(null)

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId)
  const visibleConversations = conversations.filter((conversation) => {
    const matchesSearch = `${conversation.name} ${conversation.preview}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (filter === 'all' || conversation.unread > 0)
  })
  const userInitials = user.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(conversations))
    } catch {
      // The chat remains usable for this session when browser storage is unavailable.
    }
  }, [conversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [selectedId, selectedConversation?.messages.length])

  function openConversation(id) {
    setSelectedId(id)
    setConversations((current) => current.map((conversation) => (
      conversation.id === id ? { ...conversation, unread: 0 } : conversation
    )))
  }

  function sendMessage(event) {
    event.preventDefault()
    const messageText = draft.trim()
    if (!messageText || !selectedConversation) return

    const now = new Date()
    const message = {
      id: `message-${now.getTime()}`,
      author: 'me',
      text: messageText,
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      day: 'Today',
    }

    setConversations((current) => current.map((conversation) => (
      conversation.id === selectedId
        ? { ...conversation, preview: messageText, time: message.time, messages: [...conversation.messages, message] }
        : conversation
    )))
    setDraft('')
  }

  function startConversation(contact) {
    const existing = conversations.find((conversation) => conversation.id === contact.id)
    if (existing) {
      openConversation(existing.id)
      setShowNewChat(false)
      return
    }

    const conversation = {
      ...contact,
      kind: contact.group ? 'Group conversation' : 'Direct message',
      preview: 'Start the conversation',
      time: 'Now',
      unread: 0,
      messages: [],
    }
    setConversations((current) => [conversation, ...current])
    setSelectedId(contact.id)
    setShowNewChat(false)
    setFilter('all')
  }

  function handleComposerKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <main className={`chat-workspace${selectedId ? ' mobile-chat-active' : ''}`}>
      <aside className="chat-sidebar">
        <a className="chat-brand" href="#inbox" aria-label="Commonroom inbox">
          <span className="chat-brand-mark" aria-hidden="true">c</span>
          <span>commonroom</span>
        </a>

        <button className="workspace-switcher" type="button" title="Current workspace">
          <span className="workspace-monogram">C</span>
          <span className="workspace-name">Commonroom</span>
          <span className="workspace-chevron" aria-hidden="true">⌄</span>
        </button>

        <nav className="primary-nav" aria-label="Main navigation">
          <button className="primary-nav-item active" type="button" onClick={() => setFilter('all')}>
            <span className="nav-symbol" aria-hidden="true">▤</span> Inbox
          </button>
          <button className={`primary-nav-item${filter === 'unread' ? ' nav-selected' : ''}`} type="button" onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}>
            <span className="nav-symbol" aria-hidden="true">◉</span> Unread
            <span className="nav-count">{conversations.reduce((total, conversation) => total + conversation.unread, 0) || ''}</span>
          </button>
        </nav>

        <div className="sidebar-caption">YOUR SPACE</div>
        <button className="primary-nav-item" type="button" onClick={() => setShowNewChat(true)}>
          <span className="nav-symbol nav-add" aria-hidden="true">＋</span> New conversation
        </button>

        <div className="sidebar-bottom">
          <div className="demo-label"><span /> Browser demo</div>
          <button className="profile-trigger" type="button" onClick={() => setShowProfileMenu((visible) => !visible)} aria-expanded={showProfileMenu}>
            <span className="user-avatar">{userInitials}</span>
            <span className="profile-copy"><strong>{user.name}</strong><small>{user.email}</small></span>
            <span className="profile-menu-icon" aria-hidden="true">···</span>
          </button>
          {showProfileMenu && (
            <div className="profile-menu">
              <p>Signed in as<br /><strong>{user.email}</strong></p>
              <button type="button" onClick={onLogout}>Log out of demo</button>
            </div>
          )}
        </div>
      </aside>

      <section className="conversation-pane" aria-label="Conversation list">
        <div className="conversation-heading">
          <div>
            <p className="pane-eyebrow">YOUR MESSAGES</p>
            <h1>Inbox</h1>
          </div>
          <IconButton label="Start a conversation" className="new-conversation-button" onClick={() => setShowNewChat(true)}>＋</IconButton>
        </div>

        <label className="conversation-search">
          <span aria-hidden="true">⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages" aria-label="Search conversations" />
          {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
        </label>

        <div className="conversation-filters" role="group" aria-label="Filter conversations">
          <button className={filter === 'all' ? 'selected' : ''} type="button" onClick={() => setFilter('all')}>All <span>{conversations.length}</span></button>
          <button className={filter === 'unread' ? 'selected' : ''} type="button" onClick={() => setFilter('unread')}>Unread <span>{conversations.filter((conversation) => conversation.unread > 0).length}</span></button>
        </div>

        <div className="conversation-list">
          {visibleConversations.map((conversation) => (
            <button
              className={`conversation-item${selectedId === conversation.id ? ' conversation-active' : ''}`}
              key={conversation.id}
              type="button"
              onClick={() => openConversation(conversation.id)}
            >
              <Avatar person={conversation} />
              <span className="conversation-copy">
                <span className="conversation-name-row"><strong>{conversation.name}</strong><time>{conversation.time}</time></span>
                <span className="conversation-preview-row"><span>{conversation.preview}</span>{conversation.unread > 0 && <b>{conversation.unread}</b>}</span>
              </span>
            </button>
          ))}
          {visibleConversations.length === 0 && (
            <div className="conversation-empty">
              <span aria-hidden="true">⌕</span>
              <p>{filter === 'unread' ? 'You are all caught up.' : 'No conversations found.'}</p>
            </div>
          )}
        </div>
        <p className="local-data-note">Conversations are saved only in this browser.</p>
      </section>

      <section className="message-pane" aria-label="Messages">
        {selectedConversation ? (
          <>
            <header className="message-header">
              <div className="message-person">
                <IconButton label="Back to inbox" className="mobile-back-button" onClick={() => setSelectedId(null)}>←</IconButton>
                <Avatar person={selectedConversation} />
                <div>
                  <h2>{selectedConversation.name}</h2>
                  <p>{selectedConversation.online ? 'Active now' : selectedConversation.kind}</p>
                </div>
              </div>
              <div className="message-header-actions">
                <span className="demo-pill">DEMO</span>
                <IconButton label={showDetails ? 'Hide details' : 'Show details'} onClick={() => setShowDetails((visible) => !visible)}>ⓘ</IconButton>
              </div>
            </header>

            <div className="message-content">
              <div className="conversation-intro">
                <Avatar person={selectedConversation} size="large" />
                <h3>{selectedConversation.name}</h3>
                <p>{selectedConversation.kind}{selectedConversation.members ? ` · ${selectedConversation.members}` : ''}</p>
                <span className="today-divider"><span /> TODAY <span /></span>
              </div>

              <div className="message-list" aria-live="polite">
                {selectedConversation.messages.map((message) => (
                  <div className={`message-row message-${message.author}`} key={message.id}>
                    {message.author === 'them' && <Avatar person={selectedConversation} size="small" />}
                    <div className="message-stack">
                      {message.sender && <span className="message-sender">{message.sender}</span>}
                      <p className="message-bubble">{message.text}</p>
                      <time className="message-time">{message.time}</time>
                    </div>
                  </div>
                ))}
                {selectedConversation.messages.length === 0 && <p className="first-message-prompt">Say hello to start this conversation.</p>}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form className="message-composer" onSubmit={sendMessage}>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder={`Message ${selectedConversation.name}`}
                aria-label={`Message ${selectedConversation.name}`}
                rows={1}
              />
              <div className="composer-bottom">
                <span>Enter to send · Shift + Enter for a new line</span>
                <button className="send-button" type="submit" disabled={!draft.trim()} aria-label="Send message" title="Send message">↑</button>
              </div>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <span className="empty-chat-mark" aria-hidden="true">c</span>
            <h2>Your conversations, in one place.</h2>
            <p>Choose a conversation or start a new one.</p>
            <button type="button" onClick={() => setShowNewChat(true)}>Start a conversation <span aria-hidden="true">→</span></button>
          </div>
        )}
      </section>

      {selectedConversation && showDetails && (
        <aside className="details-pane" aria-label="Conversation details">
          <div className="details-heading"><h2>Details</h2><IconButton label="Close details" onClick={() => setShowDetails(false)}>×</IconButton></div>
          <Avatar person={selectedConversation} size="large" />
          <h3>{selectedConversation.name}</h3>
          <p className="details-type">{selectedConversation.kind}</p>
          {selectedConversation.online && <p className="details-online"><span /> Active now</p>}
          {selectedConversation.members && <p className="details-members">{selectedConversation.members}</p>}
          <p className="details-demo-note">This is sample conversation data saved locally in your browser.</p>
        </aside>
      )}

      {showNewChat && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowNewChat(false)}>
          <section className="new-chat-modal" role="dialog" aria-modal="true" aria-labelledby="new-chat-heading">
            <div className="new-chat-heading">
              <div><p className="pane-eyebrow">MAKE A CONNECTION</p><h2 id="new-chat-heading">New conversation</h2></div>
              <IconButton label="Close" onClick={() => setShowNewChat(false)}>×</IconButton>
            </div>
            <p className="new-chat-intro">Choose someone from your demo contacts.</p>
            <div className="contact-list">
              {directory.map((contact) => (
                <button type="button" key={contact.id} onClick={() => startConversation(contact)}>
                  <Avatar person={contact} />
                  <span><strong>{contact.name}</strong><small>{contact.group ? 'Group conversation' : contact.online ? 'Active now' : 'Contact'}</small></span>
                  <span className="contact-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default ChatWorkspace
