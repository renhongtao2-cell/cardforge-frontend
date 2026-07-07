import { useState } from 'react'

function Hero({ onGenerate }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }
    
    if (!url.startsWith('http')) {
      setUrl('https://' + url)
    }
    
    try {
      const response = await fetch(`/api/cards/metadata?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        setError('Could not fetch metadata. Please check the URL.')
        return
      }
      onGenerate(url)
    } catch (err) {
      onGenerate(url)
    }
  }

  return (
    <section style={{
      textAlign: 'center',
      padding: '6rem 2rem 4rem',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'inline-block',
        background: '#e9456020',
        color: '#e94560',
        padding: '0.4rem 1.2rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
      }}>
        Free URL Preview Card Generator
      </div>
      
      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: '1.5rem',
        letterSpacing: '-1px',
      }}>
        Create stunning<br />
        <span style={{ color: '#e94560' }}>preview cards</span> in seconds
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: '#a0a0b8',
        marginBottom: '3rem',
        maxWidth: '600px',
        margin: '0 auto 3rem',
      }}>
        Transform any URL into a beautiful, shareable preview card. 
        Perfect for social media, newsletters, and marketing.
      </p>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '0.75rem',
        maxWidth: '600px',
        margin: '0 auto',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter any URL... (e.g., https://github.com)"
          style={{
            flex: '1 1 350px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '2px solid #2a2a4a',
            background: '#1a1a2e',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '1rem 2.5rem',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #e94560, #ff6b81)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Generate Card
        </button>
      </form>
      
      {error && (
        <p style={{ color: '#e94560', marginTop: '1rem', fontSize: '0.95rem' }}>{error}</p>
      )}
      
      <div style={{
        marginTop: '3rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        color: '#a0a0b8',
        fontSize: '0.9rem',
      }}>
        <span>No signup required</span>
        <span>100% free</span>
        <span>Instant download</span>
      </div>
    </section>
  )
}

export default Hero
