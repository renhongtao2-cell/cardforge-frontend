import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CardGenerator from './components/CardGenerator'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [generatedUrl, setGeneratedUrl] = useState(null)

  return (
    <div className="app">
      <Header />
      <Hero onGenerate={setGeneratedUrl} />
      
      {generatedUrl && (
        <CardGenerator 
          url={generatedUrl} 
          onReset={() => setGeneratedUrl(null)}
        />
      )}
      
      {!generatedUrl && <Features />}
      <Pricing />
      <Footer />
    </div>
  )
}

export default App

