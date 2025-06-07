import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Hero() {
  const [userData, setUserData] = useState({
    fullName: '',
    bio: '',
    linkedin: '',
    github: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              fullName: data.fullName || '',
              bio: data.bio || '',
              linkedin: data.linkedin || '',
              github: data.github || '',
              photoURL: data.photoURL || '',
            });
          } else {
            console.log('No user data found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('User not logged in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const styles = {
    section: {
      padding: '5% 0',
      '@media (max-width: 768px)': {
        padding: '40px 0'
      }
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      margin: '0 -15px',
      '@media (max-width: 768px)': {
        flexDirection: 'column'
      }
    },
    column: {
      flex: '0 0 50%',
      padding: '0 15px',
      '@media (max-width: 768px)': {
        flex: '0 0 100%',
        textAlign: 'center',
        marginBottom: '30px',
        order: 2
      }
    },
    imageColumn: {
      flex: '0 0 50%',
      marginTop: '30px',
      padding: '0 15px',
      '@media (max-width: 768px)': {
        flex: '0 0 100%',
        textAlign: 'center',
        marginBottom: '30px',
        order: 1
      }
    },
    textBox: {
      '@media (max-width: 768px)': {
        marginTop: '30px'
      }
    },
    welcome: {
      color: '#3498db',
      fontSize: '1.2rem',
      marginBottom: '1rem',
      '@media (max-width: 768px)': {
        fontSize: '1rem'
      }
    },
    heading: {
      fontSize: '3.5rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      lineHeight: '1.2',
      '@media (max-width: 768px)': {
        fontSize: '2.5rem'
      }
    },
    text: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '2rem',
      color: '#666',
      '@media (max-width: 768px)': {
        fontSize: '1rem'
      }
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px',
      '@media (max-width: 768px)': {
        justifyContent: 'center',
        flexWrap: 'wrap'
      }
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 24px',
      borderRadius: '5px',
      backgroundColor: '#3498db',
      color: 'white',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#2980b9',
        transform: 'translateY(-2px)'
      },
      '@media (max-width: 768px)': {
        padding: '10px 20px',
        fontSize: '0.9rem'
      }
    },
    buttonIcon: {
      marginLeft: '8px',
      fontSize: '1.2rem'
    },
    banner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '@media (max-width: 768px)': {
        marginBottom: '30px'
      }
    },
    profileImage: {
      maxWidth: '80%',
      height: 'auto',
      borderRadius: '16px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      '@media (max-width: 768px)': {
        maxWidth: '100%'
      }
    },
    placeholderImage: {
      fontSize: '200px',
      color: '#ccc',
      '@media (max-width: 768px)': {
        fontSize: '150px'
      }
    },
    skeleton: {
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '1rem',
      animation: 'pulse 1.5s infinite'
    },
    skeletonText: {
      height: '1rem',
      width: '60%'
    },
    skeletonHeading: {
      height: '3rem',
      width: '80%'
    },
    skeletonSubheading: {
      height: '1.5rem',
      width: '40%'
    },
    skeletonParagraph: {
      height: '4rem',
      width: '100%'
    },
    skeletonButton: {
      height: '2.5rem',
      width: '120px'
    },
    skeletonImage: {
      height: '300px',
      width: '100%',
      borderRadius: '16px'
    }
  };

  if (loading) {
    return (
      <section style={styles.section} id="home" data-scroll-index={0}>
        <div style={styles.container}>
          <div style={styles.row}>
            <div style={styles.column}>
              <div style={styles.textBox}>
                <div style={{...styles.skeleton, ...styles.skeletonText}}></div>
                <div style={{...styles.skeleton, ...styles.skeletonHeading}}></div>
                <div style={{...styles.skeleton, ...styles.skeletonSubheading}}></div>
                <div style={{...styles.skeleton, ...styles.skeletonParagraph}}></div>
                <div style={{...styles.skeleton, ...styles.skeletonButton}}></div>
              </div>
            </div>
            <div style={styles.imageColumn}>
              <div style={styles.banner}>
                <div style={{...styles.skeleton, ...styles.skeletonImage}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section} id="home" data-scroll-index={0}>
      <div style={styles.container}>
        <div style={styles.row}>
          <div style={styles.column}>
            <div style={styles.textBox}>
              <h6 style={styles.welcome} data-aos="fade-up" data-aos-duration="1200">
                <span>Welcome</span>
              </h6>

              <h1
                style={styles.heading}
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="100"
              >
                {userData.fullName || 'Create Your Portfolio'}
              </h1>
              <p
                style={styles.text}
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="300"
              >
                {userData.bio || 'Start building your professional portfolio today. Showcase your skills, projects, and achievements to the world.'}
              </p>
              <div
                style={styles.buttonContainer}
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="400"
              >
                {userData.linkedin && (
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.button}
                  >
                    LinkedIn
                    <span style={styles.buttonIcon}>
                      <Icon icon="bi:linkedin" />
                    </span>
                  </a>
                )}
                
                {userData.github && (
                  <a 
                    href={userData.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={styles.button}
                  >
                    GitHub
                    <span style={styles.buttonIcon}>
                      <Icon icon="bi:github" />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div style={styles.imageColumn}>
            <div style={styles.banner}>
              {userData.photoURL ? (
                <img 
                  src={userData.photoURL} 
                  alt={userData.fullName} 
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.placeholderImage}>
                  <Icon icon="bi:person-circle" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
