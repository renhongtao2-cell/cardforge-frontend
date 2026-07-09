import { useState, useEffect } from 'react'

function CardGenerator({ url, onReset }) {
  const [loading, setLoading] = useState(false)
  const [cardUrl, setCardUrl] = useState('')
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [accentColor, setAccentColor] = useState('#e94560')
  const [customTitle, setCustomTitle] = useState('')
  const [customDesc, setCustomDesc] = useState('')
  const [error, setError] = useState('')
  const [metadata, setMetadata] = useState(null)
  const [usage, setUsage] = useState(null)
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`
  const tier = 'free'

  useEffect(() => {
    fetch(`/api/usage?user_id=${userId}&tier=${tier}`)
      .then(res => res.json())
      .then(data => setUsage(data))
      .catch(() => {})
  }, [userId, tier])

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setCardUrl('')

    try {
      const metaRes = await fetch(`/api/cards/metadata?url=${encodeURIComponent(url)}`)
      if (!metaRes.ok) throw new Error('Failed to fetch URL metadata')
      const meta = await metaRes.json()
      setMetadata(meta)

      const params = new URLSearchParams({ url })
      if (bgColor) params.set('bg_color', bgColor)
      if (accentColor) params.set('accent_color', accentColor)
      if (customTitle) params.set('custom_title', customTitle)
      if (customDesc) params.set('custom_description', customDesc)

      const cardRes = await fetch(`/api/cards/generate?${params}`, {
        headers: {
          'X-User-ID': userId,
          'X-Tier': tier,
        }
      })

      if (!cardRes.ok) {
        const errData = await cardRes.json()
        throw new Error(errData.detail || 'Failed to generate card')
      }

      const blob = await cardRes.blob()
      const blobUrl = URL.createObjectURL(blob)
      setCardUrl(blobUrl)

      fetch(`/api/consume?user_id=${userId}&tier=${tier}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => setUsage(data))
        .catch(() => {})
    } catch (err) {
      setError(err.message || 'Failed to generate card')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!cardUrl) return
    const a = document.createElement('a')
    a.href = cardUrl
    a.download = `cardforge_${metadata?.domain || 'card'}.png`
    a.click()
  }

  return (
    <section style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        <div style={{ background: '#1a1a2e', padding: '2rem', borderRadius: '16px', border: '1px solid #2a2a4a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Customize Card</h2>
            <button onClick={onReset} style={{ background: 'none', border: 'none', color: '#a0a0b8', cursor: 'pointer', fontSize: '1.2rem' }}>X</button>
          </div>

          {usage && (
            <div style={{ background: '#16213e', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#a0a0b8' }}>
              Usage: {usage.used}/{usage.limit} cards this month
              {usage.remaining !== undefined && usage.remaining > 0 && (
                <span style={{ color: '#00d2a0', marginLeft: '0.5rem' }}>{usage.remaining} remaining</span>
              )}
            </div>
          )}

          {metadata && (
            <div style={{ background: '#16213e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ color: '#e94560', fontWeight: 600, marginBottom: '0.3rem' }}>{metadata.domain}</div>
              <div style={{ color: '#fff', fontWeight: 600 }}>{metadata.title}</div>
              <div style={{ color: '#a0a0b8', marginTop: '0.3rem' }}>{metadata.description}</div>
            </div>
          )}

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a0a0b8' }}>Background Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "50px", height: "40px", border: "none", cursor: "pointer", borderRadius: "8px" }} />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #2a2a4a", background: "#0f0f1a", color: "#fff" }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a0a0b8' }}>Accent Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: "50px", height: "40px", border: "none", cursor: "pointer", borderRadius: "8px" }} />
              <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #2a2a4a", background: "#0f0f1a", color: "#fff" }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a0a0b8' }}>Custom Title (optional)</label>
            <input type="text" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} placeholder="Override the page title" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #2a2a4a", background: "#0f0f1a", color: "#fff", fontSize: "0.95rem" }} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a0a0b8' }}>Custom Description (optional)</label>
            <textarea value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} rows={3} placeholder="Override the description" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #2a2a4a", background: "#0f0f1a", color: "#fff", fontSize: "0.95rem", resize: "vertical" }} />
          </div>

          <button onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: loading ? '#444' : 'linear-gradient(135deg, #e94560, #ff6b81)', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Generating...' : 'Generate Card'}
          </button>

          {error && <p style={{ color: '#e94560', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        </div>

        <div>
          {cardUrl ? (
            <div style={{ textAlign: 'center' }}>
              <img src={cardUrl} alt="Generated preview card" style={{ width: "100%", maxWidth: "600px", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleDownload} style={{ padding: "0.8rem 2rem", borderRadius: "10px", border: "none", background: "#00d2a0", color: "#000", fontWeight: 700, cursor: "pointer" }}>Download PNG</button>
                <button onClick={() => { navigator.clipboard.writeText(cardUrl); alert("Link copied!") }} style={{ padding: "0.8rem 2rem", borderRadius: "10px", border: "1px solid #2a2a4a", background: "transparent", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Copy Link</button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#1a1a2e', borderRadius: '16px', border: '2px dashed #2a2a4a', padding: '4rem 2rem', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>Preview</div>
              <p style={{ color: "#a0a0b8", fontSize: "1.1rem" }}>Your preview card will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CardGenerator
