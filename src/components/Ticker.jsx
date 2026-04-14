import { useState, useEffect } from 'react'
import { getRecentPayments, shortenAddress } from '../utils/stellar'

const STATIC_TICKS = [
  'XLM ↗ STELLAR TESTNET LIVE',
  'x402 PAYMENTS ENABLED',
  'FREIGHTER WALLET REQUIRED',
  'NO ACCOUNTS · NO API KEYS · JUST PAY',
  'BUILT ON STELLAR DEVELOPMENT FOUNDATION',
  'SETTLE IN < 5 SECONDS',
  'FEE: $0.00001 PER TX',
]

export default function Ticker() {
  const [ticks, setTicks] = useState(STATIC_TICKS)

  useEffect(() => {
    async function fetchPayments() {
      const payments = await getRecentPayments(5)
      if (payments.length > 0) {
        const live = payments
          .filter(p => p.type === 'payment')
          .map(p => `PAYMENT ${shortenAddress(p.from)} → ${p.amount} XLM`)
        if (live.length > 0) {
          setTicks([...live, ...STATIC_TICKS])
        }
      }
    }
    fetchPayments()
    const interval = setInterval(fetchPayments, 15000)
    return () => clearInterval(interval)
  }, [])

  const doubled = [...ticks, ...ticks]

  return (
    <div style={styles.wrap}>
      <div style={styles.label} className="mono">LIVE ●</div>
      <div style={styles.track}>
        <div style={styles.inner} className="mono">
          {doubled.map((t, i) => (
            <span key={i} style={styles.tick}>
              {t}
              <span style={styles.sep}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    background: '#c9a84c',
    display: 'flex',
    alignItems: 'center',
    height: 28,
    overflow: 'hidden',
  },
  label: {
    background: '#0d0d0d',
    color: '#c9a84c',
    fontSize: 9,
    letterSpacing: '0.15em',
    padding: '0 12px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    borderRight: '1px solid rgba(201,168,76,0.3)',
  },
  track: {
    overflow: 'hidden',
    flex: 1,
  },
  inner: {
    display: 'flex',
    animation: 'ticker 40s linear infinite',
    whiteSpace: 'nowrap',
  },
  tick: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#0d0d0d',
    fontSize: 9,
    letterSpacing: '0.15em',
    fontWeight: 500,
    padding: '0 8px',
  },
  sep: {
    margin: '0 8px',
    opacity: 0.4,
    fontSize: 7,
  },
}
