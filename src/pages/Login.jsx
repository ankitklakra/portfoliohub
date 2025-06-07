import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { m, motion } from 'framer-motion';
import { FaEnvelope, FaLock} from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1c20 0%, #2d3436 100%)',
      padding: '20px'
    },
    box: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      padding: '2.5rem',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    logo: {
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '2rem',
      fontWeight: '700',
      background: 'linear-gradient(45deg, #3498db, #2ecc71)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    heading: {
      color: '#ffffff',
      fontSize: '1.8rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    inputGroup: {
      marginBottom: '1.5rem',
      position: 'relative'
    },
    label: {
      display: 'block',
      marginBottom: '-0.3rem',
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#3498db',
        boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)'
      }
    },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '2.3rem',
      color: '#666',
      fontSize: '1.1rem'
    },
    errorMessage: {
      color: '#e74c3c',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      textAlign: 'center',
      padding: '0.5rem',
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      borderRadius: '4px'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#3498db',
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '1rem',
      '&:hover': {
        backgroundColor: '#2980b9',
        transform: 'translateY(-2px)'
      },
      '&:disabled': {
        backgroundColor: '#666',
        cursor: 'not-allowed',
        transform: 'none'
      }
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '1.5rem 0',
      color: '#666',
      '&::before, &::after': {
        content: '""',
        flex: 1,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }
    },
    dividerText: {
      padding: '0 1rem',
      fontSize: '0.9rem'
    },
    socialButtons: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    socialButton: {
      flex: 1,
      padding: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    registerLink: {
      textAlign: 'center',
      color: '#666',
      fontSize: '0.9rem',
      '& a': {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: '600',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={styles.box}
      >
        <div style={styles.logo}>PortfolioHub</div>
        <h1 style={styles.heading}>Welcome Back</h1>
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <FaLock style={styles.icon} />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.registerLink}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
