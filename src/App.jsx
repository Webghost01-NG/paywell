import Header from './components/Header'
import Ticker from './components/Ticker'
import Hero from './components/Hero'
import ArticleCard from './components/ArticleCard'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import { useWallet } from './hooks/useWallet'
import { useUnlocked } from './hooks/useUnlocked'
import { ARTICLES } from './data/articles'

export default function App() {
  const wallet = useWallet()
  const { unlock, isUnlocked, getTxHash, unlockedCount } = useUnlocked()

  return (
    <div style={styles.root}>
      <Header wallet={wallet} unlockedCount={unlockedCount} />
      <Ticker />

      <main style={styles.main}>
        <Hero />

        <div style={styles.layout}>
          {/* Article grid */}
          <section style={styles.articles}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel} className="mono">LATEST ISSUES</span>
              <div style={styles.sectionRule} />
              <span style={styles.sectionCount} className="mono">
                {ARTICLES.length} ARTICLES
              </span>
            </div>

            <div style={styles.grid}>
              {ARTICLES.map((article, i) => (
                <div
                  key={article.id}
                  style={{
                    ...styles.cardWrap,
                    animationDelay: `${i * 0.08}s`,
                  }}
                  className="animate-fade-up"
                >
                  <ArticleCard
                    article={article}
                    wallet={wallet}
                    isUnlocked={isUnlocked(article.id)}
                    txHash={getTxHash(article.id)}
                    onUnlock={unlock}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <HowItWorks unlockedCount={unlockedCount} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    maxWidth: 1280,
    margin: '0 auto',
    width: '100%',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 280px',
    gap: 0,
    alignItems: 'start',
    padding: '0 0 60px',
  },
  articles: {
    borderRight: '1px solid #1e1e1e',
    padding: '32px 40px',
    minWidth: 0,
  },
  sidebar: {
    padding: '32px 28px',
    position: 'sticky',
    top: 110,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: '0.25em',
    color: '#c9a84c',
    whiteSpace: 'nowrap',
  },
  sectionRule: {
    flex: 1,
    height: 1,
    background: '#1e1e1e',
  },
  sectionCount: {
    fontSize: 9,
    color: '#2a2a2a',
    letterSpacing: '0.15em',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 1,
    background: '#1e1e1e',
  },
  cardWrap: {
    opacity: 0,
    background: '#0d0d0d',
  },
}
