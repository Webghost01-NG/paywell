import { useState } from 'react'
import { payWithFreighter, stellarExpertUrl } from '../utils/stellar'
import { generateArticle } from '../utils/gemini'

export default function ArticleCard({ article, wallet, isUnlocked, txHash, onUnlock }) {
  const [paying, setPaying] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [content, setContent] = useState(null)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [localTxHash, setLocalTxHash] = useState(txHash || null)

  async function handleUnlock() {
    if (!wallet.connected) {
      wallet.connect()
      return
    }

    setError(null)
    setPaying(true)

    try {
      // Step 1: x402 payment on Stellar
      const result = await payWithFreighter(article.id, wallet.publicKey)
      const hash = result.hash
      setLocalTxHash(hash)

      // Step 2: Generate content with Gemini
      setGenerating(true)
      setPaying(false)
      const text = await generateArticle(article.prompt)
      setContent(text)

      // Step 3: Mark unlocked
      onUnlock(article.id, hash)
      setExpanded(true)
    } catch (err) {
      setError(err.message || 'Payment failed')
    } finally {
      setPaying(false)
      setGenerating(false)
    }
  }

  async function handleReadUnlocked() {
    if (content) {
      setExpanded(e => !e)
      return
    }
    setGenerating(true)
    try {
      const text = await generateArticle(article.prompt)
      setContent(text)
      setExpanded(true)
    } catch {
      setExpanded(true)
    } finally {
      setGenerating(false)
    }
  }

  const currentTx = localTxHash || txHash

  return (
    <article style={styles.card}>
      {/* Top meta */}
      <div style={styles.meta}>
        <span style={styles.category} className="mono">{article.category}</span>
        <span style={styles.readTime} className="mono">{article.readTime}</span>
      </div>

      {/* Icon + Title */}
      <div style={styles.titleRow}>
        <span style={styles.icon}>{article.icon}</span>
        <h2 style={styles.title}>{article.title}</h2>
      </div>

      {/* Teaser */}
      <p style={styles.teaser}>{article.teaser}</p>

      {/* Paywall / Content area */}
      {isUnlocked ? (
        <div>
          {expanded && content ? (
            <div style={styles.contentArea}>
              {content.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} style={styles.paragraph}>{para}</p>
              ))}
            </div>
          ) : expanded && !content ? (
            <div style={styles.generatingArea}>
              <span className="spinner" />
              <span className="mono" style={{ fontSize: 11, color: '#6b6560', marginLeft: 8 }}>
                Generating with Gemini…
              </span>
            </div>
          ) : null}

          <div style={styles.unlockedActions}>
            <button
              onClick={handleReadUnlocked}
              disabled={generating}
              style={styles.readBtn}
            >
              {generating ? (
                <><span className="spinner" /> Generating…</>
              ) : expanded ? (
                '▲ Collapse'
              ) : (
                '▼ Read Article'
              )}
            </button>
            {currentTx && (
              <a
                href={stellarExpertUrl(currentTx)}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.txLink}
                className="mono"
              >
                ✓ TX: {currentTx.slice(0, 8)}…
              </a>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.paywallZone}>
          {/* Blurred preview lines */}
          <div style={styles.blurLines}>
            <div style={styles.blurLine} />
            <div style={{ ...styles.blurLine, width: '85%' }} />
            <div style={{ ...styles.blurLine, width: '70%' }} />
          </div>

          {/* Lock icon */}
          <div style={styles.lockBadge}>
            <span style={styles.lockIcon}>🔒</span>
            <span style={styles.lockPrice} className="mono">{article.price}</span>
          </div>

          {/* x402 payment button */}
          {error && (
            <div style={styles.errorMsg} className="mono">⚠ {error}</div>
          )}

          <button
            onClick={handleUnlock}
            disabled={paying || generating}
            style={{
              ...styles.unlockBtn,
              ...(paying || generating ? styles.unlockBtnDisabled : {}),
            }}
          >
            {paying ? (
              <><span className="spinner" /> Confirming on Stellar…</>
            ) : generating ? (
              <><span className="spinner" /> Generating with Gemini…</>
            ) : !wallet.connected ? (
              '⚡ Connect Wallet to Unlock'
            ) : (
              `⚡ Pay ${article.price} to Unlock`
            )}
          </button>

          <p style={styles.paywallNote} className="mono">
            Real Stellar testnet tx · No account needed · Instant
          </p>
        </div>
      )}
    </article>
  )
}

const styles = {
  card: {
    background: '#111111',
    border: '1px solid #1e1e1e',
    padding: '28px 28px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    transition: 'border-color 0.3s',
    position: 'relative',
    overflow: 'hidden',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 9,
    letterSpacing: '0.2em',
    color: '#c9a84c',
    textTransform: 'uppercase',
  },
  readTime: {
    fontSize: 9,
    color: '#4a4a4a',
    letterSpacing: '0.1em',
  },
  titleRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 20,
    flexShrink: 0,
    marginTop: 2,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(15px, 2.2vw, 20px)',
    fontWeight: 700,
    lineHeight: 1.25,
    color: '#f0ece4',
    letterSpacing: '-0.01em',
  },
  teaser: {
    fontSize: 13,
    lineHeight: 1.65,
    color: '#888480',
    fontStyle: 'italic',
  },
  paywallZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  blurLines: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 4,
  },
  blurLine: {
    height: 8,
    background: 'linear-gradient(to right, #1e1e1e, #2a2a2a)',
    borderRadius: 2,
    width: '100%',
    filter: 'blur(2px)',
  },
  lockBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    padding: '6px 14px',
    borderRadius: 2,
  },
  lockIcon: {
    fontSize: 14,
  },
  lockPrice: {
    fontSize: 12,
    color: '#c9a84c',
    letterSpacing: '0.1em',
  },
  unlockBtn: {
    background: 'linear-gradient(135deg, #c9a84c 0%, #e8d5a3 50%, #c9a84c 100%)',
    backgroundSize: '200% auto',
    border: 'none',
    color: '#0d0d0d',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.1em',
    padding: '10px 24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    animation: 'shimmer 3s linear infinite',
    transition: 'opacity 0.2s',
    width: '100%',
    justifyContent: 'center',
  },
  unlockBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    animation: 'none',
  },
  paywallNote: {
    fontSize: 9,
    color: '#3a3a3a',
    letterSpacing: '0.1em',
    textAlign: 'center',
  },
  errorMsg: {
    color: '#c0392b',
    fontSize: 10,
    letterSpacing: '0.05em',
    textAlign: 'center',
  },
  unlockedActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
    flexWrap: 'wrap',
  },
  readBtn: {
    background: 'transparent',
    border: '1px solid #2a2a2a',
    color: '#c9a84c',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    padding: '6px 14px',
    cursor: 'pointer',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'border-color 0.2s',
  },
  txLink: {
    fontSize: 9,
    color: '#27ae60',
    letterSpacing: '0.08em',
    textDecoration: 'none',
    borderBottom: '1px dotted #27ae60',
    paddingBottom: 1,
  },
  contentArea: {
    borderLeft: '2px solid #c9a84c',
    paddingLeft: 16,
    marginBottom: 12,
    animation: 'fadeUp 0.5s ease',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 1.75,
    color: '#c8c4bc',
    marginBottom: 14,
  },
  generatingArea: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 0',
  },
}
