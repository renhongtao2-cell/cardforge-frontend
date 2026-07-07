function Features() {
  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Generate beautiful cards in under 2 seconds' },
    { icon: '🎨', title: 'Fully Customizable', desc: 'Choose colors, fonts, and branding to match your style' },
    { icon: '📱', title: 'Perfect Dimensions', desc: 'Optimized for Twitter, LinkedIn, Facebook & more' },
    { icon: '🔗', title: 'API Access', desc: 'Integrate card generation into your own apps' },
    { icon: '📦', title: 'Batch Generation', desc: 'Create multiple cards at once (Pro feature)' },
    { icon: '💎', title: 'HD Quality', desc: 'Export in stunning 1200x630 resolution' },
  ]

  return (
    <section id="features" style={{ padding: '4rem 2rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
        Everything you need
      </h2>
      <p style={{ textAlign: 'center', color: '#a0a0b8', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Professional preview cards, zero hassle
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: '#1a1a2e',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid #2a2a4a',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#e94560' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#2a2a4a' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
            <p style={{ color: '#a0a0b8', fontSize: '0.95rem', lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features


