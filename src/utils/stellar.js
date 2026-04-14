// ─── Freighter API v6 imports ─────────────────────────────────────────────────
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from '@stellar/freighter-api'

// ─── Stellar Testnet config ───────────────────────────────────────────────────
const HORIZON_URL = 'https://horizon-testnet.stellar.org'
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'

export const RECEIVER_ADDRESS =
  import.meta.env.VITE_STELLAR_RECEIVER ||
  'VITE_STELLAR_RECEIVER=GDTCJR7NOGLMLHJRJQQXMOC5Z7STE4Y3GC5ZXFAZ32Y2WHXUBYQ2LKMM'

export const UNLOCK_PRICE_XLM =
  import.meta.env.VITE_UNLOCK_PRICE || '1'

// ─── Check if Freighter extension is installed ────────────────────────────────
// Returns true/false — safe to call anytime
export async function checkFreighterInstalled() {
  try {
    const result = await isConnected()
    return result?.isConnected === true
  } catch {
    return false
  }
}

// ─── Connect wallet & return public key ───────────────────────────────────────
// v6: requestAccess() returns { address, error }  (NOT publicKey)
export async function connectFreighter() {
  // 1. Is the extension installed?
  const connResult = await isConnected()
  if (!connResult?.isConnected) {
    throw new Error(
      'Freighter not found. Install it at freighter.app then refresh this page.'
    )
  }

  // 2. Request access — opens the Freighter popup if needed
  //    Returns { address: string } on success, { error: string } on failure
  const accessResult = await requestAccess()
  if (accessResult.error) {
    throw new Error('Freighter access denied: ' + accessResult.error)
  }
  if (!accessResult.address) {
    throw new Error('No address returned. Make sure Freighter is unlocked.')
  }

  return accessResult.address
}

// ─── Ensure user is on Stellar Testnet ───────────────────────────────────────
export async function ensureTestnet() {
  try {
    const netResult = await getNetwork()
    if (netResult.error) return // can't check, proceed anyway
    const passphrase = netResult.networkPassphrase || ''
    const networkName = netResult.network || ''
    // network name is "TESTNET" on testnet
    if (
      passphrase &&
      !passphrase.includes('Test SDF') &&
      networkName.toUpperCase() !== 'TESTNET'
    ) {
      throw new Error(
        'Wrong network! In Freighter → Settings → Network → select "TESTNET".'
      )
    }
  } catch (err) {
    if (err.message.startsWith('Wrong network')) throw err
    // Any other error from getNetwork — ignore and continue
  }
}

// ─── Send XLM payment via Freighter ──────────────────────────────────────────
// v6: signTransaction() returns { signedTxXdr, error }  (NOT signedTransaction)
export async function payWithFreighter(articleId, senderPublicKey) {
  const StellarSdk = await import('@stellar/stellar-sdk')
  const { Horizon, TransactionBuilder, Operation, Asset, Memo, BASE_FEE } = StellarSdk

  const server = new Horizon.Server(HORIZON_URL)
  const account = await server.loadAccount(senderPublicKey)

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: RECEIVER_ADDRESS,
        asset: Asset.native(), // XLM
        amount: String(UNLOCK_PRICE_XLM),
      })
    )
    .addMemo(Memo.text(`unlock:${articleId}`))
    .setTimeout(60)
    .build()

  // v6 signTransaction returns { signedTxXdr, signerAddress, error }
  const signResult = await signTransaction(transaction.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  })

  if (signResult.error) {
    throw new Error('Transaction signing failed: ' + signResult.error)
  }
  if (!signResult.signedTxXdr) {
    throw new Error('Transaction was cancelled by user.')
  }

  // Submit to Stellar network
  const signedTx = TransactionBuilder.fromXDR(
    signResult.signedTxXdr,
    NETWORK_PASSPHRASE
  )
  const result = await server.submitTransaction(signedTx)

  return {
    hash: result.hash,
    ledger: result.ledger,
  }
}

// ─── Verify a tx hash exists on testnet ──────────────────────────────────────
export async function verifyTransaction(txHash) {
  try {
    const res = await fetch(`${HORIZON_URL}/transactions/${txHash}`)
    if (!res.ok) return { verified: false }
    const data = await res.json()
    return { verified: true, hash: data.hash, createdAt: data.created_at }
  } catch {
    return { verified: false }
  }
}

// ─── Get recent payments to receiver (for ticker) ────────────────────────────
export async function getRecentPayments(limit = 10) {
  try {
    const res = await fetch(
      `${HORIZON_URL}/accounts/${RECEIVER_ADDRESS}/payments?limit=${limit}&order=desc`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data._embedded?.records || []
  } catch {
    return []
  }
}

// ─── Fund testnet account via Friendbot ──────────────────────────────────────
export async function fundTestnetAccount(publicKey) {
  try {
    const res = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    )
    return res.ok
  } catch {
    return false
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function shortenAddress(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`
}

export function stellarExpertUrl(hash) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`
}
