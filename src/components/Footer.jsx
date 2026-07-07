function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #2a2a4a',
      padding: '3rem 2rem',
      textAlign: 'center',
      color: '#a0a0b8',
      fontSize: '0.9rem',
    }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e94560', marginBottom: '1rem' }}>
        ⚡ CardForge
      </div>
      <p style={{ marginBottom: '1rem' }}>
        Beautiful preview cards for the modern web.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <a href="#" style={{ color: '#a0a0b8', textDecoration: 'none' }}>Privacy</a>
        <a href="#" style={{ color: '#a0a0b8', textDecoration: 'none' }}>Terms</a>
        <a href="#" style={{ color: '#a0a0b8', textDecoration: 'none' }}>API Docs</a>
        <a href="#" style={{ color: '#a0a0b8', textDecoration: 'none' }}>GitHub</a>
      </div>
      <p style={{ color: '#555' }}>
        © 2026 CardForge. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer


