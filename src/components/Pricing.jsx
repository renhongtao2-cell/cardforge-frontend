import { useState } from 'react'

function Pricing() {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')
  
  const tiers = [
    {
      name: 'Free',
      price: '',
      period: 'forever',
      features: ['50 cards/month', 'Standard quality', 'Basic colors', 'PNG download'],
      cta: 'Get Started',
      highlighted: false,
      tier: 'free',
    },
    {
      name: 'Pro',
      price: '.99',
      period: '/month',
      features: ['1,000 cards/month', 'HD quality', 'Custom branding', 'API access', 'Batch generation', 'No watermark'],
      cta: 'Upgrade to Pro',
      highlighted: true,
      tier: 'pro',
    },
    {
      name: 'Team',
      price: '.99',
      period: '/month',
      features: ['Unlimited cards', 'Max quality', 'Brand kit', 'Priority support', '5 team members', 'Custom domain'],
      cta: 'Contact Sales',
      highlighted: false,
      tier: 'team',
    },
  ]
  
  const handleUpgrade = async (tier) => {
    if (tier === 'free') return
    if (tier === 'team') {
      alert('Contact us at support@cardforge.io for team plans!')
      return
    }
    
    setLoading(tier)
    setError('')
    
    try {
      const userId = localStorage.getItem('cardforge_user_id') || 'user_' + Date.now()
      if (!localStorage.getItem('cardforge_user_id')) {
        localStorage.setItem('cardforge_user_id', userId)
      }
      
      console.log('Creating checkout for tier:', tier, 'user:', userId)
      const res = await fetch('/api/create-checkout?user_id=' + userId + '&tier=' + tier, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        setError('Failed to create checkout session')
      }
    } catch (err) {
      console.error('Upgrade error:', err)
      setError('Upgrade failed: ' + err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id=\"pricing\" style={{ padding: '4rem 2rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
        Simple, transparent pricing
      </h2>
      <p style={{ textAlign: 'center', color: '#a0a0b8', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Start free, upgrade when you need more
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '960px', margin: '0 auto' }}>
        {tiers.map((tier, i) => (
          <div key={i} style={{
            background: tier.highlighted ? 'linear-gradient(135deg, #1a1a2e, #16213e)' : '#1a1a2e',
            padding: '2.5rem 2rem',
            borderRadius: '20px',
            border: tier.highlighted ? '2px solid #e94560' : '1px solid #2a2a4a',
            textAlign: 'center',
            position: 'relative',
          }}>
            {tier.highlighted && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#e94560',
                color: '#fff',
                padding: '0.3rem 1.2rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}>
                MOST POPULAR
              </div>
            )}
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{tier.name}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.3rem' }}>{tier.price}</div>
            <div style={{ color: '#a0a0b8', fontSize: '0.9rem', marginBottom: '2rem' }}>{tier.period}</div>
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', textAlign: 'left' }}>
              {tier.features.map((feat, j) => (
                <li key={j} style={{ padding: '0.5rem 0', color: '#a0a0b8', fontSize: '0.95rem' }}>
                  âœ“ {feat}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handleUpgrade(tier.tier)}
              disabled={loading !== null || tier.tier === 'free'}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                border: tier.highlighted ? 'none' : '1px solid #2a2a4a',
                background: tier.highlighted ? (loading === tier.tier ? '#888' : 'linear-gradient(135deg, #e94560, #ff6b81)') : (tier.tier === 'free' ? '#333' : 'transparent'),
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading || tier.tier === 'free' ? 'not-allowed' : 'pointer',
              }}
            >
              {loading === tier.tier ? 'Processing...' : tier.cta}
            </button>
            
            {error && <p style={{ color: '#e94560', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Pricing
