import { useState, useCallback } from 'react'

const STORAGE_KEY = 'stellar_paywall_unlocked'

function loadUnlocked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUnlocked(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useUnlocked() {
  const [unlocked, setUnlocked] = useState(loadUnlocked)

  const unlock = useCallback((articleId, txHash) => {
    setUnlocked(prev => {
      const next = {
        ...prev,
        [articleId]: {
          txHash,
          unlockedAt: new Date().toISOString(),
        },
      }
      saveUnlocked(next)
      return next
    })
  }, [])

  const isUnlocked = useCallback(
    articleId => !!unlocked[articleId],
    [unlocked]
  )

  const getTxHash = useCallback(
    articleId => unlocked[articleId]?.txHash,
    [unlocked]
  )

  const unlockedCount = Object.keys(unlocked).length

  return { unlocked, unlock, isUnlocked, getTxHash, unlockedCount }
}
