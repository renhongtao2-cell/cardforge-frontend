import { useState } from 'react'

function Header() {
  const [loading, setLoading] = useState(false)
  
  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('cardforge_user_id') || 'user_' + Date.now()
      if (!localStorage.getItem('cardforge_user_id')) {
        localStorage.setItem('cardforge_user_id', userId)
      }
      
      console.log('Creating checkout for user:', userId)
      const res = await fetch('/api/create-checkout?user_id=' + userId + '&tier=pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        alert('Failed to create checkout session: ' + JSON.stringify(data))
      }
    } catch (err) {
      console.error('Upgrade error:', err)
      alert('Upgrade failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.2rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e94560', letterSpacing: '-0.5px' }}>
        ⚡ CardForge
      </div>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="#features" style={{ color: '#a0a0b8', textDecoration: 'none', fontSize: '0.95rem' }}>Features</a>
        <a href="#pricing" style={{ color: '#a0a0b8', textDecoration: 'none', fontSize: '0.95rem' }}>Pricing</a>
        <button 
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            background: loading ? '#888' : 'linear-gradient(135deg, #e94560, #ff6b81)',
            color: '#fff',
            padding: '0.6rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'Upgrade to Pro'}
        </button>
      </nav>
    </header>
  )
}

export default Header
