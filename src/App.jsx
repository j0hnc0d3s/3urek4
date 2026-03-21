import { useState, useEffect, useRef } from 'react'
import logo from './assets/logo.png'

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.25rem 3rem;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.4s ease;
  }
  .nav.scrolled {
    background: rgba(17, 17, 18, 0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; }
  .nav-logo img { width: 28px; height: 28px; object-fit: contain; }
  .nav-logo span {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 1rem;
    color: white; letter-spacing: 0.12em;
  }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 400;
    color: rgba(240,240,240,0.55);
    text-decoration: none; letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: white; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    position: relative; overflow: hidden;
    padding: 6rem 2rem 4rem;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 50%),
      radial-gradient(ellipse 50% 60% at 10% 60%, rgba(255,255,255,0.015) 0%, transparent 50%);
  }
  .hero-asterisk-bg {
    position: absolute; z-index: 0;
    font-size: clamp(300px, 45vw, 600px);
    color: rgba(255,255,255,0.015);
    font-family: 'Syne', sans-serif; font-weight: 800;
    user-select: none; pointer-events: none;
    top: 50%; left: 50%; transform: translate(-50%, -52%);
    animation: slow-spin 60s linear infinite;
    letter-spacing: -0.05em;
  }
  @keyframes slow-spin {
    from { transform: translate(-50%, -52%) rotate(0deg); }
    to { transform: translate(-50%, -52%) rotate(360deg); }
  }
  .hero-content { position: relative; z-index: 1; max-width: 800px; }
  .hero-logo {
    width: clamp(200px, 15vw, 200px);
    margin-bottom: 0.1rem;
    animation: float 6s ease-in-out infinite;
    filter: drop-shadow(0 0 40px rgba(255,255,255,0.1));
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .hero-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 400;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(201,168,76,0.8);
    margin-bottom: 1.25rem;
  }
  .hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(3.5rem, 9vw, 7.5rem);
    font-weight: 800; line-height: 0.9;
    letter-spacing: -0.03em;
    color: white;
    margin-bottom: 1.5rem;
  }
  .hero-title span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.3);
  }
  .hero-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.95rem, 2vw, 1.15rem);
    font-weight: 300; line-height: 1.7;
    color: rgba(240,240,240,0.55);
    max-width: 560px; margin: 0 auto 2.5rem;
  }
  .hero-pledge {
    display: inline-block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-style: italic;
    color: rgba(201,168,76,0.7);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 100px;
    padding: 0.6rem 1.5rem;
    background: rgba(201,168,76,0.04);
    backdrop-filter: blur(10px);
    margin-bottom: 3rem;
  }
  .hero-cta {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
  }
  .btn-primary {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500;
    letter-spacing: 0.06em;
    padding: 0.85rem 2.2rem;
    background: white; color: #111112;
    border: none; border-radius: 100px;
    cursor: pointer; text-decoration: none;
    transition: all 0.25s ease;
  }
  .btn-primary:hover {
    background: rgba(255,255,255,0.85);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(255,255,255,0.1);
  }
  .btn-secondary {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 400;
    letter-spacing: 0.06em;
    padding: 0.85rem 2.2rem;
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 100px;
    cursor: pointer; text-decoration: none;
    backdrop-filter: blur(10px);
    transition: all 0.25s ease;
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,0.09);
    color: white;
    transform: translateY(-2px);
  }
  .scroll-indicator {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: rgba(255,255,255,0.2); font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
    animation: bounce 2s ease-in-out infinite;
  }
  .scroll-line {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.2), transparent);
  }
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(6px); }
  }

  /* SECTION COMMON */
  .section { padding: 7rem 3rem; max-width: 1200px; margin: 0 auto; }
  .section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(201,168,76,0.7);
    margin-bottom: 1rem;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700; line-height: 1.1;
    color: white; margin-bottom: 1.5rem;
  }
  .section-divider {
    width: 100%; height: 1px;
    background: linear-gradient(to right, rgba(255,255,255,0.06), transparent);
    margin: 0 auto 7rem;
  }

  /* GLASS CARD */
  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: all 0.3s ease;
  }
  .glass-card:hover {
    background: rgba(255,255,255,0.065);
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 3rem;
  }
  .about-main {
    grid-column: 1 / -1;
    padding: 2.5rem;
  }
  .about-main p {
    font-size: 1.1rem; line-height: 1.8;
    color: rgba(240,240,240,0.65);
  }
  .about-main p + p { margin-top: 1rem; }
  .about-pillar { padding: 2rem; }
  .pillar-icon {
    font-size: 1.5rem; margin-bottom: 1rem;
    display: block;
  }
  .pillar-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem; font-weight: 600;
    color: white; margin-bottom: 0.5rem;
  }
  .pillar-body {
    font-size: 0.875rem; line-height: 1.65;
    color: rgba(240,240,240,0.45);
  }
  .about-stats {
    grid-column: 1 / -1;
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.05);
    border-radius: 20px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .stat-item {
    padding: 2rem 1.5rem; text-align: center;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(10px);
  }
  .stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem; font-weight: 700;
    color: white; display: block;
  }
  .stat-label {
    font-size: 0.75rem; color: rgba(240,240,240,0.4);
    margin-top: 0.25rem; display: block;
    letter-spacing: 0.05em;
  }

  /* PRODUCTS */
  .products-section { background: rgba(255,255,255,0.01); }
  .flagship-card {
    padding: 0;
    overflow: hidden;
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .flagship-info { padding: 3rem; }
  .flagship-badge {
    display: inline-block;
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; font-weight: 500;
    color: rgba(201,168,76,0.9);
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 100px; padding: 0.35rem 0.9rem;
    margin-bottom: 1.25rem;
    font-family: 'DM Sans', sans-serif;
  }
  .flagship-title {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem; font-weight: 700;
    color: white; margin-bottom: 0.5rem;
    line-height: 1.1;
  }
  .flagship-tagline {
    font-size: 0.9rem; color: rgba(240,240,240,0.45);
    margin-bottom: 1.5rem; font-style: italic;
  }
  .flagship-desc {
    font-size: 0.95rem; line-height: 1.75;
    color: rgba(240,240,240,0.6);
    margin-bottom: 2rem;
  }
  .feature-list { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 2rem; }
  .feature-list li {
    font-size: 0.875rem; color: rgba(240,240,240,0.55);
    display: flex; align-items: flex-start; gap: 0.75rem;
  }
  .feature-list li::before {
    content: '∗'; color: rgba(201,168,76,0.7);
    flex-shrink: 0; margin-top: 0.05rem;
  }
  .flagship-traction {
    padding: 3rem;
    background: rgba(255,255,255,0.02);
    border-left: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column; justify-content: center;
  }
  .traction-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-bottom: 1.5rem;
  }
  .traction-items { display: flex; flex-direction: column; gap: 0.75rem; }
  .traction-item {
    display: flex; align-items: center; gap: 0.85rem;
    font-size: 0.875rem; color: rgba(240,240,240,0.5);
  }
  .traction-dot {
    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  }
  .traction-dot.done { background: rgba(100,220,100,0.7); }
  .traction-dot.pending { background: rgba(201,168,76,0.6); }

  .coming-soon-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
  }
  .coming-card { padding: 2rem; position: relative; overflow: hidden; }
  .coming-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  }
  .coming-label {
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(240,240,240,0.2); margin-bottom: 0.75rem;
    font-family: 'DM Sans', sans-serif;
  }
  .coming-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.2rem; font-weight: 600;
    color: rgba(255,255,255,0.5); margin-bottom: 0.5rem;
  }
  .coming-desc {
    font-size: 0.825rem; color: rgba(240,240,240,0.25); line-height: 1.6;
  }

  /* CONTACT */
  .contact-grid {
    display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem;
    margin-top: 3rem;
  }
  .contact-info { display: flex; flex-direction: column; gap: 1rem; }
  .contact-card { padding: 1.75rem; display: flex; align-items: flex-start; gap: 1rem; }
  .contact-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .contact-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    color: white; margin-bottom: 0.25rem;
  }
  .contact-card-val {
    font-size: 0.825rem; color: rgba(240,240,240,0.45);
    text-decoration: none;
    transition: color 0.2s;
  }
  .contact-card-val:hover { color: rgba(240,240,240,0.8); }
  .contact-form-card { padding: 2rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-group label {
    display: block;
    font-size: 0.75rem; letter-spacing: 0.08em;
    text-transform: uppercase; font-weight: 500;
    color: rgba(240,240,240,0.35);
    margin-bottom: 0.5rem;
    font-family: 'DM Sans', sans-serif;
  }
  .form-input, .form-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 0.85rem 1.1rem;
    color: white; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; font-weight: 300;
    outline: none;
    transition: all 0.2s ease;
  }
  .form-input:focus, .form-textarea:focus {
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.065);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.03);
  }
  .form-input::placeholder, .form-textarea::placeholder { color: rgba(240,240,240,0.2); }
  .form-textarea { resize: vertical; min-height: 120px; }
  .form-submit {
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 500;
    letter-spacing: 0.06em;
    padding: 0.95rem;
    background: white; color: #111112;
    border: none; border-radius: 10px;
    cursor: pointer; margin-top: 0.5rem;
    transition: all 0.25s ease;
  }
  .form-submit:hover {
    background: rgba(255,255,255,0.88);
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(255,255,255,0.08);
  }
  .form-success {
    text-align: center; padding: 2rem;
    font-size: 0.9rem; color: rgba(100,220,100,0.8);
  }

  /* FOOTER */
  footer {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 3rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
  }
  .footer-left { display: flex; align-items: center; gap: 0.75rem; }
  .footer-left img { width: 22px; opacity: 0.7; }
  .footer-left span {
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem; font-weight: 700;
    color: rgba(255,255,255,0.4); letter-spacing: 0.1em;
  }
  .footer-pledge {
    font-size: 0.75rem; font-style: italic;
    color: rgba(240,240,240,0.2);
    font-family: 'DM Sans', sans-serif;
    max-width: 400px; text-align: center;
  }
  .footer-right {
    font-size: 0.75rem; color: rgba(240,240,240,0.2);
    font-family: 'DM Sans', sans-serif;
  }
  .footer-logo {
    width: 500px;        /* 👈 increase this to whatever size you want */
    height: auto;        /* keeps aspect ratio intact */
    animation: float 6s ease-in-out infinite;
  }

  /* FADE IN ANIMATION */
  .fade-up {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-up.visible {
    opacity: 1; transform: translateY(0);
  }

  /* MOBILE */
  @media (max-width: 768px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .section { padding: 5rem 1.5rem; }
    .about-grid { grid-template-columns: 1fr; }
    .about-stats { grid-template-columns: repeat(2, 1fr); }
    .flagship-card { grid-template-columns: 1fr; }
    .flagship-traction { border-left: none; border-top: 1px solid rgba(255,255,255,0.06); }
    .coming-soon-grid { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; text-align: center; }
    .footer-pledge { display: none; }
  }
`

// ── Components ────────────────────────────────────────────────────────────────

function useFadeUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Nav({ scrolled }) {
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#home" className="nav-logo">
        <img src={logo} alt="3urek4" />
        <span>3UREK4</span>
      </a>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  )
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="hero-asterisk-bg">✳</div>
      <div className="hero-content">
        <img src={logo} alt="3urek4 logo" className="hero-logo" />
        <p className="hero-eyebrow">Caribbean Tech Company · Kingston, Jamaica</p>
        <h1 className="hero-title">
          3URE<span>K</span>4
        </h1>
        <p className="hero-subtitle">
          Building digital solutions that advance the welfare of the people — 
          starting in the Caribbean, reaching the whole human race.
        </p>
        <p className="hero-pledge">
          "...to play her part in advancing the welfare of the whole human race." — Jamaica's National Pledge
        </p>
        <div className="hero-cta">
          <a href="#products" className="btn-primary">Our Products</a>
          <a href="#about" className="btn-secondary">Learn More</a>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  )
}

function About() {
  const ref = useFadeUp()
  const r2 = useFadeUp()
  const r3 = useFadeUp()

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <section id="about" className="section">
        <div ref={ref} className="fade-up">
          <p className="section-label">Who We Are</p>
          <h2 className="section-title">Tech built for the people.<br />By the people.</h2>
        </div>

        <div className="about-grid">
          <div ref={r2} className="fade-up glass-card about-main">
            <p>
              3urek4 is a Caribbean tech company building digital solutions rooted in Jamaica's National Pledge — 
              a commitment to advancing the welfare of the whole human race. We design technology that addresses 
              real problems faced by everyday people, starting in the Caribbean and scaling outward.
            </p>

            <p>
              Founded by four University of the West Indies graduates, our team combines deep technical expertise 
              with on-the-ground community knowledge. We don't adapt foreign models to Jamaica — we build from 
              the ground up, for our people first, with the intention to scale that same impact globally.
            </p>
          </div>

          <div ref={r3} className="fade-up" style={{ display: 'contents' }}>
            {[
              { icon: '🧠', title: 'Technology First', body: 'Every solution is built around real Caribbean constraints — connectivity, affordability, and access — not repurposed from elsewhere.' },
              { icon: '🌍', title: 'Impact Driven', body: 'Every product must measurably improve lives. A farmer\'s income. A consumer\'s access to food. A community\'s resilience.' },
              { icon: '🚀', title: 'Caribbean to Global', body: 'We start at home — Jamaica first, then the Caribbean — but our vision extends to the whole human race.' },
            ].map((p, i) => (
              <div key={i} className="glass-card about-pillar">
                <span className="pillar-icon">{p.icon}</span>
                <div className="pillar-title">{p.title}</div>
                <div className="pillar-body">{p.body}</div>
              </div>
            ))}
          </div>

          <div className="about-stats">
            {[
              { val: '2024', label: 'Founded' },
              { val: '4', label: 'Co-Founders' },
              { val: '🏆 ×3', label: 'Vincent Hosang Awards' },
              { val: 'JA → 🌎', label: 'Our Trajectory' },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-val">{s.val}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" style={{ maxWidth: '1200px', margin: '0 auto 0' }} />
    </div>
  )
}

function Products() {
  const ref = useFadeUp()
  const r2 = useFadeUp()
  const r3 = useFadeUp()
  const [showModal, setShowModal] = useState(false) 

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <section id="products" className="section products-section">
        <div ref={ref} className="fade-up">
          <p className="section-label">What We Build</p>
          <h2 className="section-title">Our Products</h2>
          <p style={{ color: 'rgba(240,240,240,0.45)', fontSize: '1rem', maxWidth: '520px', marginBottom: '3rem' }}>
            FreshFoods is our flagship product and proof of concept. More products are in development — 
            each one rooted in a real Caribbean problem.
          </p>
        </div>

        {/* Flagship */}
        <div ref={r2} className="fade-up glass-card flagship-card">
          <div className="flagship-info">
            <span className="flagship-badge">Flagship Product</span>
            <h3 className="flagship-title">FreshFoods</h3>
            <p className="flagship-tagline">Farm-to-Door Agricultural Marketplace</p>
            <p className="flagship-desc">
              A mobile and web marketplace connecting verified Jamaican farmers directly to consumers — 
              eliminating the middleman, reducing post-harvest waste, and delivering fresh locally-grown 
              produce affordably across Jamaica and the Caribbean.
            </p>
            <ul className="feature-list">
              <li>Farmer verification via RADA & Ministry of Agriculture registry</li>
              <li>Produce grading system for quality assurance</li>
              <li>"Meet the Farmer" storytelling feature</li>
              <li>Last-mile delivery via Knutsford & DoorWay Express</li>
              <li>AI demand forecasting to reduce post-harvest waste</li>
              <li>Surplus produce channel to food banks & communities</li>
            </ul>

            <button className="btn-primary" style={{ display: 'inline-block' }} onClick={() => setShowModal(true)}>
              Have a look
            </button>

          </div>
          <div className="flagship-traction">
            <div className="traction-title">Traction</div>
            <div className="traction-items">
              {[
                { done: true, label: 'Google Play Console Registered' },
                { done: true, label: 'Market Research — Rural St. Andrew' },
                { done: true, label: 'Prototype in User Testing' },
                { done: true, label: 'JMMB CSR Recognition' },
                { done: true, label: '🏆 2nd Place — Vincent Hosang Competition' },
                { done: true, label: '🏆 Top Undergraduate Team' },
                { done: true, label: '🏆 Corporate Responsibility Award' },
                { done: false, label: 'freshja.com Domain Secured (Pending)' },
                { done: false, label: 'Apple Developer Program (Pending)' },
                { done: false, label: 'App Store Submission (Pending)' },
              ].map((t, i) => (
                <div key={i} className="traction-item">
                  <div className={`traction-dot ${t.done ? 'done' : 'pending'}`} />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div ref={r3} className="fade-up" style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.25)', marginBottom: '1rem', fontFamily: "'DM Sans', sans-serif" }}>
            More products in development
          </p>
          <div className="coming-soon-grid">
            {[
              { title: 'Mirri', desc: 'Mental health companion app for Caribbean youth featuring guided support, journaling, and a virtual companion.' },
              { title: 'Medic', desc: 'A dual-purpose platform streamlining queue management in public medical institutions and patient management in private ones — reducing wait times, improving care coordination, and bringing efficiency to the Caribbean healthcare space.' },
              { title: 'PeliPlan', desc: 'Campus navigation app for UWI students — find your classes, check schedules, see which lecturer is teaching where, and get turn-by-turn directions across campus, all in one place.' },
/*            { title: 'Scholar', desc: 'AI-powered scholarship matching platform for Caribbean students — connecting talent to opportunity across the region.' }, */
              { title: 'TBA', desc: 'Every product starts with a real Caribbean problem. The next one is already in research.' },
            ].map((p, i) => (
              <div key={i} className="glass-card coming-card">
                <div className="coming-label">Coming Soon</div>
                <div className="coming-title">{p.title}</div>
                <div className="coming-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" style={{ maxWidth: '1200px', margin: '0 auto 0' }} />

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              <iframe
                src="https://drive.google.com/file/d/1ubVR-CotPoPkfa85PuhNACNO0nB3aZTd/preview"
                allow="autoplay"
                allowFullScreen
              />
            </div>
          </div>
        )}
    </div>
  )
}

function Contact() {
  const ref = useFadeUp()
  const r2 = useFadeUp()

  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <section id="contact" className="section">
        <div ref={ref} className="fade-up">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Let's build something<br />for the people.</h2>
        </div>

        <div ref={r2} className="fade-up contact-grid">
          <div className="contact-info">
            {[
              { icon: '📧', title: 'Email', val: 'john@3urek4.com', href: 'mailto:john@3urek4.com' },
              { icon: '📱', title: 'Phone', val: '+1 (876) 208-2517', href: 'tel:+18762082517' },
              { icon: '📸', title: 'Instagram', val: '@3ur.k4', href: 'https://instagram.com/3ur.k4' },
              { icon: '💼', title: 'LinkedIn', val: '3urek4', href: 'https://www.linkedin.com/company/111900012/admin/dashboard/' },
            ].map((c, i) => (
              <div key={i} className="glass-card contact-card">
                <div className="contact-icon">{c.icon}</div>
                <div>
                  <div className="contact-card-title">{c.title}</div>
                  <a href={c.href} className="contact-card-val" target="_blank" rel="noreferrer">{c.val}</a>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card contact-form-card">
            {submitted ? (
              <div className="form-success">
                <p style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>✓</p>
                <p>Message received. We'll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input className="form-input" type="text" placeholder="Your name" required
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" placeholder="your@email.com" required
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="form-textarea" placeholder="Tell us about your idea, partnership, or inquiry..."
                    value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>
                
                {error && <p style={{ color: 'rgba(255,100,100,0.8)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</p>}
                <button type="submit" className="form-submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-left">
        <img src={logo} alt="3urek4" className="footer-logo" />
        <span>3UREK4</span>
      </div>
      <p className="footer-pledge">
        "...to play her part in advancing the welfare of the whole human race."<br />
        — Jamaica's National Pledge
      </p>
      <div className="footer-right">© {new Date().getFullYear()} 3urek4. Kingston, Jamaica.</div>
    </footer>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{styles}</style>
      <Nav scrolled={scrolled} />
      <Hero />
      <About />
      <Products />
      <Contact />
      <Footer />
    </>
  )
}
