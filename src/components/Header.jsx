import { shortenAddress } from '../utils/stellar'

export default function Header({ wallet, unlockedCount }) {
  return (
    <header style={styles.header}>
      {/* Masthead */}
      <div style={styles.masthead}>
        <div style={styles.mastheadLeft}>
          <span style={styles.issueTag} className="mono">TESTNET EDITION</span>
        </div>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>✦</div>
          <h1 style={styles.logo}>StellarRead</h1>
          <div style={styles.logoIcon}>✦</div>
        </div>
        <div style={styles.mastheadRight}>
          <span style={styles.issueTag} className="mono">x402 · STELLAR</span>
        </div>
      </div>

      {/* Decorative rule */}
      <div style={styles.ruleWrap}>
        <div style={styles.rule} />
        <span style={styles.ruleText} className="mono">PAY · READ · OWN</span>
        <div style={styles.rule} />
      </div>

      {/* Nav bar */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.navStat} className="mono">
            {unlockedCount > 0
              ? `${unlockedCount} article${unlockedCount > 1 ? 's' : ''} unlocked`
              : 'No articles unlocked yet'}
          </span>
        </div>

        <div style={styles.navRight}>
          {!wallet.connected ? (
            <button
              onClick={wallet.connect}
              disabled={wallet.connecting}
              style={styles.connectBtn}
            >
              {wallet.connecting ? (
                <><span className="spinner" />&nbsp;Connecting…</>
              ) : !wallet.freighterInstalled ? (
                '⚡ Install Freighter'
              ) : (
                '⚡ Connect Wallet'
              )}
            </button>
          ) : (
            <div style={styles.walletInfo}>
              <button
                onClick={wallet.fundAccount}
                disabled={wallet.funding}
                style={styles.fundBtn}
                title="Fund your Stellar testnet account via Friendbot (10,000 XLM)"
              >
                {wallet.funded
                  ? '✓ Funded!'
                  : wallet.funding
                  ? <span className="spinner" />
                  : '🪣 Get XLM'}
              </button>
              <div style={styles.addressPill} className="mono">
                <span style={styles.greenDot} />
                {shortenAddress(wallet.publicKey)}
              </div>
              <button
                onClick={wallet.disconnect}
                style={styles.disconnectBtn}
                title="Disconnect wallet"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Error banner */}
      {wallet.error && (
        <div style={styles.errorBanner} className="mono">
          ⚠&nbsp; {wallet.error}
        </div>
      )}

      {/* Freighter install hint */}
      {!wallet.freighterInstalled && !wallet.connected && (
        <div style={styles.hintBanner} className="mono">
          👻&nbsp; Freighter not detected —&nbsp;
          <a
            href="https://freighter.app"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.hintLink}
          >
            install freighter.app
          </a>
          &nbsp;then refresh this page.
        </div>
      )}
    </header>
  )
}

const styles = {
  header: {
    borderBottom: '1px solid #2a2a2a',
    backgroundColor: '#0d0d0d',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  masthead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px 8px',
    gap: 16,
  },
  mastheadLeft: { flex: 1 },
  mastheadRight: { flex: 1, textAlign: 'right' },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: { color: '#c9a84c', fontSize: 18 },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(22px, 4vw, 36px)',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    color: '#f5f0e8',
    lineHeight: 1,
  },
  issueTag: {
    fontSize: 9,
    letterSpacing: '0.2em',
    color: '#c9a84c',
    textTransform: 'uppercase',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  ruleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '0 40px',
    margin: '4px 0',
  },
  rule: {
    flex: 1,
    height: 1,
    background: 'linear-gradient(to right, transparent, #2a2a2a, transparent)',
  },
  ruleText: {
    fontSize: 8,
    letterSpacing: '0.3em',
    color: '#4a4a4a',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 40px 12px',
  },
  navLeft: {},
  navRight: {},
  navStat: {
    fontSize: 10,
    color: '#6b6560',
    letterSpacing: '0.1em',
  },
  connectBtn: {
    background: 'transparent',
    border: '1px solid #c9a84c',
    color: '#c9a84c',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.1em',
    padding: '7px 18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s',
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  fundBtn: {
    background: 'transparent',
    border: '1px solid #27ae60',
    color: '#27ae60',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    padding: '5px 10px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.2s',
    minWidth: 70,
    justifyContent: 'center',
  },
  addressPill: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 2,
    padding: '5px 10px',
    fontSize: 10,
    color: '#a0a0a0',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#27ae60',
    display: 'inline-block',
    flexShrink: 0,
  },
  disconnectBtn: {
    background: 'transparent',
    border: 'none',
    color: '#4a4a4a',
    cursor: 'pointer',
    fontSize: 12,
    padding: '4px 6px',
    transition: 'color 0.2s',
  },
  errorBanner: {
    background: '#1a0a0a',
    borderTop: '1px solid #4a1a1a',
    color: '#e05050',
    fontSize: 11,
    padding: '7px 40px',
    letterSpacing: '0.04em',
  },
  hintBanner: {
    background: '#0d0f1a',
    borderTop: '1px solid #1a1e2a',
    color: '#4a5a8a',
    fontSize: 10,
    padding: '6px 40px',
    letterSpacing: '0.05em',
  },
  hintLink: {
    color: '#c9a84c',
    textDecoration: 'none',
    borderBottom: '1px dotted #c9a84c',
  },
}
