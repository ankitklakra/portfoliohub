import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaLinkedin, FaGithub, FaCamera } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    bio: '',
    linkedin: '',
    github: '',
    photo: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      let photoURL = '';
      if (formData.photo) {
        try {
          const storage = getStorage();
          const photoRef = ref(storage, `profile_photos/${user.uid}`);
          await uploadBytes(photoRef, formData.photo);
          photoURL = await getDownloadURL(photoRef);
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          setError('Failed to upload profile photo. Please try again later.');
          setLoading(false);
          return;
        }
      }

      try {
        await setDoc(doc(db, 'users', user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          bio: formData.bio,
          linkedin: formData.linkedin,
          github: formData.github,
          photoURL,
          createdAt: new Date().toISOString()
        });
      } catch (firestoreError) {
        console.error('Error saving user data:', firestoreError);
        setError('Failed to save profile information. Please try again later.');
        setLoading(false);
        return;
      }

      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email or try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('An error occurred during registration. Please try again later.');
      }
    } finally {
      setLoading(false);
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
      maxWidth: '500px',
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
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
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
    photoUpload: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    photoPreview: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: '1rem',
      border: '2px solid rgba(255, 255, 255, 0.1)'
    },
    photoInput: {
      display: 'none'
    },
    photoLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    loginLink: {
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
        <h1 style={styles.heading}>Create Your Portfolio</h1>
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div style={styles.photoUpload}>
            {formData.photo ? (
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Preview"
                style={styles.photoPreview}
              />
            ) : (
              <div style={{...styles.photoPreview, backgroundColor: 'rgba(255, 255, 255, 0.05)'}} />
            )}
            <label htmlFor="photo" style={styles.photoLabel}>
              <FaCamera /> Choose Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleInputChange}
              style={styles.photoInput}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="fullName" style={styles.label}>Full Name</label>
            <FaUser style={styles.icon} />
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="bio" style={styles.label}>Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="linkedin" style={styles.label}>LinkedIn Profile</label>
            <FaLinkedin style={styles.icon} />
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/your-profile"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="github" style={styles.label}>GitHub Profile</label>
            <FaGithub style={styles.icon} />
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/your-username"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <FaLock style={styles.icon} />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <FaLock style={styles.icon} />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Register;
