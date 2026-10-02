function WelcomePanel() {
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

      <div className="conversation-art" aria-hidden="true">
        <span className="art-orbit art-orbit-one" />
        <span className="art-orbit art-orbit-two" />
        <span className="art-spark">✳</span>
        <span className="art-message art-message-one">you around later?</span>
        <span className="art-message art-message-two">always :)</span>
        <span className="art-dot" />
      </div>

      <p className="panel-footer">A quieter corner of the internet.</p>
    </section>
  )
}

export default WelcomePanel
