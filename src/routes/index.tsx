import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ScrollReveal } from '../components/ScrollReveal'
import { InteractiveWorkflowShowcase } from '../components/InteractiveWorkflowShowcase'

export const Route = createFileRoute('/')({ component: LandingPage })


const features = [
  {
    id: 'feat-grid',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" opacity="0.4"/>
      </svg>
    ),
    title: 'Precision 2D Grid',
    desc: 'Snap-to-grid mechanics with pixel-perfect alignment for flawless spatial layouts.',
    color: 'var(--brand)',
    bg: 'var(--brand-bg)',
  },
  {
    id: 'feat-3d',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: 'Live 3D Preview',
    desc: 'High-performance real-time renderer that transforms your 2D plan into a 3D walkthrough.',
    color: 'var(--accent)',
    bg: 'var(--accent-bg)',
  },
  {
    id: 'feat-assets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M16 3H8l-2 4h12l-2-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Asset Library',
    desc: 'Drag-and-drop fixtures - counters, chairs, desks, plants, signage - all to scale.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
  {
    id: 'feat-export',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Save to Cloud',
    desc: 'Save your 2D and 3D layouts securely to the cloud and access them from any device.',
    color: 'var(--cta)',
    bg: 'rgba(234,88,12,0.08)',
  },
]



function LandingPage() {
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('stall-config')) {
      setHasDraft(true)
    }
  }, [])

  return (
    <>
      <section style={{ paddingTop: 32, paddingBottom: 40, overflow: 'hidden', position: 'relative' }}>
        <div className="page-wrap" style={{ position: 'relative' }}>
          
          {/* Action Buttons moved to Top Right */}
          <div className="fade-up d-100" style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            display: 'flex', 
            gap: 10, 
            zIndex: 30 
          }}>
            {hasDraft ? (
              <>
                <Link to="/editor" id="hero-resume-design" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  Resume
                </Link>
                <Link
                  to="/editor"
                  id="hero-start-new"
                  onClick={() => {
                    localStorage.removeItem('stall-config')
                    localStorage.removeItem('stall-elements')
                  }}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  New
                </Link>
              </>
            ) : (
              <Link
                to="/editor"
                id="hero-start-designing"
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                <svg viewBox="0 0 16 16" fill="none" width="15" height="15" style={{ display: 'inline-block', marginRight: 4 }}>
                  <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
                </svg>
                Start Designing
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}
            className="hero-grid">

            {/* 1. Title */}
            <h1 className="display fade-up d-100" style={{
              fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
              color: 'var(--fg)',
              margin: '0',
            }}>
              Design 3D <span style={{ color: 'var(--brand)' }}>Spaces</span><br/> with Precision
            </h1>

            {/* 2. Interactive Showcase */}
            <div className="fade-up d-200 w-full" style={{ position: 'relative', zIndex: 20 }}>
              <InteractiveWorkflowShowcase />
            </div>

            {/* 3. Description */}
            <p className="fade-up d-300" style={{
              fontSize: '1.15rem',
              color: 'var(--fg-soft)',
              lineHeight: 1.7,
              margin: '0',
              maxWidth: 600,
            }}>
              Professional 2D floor planning with snap-to-grid mechanics and
              a real-time 3D preview, all in your browser.
            </p>

          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '72px 0' }}>
        <div className="page-wrap">
          <ScrollReveal animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <p className="label-caps" style={{ color: 'var(--brand)', marginBottom: 10 }}>Features</p>
              <h2 className="display" style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                color: 'var(--fg)', margin: 0,
              }}>
                Everything you need to design a perfect space
              </h2>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <ScrollReveal key={f.id} animation="fade-up" delay={i * 180}>
                <article id={f.id} className="card" style={{ padding: 28, height: '100%' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: f.bg, color: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 18, border: `1px solid ${f.color}22`,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{
                    margin: '0 0 10px',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 700, fontSize: '1.08rem', color: 'var(--fg)',
                  }}>{f.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--fg-soft)', lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      
      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 16px' }}>
        <ScrollReveal animation="zoom-in">
          <div style={{
            maxWidth: 760, margin: '0 auto', textAlign: 'center',
            padding: '56px 40px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-brand)',
            borderRadius: 24,
            boxShadow: 'var(--shadow-lg)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative gradient blobs */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 70% 60% at 0% 0%, rgba(79,70,229,0.08), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(8,145,178,0.07), transparent)',
            }}/>

            <div className="badge" style={{ marginBottom: 24, display: 'inline-flex' }}>
              <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Ready in seconds
            </div>

            <h2 className="display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              color: 'var(--fg)', margin: '0 0 16px',
            }}>
              Start designing your space today
            </h2>
            <p style={{
              color: 'var(--fg-soft)', fontSize: '1rem',
              lineHeight: 1.7, margin: '0 0 36px',
            }}>
              No install needed. Open the designer and build your layout
              in minutes - then preview it live in 3D.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              {hasDraft ? (
                <Link to="/editor" id="cta-resume-design" className="btn btn-primary">
                  Resume Your Design →
                </Link>
              ) : (
                <Link
                  to="/editor"
                  id="cta-open-designer"
                  className="btn btn-primary"
                >
                  Start Designing Now →
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </>
  )
}

