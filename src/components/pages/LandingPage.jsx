import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-gray-100 overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#0f172a' }}>

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;700;800&display=swap" rel="stylesheet" />

      {/* Sticky Nav */}
      <nav
        style={{
          backgroundColor: scrolled ? 'rgba(30,41,59,0.98)' : 'rgba(30,41,59,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(51,65,85,0.6)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          transition: 'background-color 0.3s ease',
          padding: '1rem 0',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '900', fontSize: '1.2rem', color: 'white', fontStyle: 'italic',
              boxShadow: '0 0 20px rgba(34,211,238,0.3)'
            }}>J</div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '1.5rem', background: 'linear-gradient(to right, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              JobConnect
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            <Link to="/login" style={{ color: '#94a3b8', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#22d3ee'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              Login
            </Link>
            <Link to="/register" style={{
              background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
              color: 'white', padding: '0.6rem 1.5rem', borderRadius: '12px',
              fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(34,211,238,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }} onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(34,211,238,0.4)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(34,211,238,0.25)'; }}>
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem' }}
            className="show-mobile">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ backgroundColor: '#1e293b', padding: '1rem 1.5rem', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: 700 }}>Register</Link>
          </div>
        )}
      </nav>

      {/* Hero Section with Background Image */}
      <section style={{
        background: "linear-gradient(rgba(0,0,0,0.65), rgba(15,23,42,0.85)), url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') center/cover no-repeat",
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '800px', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            Find Your Dream Job,{' '}
            <span style={{ color: '#ffffff' }}>
              Connect with Top Talent.
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.85)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Discover thousands of job opportunities or find the perfect candidate for your team. JobConnect makes connections happen.
          </p>

          {/* Search Bar */}
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '580px', margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search for jobs (e.g., 'Software Engineer, Nairobi')"
              style={{
                flex: 1, minWidth: '200px', padding: '1rem 1.25rem', borderRadius: '12px',
                border: 'none', backgroundColor: 'rgba(255,255,255,0.93)', color: '#1e293b',
                fontSize: '0.95rem', outline: 'none',
              }}
            />
            <Link to="/register" style={{
              padding: '1rem 1.75rem', borderRadius: '12px', whiteSpace: 'nowrap',
              background: 'linear-gradient(to right, #6366f1, #7c3aed)',
              color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              Search Jobs
            </Link>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: '0.85rem 2rem', borderRadius: '14px',
              backgroundColor: 'white', color: '#0f172a',
              fontWeight: 700, textDecoration: 'none', fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
              transition: 'transform 0.2s',
            }}>
              Get Started Free
            </Link>
            <Link to="/login" style={{
              padding: '0.85rem 2rem', borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.25)', color: 'white',
              fontWeight: 600, textDecoration: 'none', fontSize: '1rem',
              backgroundColor: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#0f172a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#22d3ee', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Workflow</p>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: 'white' }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🏢', title: 'Employers', desc: 'Post your job listings and review applications with our streamlined hiring dashboard. Find your perfect candidate faster.' },
              { icon: '🚀', title: 'Job Seekers', desc: 'Search, filter, and apply for jobs that match your skills. Browse thousands of active listings with one click.' },
              { icon: '⚡', title: 'Fast Match', desc: 'Intelligent filtering helps you discover relevant opportunities instantly. Get hired or fill roles with speed.' },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: '#1e293b', borderRadius: '20px', padding: '2rem',
                border: '1px solid #334155', transition: 'transform 0.3s, border-color 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#334155'; }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') center/cover no-repeat",
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Ready to Take the Next Step?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join thousands of employers and job seekers already using JobConnect to build careers and teams.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ padding: '0.9rem 2.25rem', borderRadius: '14px', background: 'linear-gradient(to right, #6366f1, #7c3aed)', color: 'white', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              Sign Up Free
            </Link>
            <Link to="/login" style={{ padding: '0.9rem 2.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontWeight: 600, textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1e293b', borderTop: '1px solid #334155', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #22d3ee, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '0.9rem', fontStyle: 'italic' }}>J</div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: '#94a3b8' }}>JobConnect</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} JobConnect. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
