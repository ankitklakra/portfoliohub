import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Header() {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const styles = {
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--px-white)',
      textDecoration: 'none',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      background: 'linear-gradient(45deg, #3498db, #2ecc71)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    },
    authContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      '@media (max-width: 768px)': {
        display: 'none'
      }
    },
    userEmail: {
      color: 'var(--px-white)',
      fontSize: '14px',
      letterSpacing: '1px',
      textTransform: 'uppercase'
    },
    authButton: {
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '5px',
      color: 'var(--px-white)',
      padding: '8px 20px',
      fontSize: '14px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)'
      }
    },
    logoutButton: {
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '5px',
      color: 'var(--px-white)',
      padding: '8px 20px',
      fontSize: '14px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)'
      }
    },
    mobileAuthContainer: {
      display: 'none',
      '@media (max-width: 768px)': {
        display: 'block',
        padding: '10px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }
    },
    mobileAuthButton: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '10px 0',
      color: 'var(--px-white)',
      fontSize: '14px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      textDecoration: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      '&:hover': {
        color: 'var(--px-white)',
        opacity: 0.8
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setMobileToggle(false);
      navigate('/login');
    });
  };

  return (
    <div
      className={`header-top-fixed one-page-nav ${
        mobileToggle ? 'menu-open menu-open-desk' : ''
      } ${scrolled ? 'fixed-header' : ''}`}
    >
      <div className="container">
        <div className="logo">
          <Link to="/" style={styles.logo}>
            PortfolioHub
          </Link>
        </div>
        <ul className="main-menu">
          <li>
            <Link to="/" onClick={() => setMobileToggle(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/upload" onClick={() => setMobileToggle(false)}>
              Upload
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMobileToggle(false)}>
              About Me
            </Link>
          </li>
         
          {/* Mobile Auth Menu Items */}
          {user ? (
            <>
              <li className="d-lg-none">
                <span style={{ color: 'var(--px-white)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {user.email}
                </span>
              </li>
              <li className="d-lg-none">
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--px-white)',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    padding: '8px 0',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="d-lg-none">
                <Link
                  to="/login"
                  onClick={() => setMobileToggle(false)}
                  style={{
                    color: 'var(--px-white)',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    padding: '8px 0',
                    display: 'block'
                  }}
                >
                  Login
                </Link>
              </li>
              <li className="d-lg-none">
                <Link
                  to="/register"
                  onClick={() => setMobileToggle(false)}
                  style={{
                    color: 'var(--px-white)',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    padding: '8px 0',
                    display: 'block'
                  }}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
        {/* Desktop Auth Buttons */}
        <div className="d-none d-lg-flex" style={styles.authContainer}>
          {user ? (
            <>
              <span style={styles.userEmail}>
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <ScrollLink
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                onClick={() => setMobileToggle(false)}
              >
                <Link
                  to="/login"
                  style={styles.authButton}
                  onClick={() => setMobileToggle(false)}
                >
                  Login
                </Link>
              </ScrollLink>
              <ScrollLink
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                onClick={() => setMobileToggle(false)}
              >
                <Link
                  to="/register"
                  style={styles.authButton}
                  onClick={() => setMobileToggle(false)}
                >
                  Register
                </Link>
              </ScrollLink>
            </>
          )}
          
        </div>
        <button
            className="toggler-menu d-lg-none"
            onClick={() => setMobileToggle(!mobileToggle)}
          >
            <span />
          </button>
      </div>
    </div>
  );
}
