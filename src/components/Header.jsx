import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Header() {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

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
      setUser(null); // Clear user state on logout
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
          <Link className="navbar-brand" to="/">
            <img
              className="logo-light"
              title="Logo"
              alt="Logo"
               src="/images/logo-light.png"
            />
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
            <ScrollLink
              to="about"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              onClick={() => setMobileToggle(false)}
            >
              <Link to="/about" onClick={() => setMobileToggle(false)}>
              About me
            </Link>
            </ScrollLink>
          </li>
        </ul>
        <div className="d-flex">
          {user ? (
            <>
              <span style={{ color: 'white', marginRight: '15px' }}>
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                }}
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
                className="px-btn d-none d-lg-inline-flex"
              >
                <Link
                  to="/login"
                  style={{ color: 'white' }}
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
                className="px-btn d-none d-lg-inline-flex"
              >
                <Link
                  to="/register"
                  style={{ color: 'white' }}
                  onClick={() => setMobileToggle(false)}
                >
                  Register
                </Link>
              </ScrollLink>
            </>
          )}
          <button
            className="toggler-menu d-lg-none"
            onClick={() => setMobileToggle(!mobileToggle)}
          >
            <span />
          </button>
        </div>
      </div>
    </div>
  );
}
