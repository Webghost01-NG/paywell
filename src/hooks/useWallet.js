import { useState, useEffect, useCallback } from 'react'
import {
  checkFreighterInstalled,
  connectFreighter,
  ensureTestnet,
  fundTestnetAccount,
  shortenAddress,
} from '../utils/stellar'

export function useWallet() {
  const [publicKey, setPublicKey] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [freighterInstalled, setFreighterInstalled] = useState(false)
  const [funding, setFunding] = useState(false)
  const [funded, setFunded] = useState(false)

  // Detect Freighter after extension has had time to inject
  useEffect(() => {
    let cancelled = false
    async function detect() {
      await new Promise(r => setTimeout(r, 700))
      if (cancelled) return
      const found = await checkFreighterInstalled()
      if (!cancelled) setFreighterInstalled(found)
    }
    detect()
    return () => { cancelled = true }
  }, [])

  const connect = useCallback(async () => {
    setError(null)
    setConnecting(true)
    try {
      await ensureTestnet()
      const address = await connectFreighter()   // returns address string in v6
      setPublicKey(address)
    } catch (err) {
      setError(err.message)
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setPublicKey(null)
    setError(null)
  }, [])

  const fundAccount = useCallback(async () => {
    if (!publicKey) return
    setFunding(true)
    try {
      const ok = await fundTestnetAccount(publicKey)
      if (ok) {
        setFunded(true)
        setTimeout(() => setFunded(false), 3000)
      }
    } finally {
      setFunding(false)
    }
  }, [publicKey])

  return {
    publicKey,
    shortKey: shortenAddress(publicKey),
    connected: !!publicKey,
    connecting,
    error,
    freighterInstalled,
    connect,
    disconnect,
    fundAccount,
    funding,
    funded,
  }
}
