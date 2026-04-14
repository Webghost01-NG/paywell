import { stellarExpertUrl, RECEIVER_ADDRESS } from '../utils/stellar'

export default function HowItWorks({ unlockedCount }) {
  const steps = [
    {
      step: '01',
      title: 'Install Freighter',
      desc: 'Get the free Freighter browser extension. Switch to Stellar Testnet in settings.',
      link: 'https://freighter.app',
      linkText: 'freighter.app →',
    },
    {
      step: '02',
      title: 'Fund Your Wallet',
      desc: 'Click "Get XLM" to fund your testnet account via Friendbot. You\'ll receive 10,000 test XLM instantly.',
      link: null,
      linkText: null,
    },
    {
      step: '03',
      title: 'Pay & Unlock',
      desc: 'Click any article\'s unlock button. Freighter will prompt you to sign a 1 XLM transaction on Stellar testnet.',
      link: null,
      linkText: null,
    },
    {
      step: '04',
      title: 'Verify On-Chain',
      desc: 'Each unlock creates a real Stellar testnet transaction. Click the TX hash to verify on Stellar Expert.',
      link: `https://stellar.expert/explorer/testnet/account/${RECEIVER_ADDRESS}`,
      linkText: 'View receiver wallet →',
    },
  ]

  return (
    <aside style={styles.aside}>
      {/* x402 explanation */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle} className="mono">WHAT IS x402?</h3>
        <div style={styles.divider} />
        <p style={styles.body}>
          x402 is a payment protocol built on HTTP's dormant 402 status code.
          Instead of API keys or subscriptions, resources charge per-request
          with on-chain micropayments.
        </p>
        <div style={styles.flowChart}>
          {[
            ['CLIENT', 'Requests article'],
            ['SERVER', '402 + price'],
            ['FREIGHTER', 'Signs tx'],
            ['STELLAR', 'Settles < 5s'],
            ['SERVER', 'Delivers content'],
          ].map(([who, what], i) => (
            <div key={i} style={styles.flowRow}>
              <span style={styles.flowWho} className="mono">{who}</span>
              <span style={styles.flowArrow}>→</span>
              <span style={styles.flowWhat} className="mono">{what}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle} className="mono">HOW TO START</h3>
        <div style={styles.divider} />
        {steps.map((s) => (
          <div key={s.step} style={styles.stepRow}>
            <div style={styles.stepNum} className="mono">{s.step}</div>
            <div style={styles.stepContent}>
              <div style={styles.stepTitle}>{s.title}</div>
              <p style={styles.stepDesc}>{s.desc}</p>
              {s.link && (
                <a href={s.link} target="_blank" rel="noopener noreferrer" style={styles.stepLink} className="mono">
                  {s.linkText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle} className="mono">NETWORK STATS</h3>
        <div style={styles.divider} />
        <div style={styles.stats}>
          {[
            ['TX FEE', '$0.00001'],
            ['SETTLE TIME', '< 5 sec'],
            ['NETWORK', 'TESTNET'],
            ['PROTOCOL', 'x402 v2'],
            ['YOU UNLOCKED', `${unlockedCount} art.`],
          ].map(([k, v]) => (
            <div key={k} style={styles.statRow}>
              <span style={styles.statKey} className="mono">{k}</span>
              <span style={styles.statVal} className="mono">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stellar receiver */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle} className="mono">RECEIVER WALLET</h3>
        <div style={styles.divider} />
        <div style={styles.receiverWrap}>
          <p style={{ ...styles.body, marginBottom: 8 }}>All payments go to this testnet address:</p>
          <div style={styles.receiverAddr} className="mono">
            {RECEIVER_ADDRESS.slice(0, 16)}
            <br />
            {RECEIVER_ADDRESS.slice(16, 32)}
            <br />
            {RECEIVER_ADDRESS.slice(32)}
          </div>
          <a
            href={`https://stellar.expert/explorer/testnet/account/${RECEIVER_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.stepLink}
            className="mono"
          >
            View on Stellar Expert →
          </a>
        </div>
      </div>
    </aside>
  )
}

const styles = {
  aside: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  section: {
    borderBottom: '1px solid #1e1e1e',
    padding: '20px 0',
  },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: '0.25em',
    color: '#c9a84c',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    background: '#1e1e1e',
    marginBottom: 14,
  },
  body: {
    fontSize: 12,
    lineHeight: 1.65,
    color: '#6b6560',
  },
  flowChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginTop: 12,
    padding: '10px 12px',
    background: '#0d0d0d',
    border: '1px solid #1e1e1e',
  },
  flowRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  flowWho: {
    fontSize: 9,
    color: '#c9a84c',
    letterSpacing: '0.1em',
    width: 60,
    flexShrink: 0,
  },
  flowArrow: {
    color: '#2a2a2a',
    fontSize: 10,
  },
  flowWhat: {
    fontSize: 9,
    color: '#4a4a4a',
    letterSpacing: '0.05em',
  },
  stepRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 14,
  },
  stepNum: {
    fontSize: 10,
    color: '#c9a84c',
    letterSpacing: '0.1em',
    width: 20,
    flexShrink: 0,
    paddingTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#e0dcd4',
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#6b6560',
    marginBottom: 4,
  },
  stepLink: {
    fontSize: 9,
    color: '#c9a84c',
    letterSpacing: '0.1em',
    textDecoration: 'none',
    borderBottom: '1px dotted #c9a84c',
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #141414',
    paddingBottom: 6,
  },
  statKey: {
    fontSize: 9,
    color: '#4a4a4a',
    letterSpacing: '0.15em',
  },
  statVal: {
    fontSize: 10,
    color: '#c9a84c',
    letterSpacing: '0.05em',
  },
  receiverWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  receiverAddr: {
    fontSize: 8,
    color: '#4a4a4a',
    letterSpacing: '0.05em',
    lineHeight: 1.8,
    background: '#0d0d0d',
    padding: '8px 10px',
    border: '1px solid #1e1e1e',
    wordBreak: 'break-all',
  },
}
