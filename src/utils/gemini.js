const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

export async function generateArticle(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    // Return a mock article if no API key is set
    return getMockArticle()
  }

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an award-winning technology journalist writing for a premium publication. ${prompt}

Important formatting rules:
- Write in clear paragraphs with no markdown symbols (no **, no ##, no bullets)
- Start directly with the article content, no preamble
- Use engaging, intelligent prose
- Each paragraph should be 3-5 sentences
- Write exactly 5-6 paragraphs`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.message || 'Gemini API error')
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) throw new Error('No content returned from Gemini')
    return text.trim()
  } catch (err) {
    console.error('Gemini error:', err)
    return getMockArticle()
  }
}

function getMockArticle() {
  return `The internet was built on a fundamental assumption: information should flow freely, and commerce would follow. For thirty years, that bargain held — advertising subsidized content, subscriptions locked premium access, and API keys became the digital handshake between services. But something is breaking. The old systems were designed for humans with browsers and credit cards, not for autonomous software that needs to pay for a database query at 3 AM without waking anyone up.

The emergence of x402 represents a quiet but profound shift in how value moves through the internet's infrastructure. Built on the long-dormant HTTP 402 status code — a placeholder from 1996 that the internet's architects reserved for "payment required" scenarios that hadn't yet materialized — the protocol strips the payment handshake down to its atomic minimum. A client requests a resource. The server responds with machine-readable payment instructions. The client pays, attaches proof, retries. The server delivers. No accounts. No API keys. No subscription management.

Stellar's role in this new architecture is not accidental. The network was designed from its founding in 2014 with a specific thesis: that the most important payments in the world are not the large ones, but the small ones. The remittances, the micropayments, the fractions of a cent that make per-request pricing economically coherent. With transaction fees hovering around $0.00001, Stellar can handle payment flows that would be economically absurd on Ethereum or even Base — the networks where most x402 activity currently concentrates.

What makes the current moment different from the many previous micropayment false starts is the maturity of the infrastructure surrounding it. Stablecoins are first-class citizens on Stellar, meaning agents can pay in USDC without volatility exposure. Freighter and similar wallets have made cryptographic signing accessible to non-specialist users. And the x402 Foundation, co-founded by Coinbase and Cloudflare with Google and Visa now participating, represents a level of institutional backing that previous micropayment attempts could never assemble.

The implications extend well beyond content paywalls. Every API, every data feed, every computational service becomes a resource that can charge per-request without the overhead of account management. The long tail of services that were previously unmonetizable — too small to justify subscription infrastructure, too valuable to give away — suddenly becomes accessible. In this sense, x402 on Stellar is not merely a payment protocol. It is a new primitive for the internet's economic layer, one that was described thirty years ago and has only now arrived.`
}
