export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.ruleWrap}>
          <div style={styles.rule} />
          <span style={styles.ruleText} className="mono">✦ STELLAR PAYWALL ✦</span>
          <div style={styles.rule} />
        </div>
        <div style={styles.cols}>
          <div style={styles.col}>
            <h4 style={styles.colTitle} className="mono">BUILT WITH</h4>
            {[
              ['Stellar Testnet', 'https://developers.stellar.org'],
              ['x402 Protocol', 'https://x402.org'],
              ['Freighter Wallet', 'https://freighter.app'],
              ['Gemini AI', 'https://aistudio.google.com'],
            ].map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={styles.link} className="mono">
                {name}
              </a>
            ))}
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle} className="mono">RESOURCES</h4>
            {[
              ['Stellar Expert (Testnet)', 'https://stellar.expert/explorer/testnet'],
              ['Stellar Docs', 'https://developers.stellar.org/docs'],
              ['x402 on Stellar', 'https://developers.stellar.org/docs/build/agentic-payments/x402'],
              ['Friendbot (Fund)', 'https://friendbot.stellar.org'],
            ].map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={styles.link} className="mono">
                {name}
              </a>
            ))}
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle} className="mono">HACKATHON</h4>
            <a href="https://dorahacks.io/hackathon/stellar-agents-x402-stripe-mpp" target="_blank" rel="noopener noreferrer" style={styles.link} className="mono">
              Stellar Agents x402
            </a>
            <p style={styles.note}>
              Submitted for the Stellar Agents · x402 · Stripe MPP hackathon on DoraHacks. 
              All transactions use Stellar testnet — no real funds involved.
            </p>
          </div>
        </div>
        <div style={styles.bottom}>
          <span style={styles.bottomText} className="mono">
            © 2026 STELLARREAD · TESTNET · NO REAL FUNDS · MIT LICENSE
          </span>
          <span style={styles.bottomText} className="mono">
            HTTP 402 · x402 · STELLAR · GEMINI
          </span>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    borderTop: '1px solid #1e1e1e',
    marginTop: 60,
    background: '#0a0a0a',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 40px 24px',
  },
  ruleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 36,
  },
  rule: {
    flex: 1,
    height: 1,
    background: '#1e1e1e',
  },
  ruleText: {
    fontSize: 9,
    letterSpacing: '0.3em',
    color: '#c9a84c',
  },
  cols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 32,
    marginBottom: 32,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  colTitle: {
    fontSize: 9,
    letterSpacing: '0.2em',
    color: '#c9a84c',
    marginBottom: 4,
  },
  link: {
    fontSize: 10,
    color: '#4a4a4a',
    textDecoration: 'none',
    letterSpacing: '0.05em',
    transition: 'color 0.2s',
    lineHeight: 1.8,
  },
  note: {
    fontSize: 10,
    color: '#3a3a3a',
    lineHeight: 1.6,
    marginTop: 4,
  },
  bottom: {
    borderTop: '1px solid #141414',
    paddingTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  bottomText: {
    fontSize: 8,
    color: '#2a2a2a',
    letterSpacing: '0.15em',
  },
}
