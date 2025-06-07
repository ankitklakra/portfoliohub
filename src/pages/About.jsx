import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaEdit, FaCamera } from 'react-icons/fa';

function About() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    github: '',
    linkedin: '',
    email: '',
    skills: [],
    photoURL: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Styles object
  const styles = {
    aboutContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1c20 0%, #2d3436 100%)',
      color: '#ffffff',
      padding: '2rem'
    },
    aboutContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    profileSection: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    profileImageContainer: {
      position: 'relative',
      width: '200px',
      height: '200px',
      margin: '0 auto 2rem'
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #3498db',
      boxShadow: '0 0 20px rgba(52, 152, 219, 0.3)',
      transition: 'transform 0.3s ease'
    },
    name: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      background: 'linear-gradient(45deg, #3498db, #2ecc71)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem',
      marginTop: '1.5rem'
    },
    socialLink: {
      color: '#ffffff',
      fontSize: '1.5rem',
      transition: 'all 0.3s ease'
    },
    bioSection: {
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '2rem',
      borderRadius: '15px',
      marginBottom: '3rem',
      backdropFilter: 'blur(10px)'
    },
    sectionTitle: {
      color: '#3498db',
      marginBottom: '1rem',
      fontSize: '1.8rem'
    },
    bioText: {
      lineHeight: '1.8',
      color: '#ecf0f1'
    },
    skillsSection: {
      marginBottom: '3rem'
    },
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem'
    },
    skillItem: {
      background: 'rgba(52, 152, 219, 0.1)',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center',
      border: '1px solid rgba(52, 152, 219, 0.2)',
      transition: 'all 0.3s ease'
    },
    experienceSection: {
      marginBottom: '3rem'
    },
    experienceTimeline: {
      position: 'relative'
    },
    experienceItem: {
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '1.5rem',
      borderRadius: '10px',
      marginBottom: '1.5rem',
      borderLeft: '4px solid #3498db'
    },
    experienceTitle: {
      color: '#3498db',
      marginBottom: '0.5rem'
    },
    company: {
      color: '#2ecc71',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    duration: {
      color: '#95a5a6',
      fontSize: '0.9rem',
      marginBottom: '0.5rem'
    },
    description: {
      color: '#ecf0f1',
      lineHeight: '1.6'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#1a1c20'
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#1a1c20',
      color: '#e74c3c',
      fontSize: '1.2rem',
      textAlign: 'center',
      padding: '2rem'
    },
    editButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
      transition: 'all 0.3s ease'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: '#2d3436',
      padding: '2rem',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#3498db'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '5px',
      border: '1px solid #404040',
      backgroundColor: '#1a1c20',
      color: 'white',
      fontSize: '1rem'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '5px',
      border: '1px solid #404040',
      backgroundColor: '#1a1c20',
      color: 'white',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    saveButton: {
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    cancelButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    skillTag: {
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    removeSkill: {
      cursor: 'pointer',
      color: '#e74c3c'
    },
    addSkillInput: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    photoUploadContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    photoPreview: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #3498db',
      marginBottom: '1rem',
      cursor: 'pointer'
    },
    photoUploadButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease'
    },
    photoInput: {
      display: 'none'
    },
    uploadProgress: {
      width: '100%',
      height: '4px',
      backgroundColor: '#404040',
      borderRadius: '2px',
      marginTop: '0.5rem',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#3498db',
      transition: 'width 0.3s ease'
    }
  };

  useEffect(() => {
    const auth = getAuth();
    
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      
      if (user) {
        try {
          console.log('Fetching data for user:', user.uid);
          const db = getFirestore();
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            console.log('User data found:', userDoc.data());
            const data = userDoc.data();
            setUserData({
              name: data.fullName || 'No Name Available',
              bio: data.bio || 'No Bio Available',
              photoURL: data.photoURL || 'default-image-url',
              socialLinks: {
                github: data.github || '',
                linkedin: data.linkedin || '',
                email: data.email || ''
              },
              skills: data.skills || [],
              experience: data.experience || []
            });
          } else {
            console.log('No user data found in Firestore');
            setError('User data not found');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Error fetching user data');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user logged in');
        setError('No user is currently logged in.');
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleEditClick = () => {
    setEditForm({
      fullName: userData.name,
      bio: userData.bio,
      github: userData.socialLinks.github,
      linkedin: userData.socialLinks.linkedin,
      email: userData.socialLinks.email,
      skills: [...userData.skills],
      photoURL: userData.photoURL
    });
    setPhotoFile(null);
    setUploadProgress(0);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setEditForm(prev => ({
        ...prev,
        photoURL: previewUrl
      }));
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return null;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const storage = getStorage();
      const photoRef = ref(storage, `profile_photos/${user.uid}/${Date.now()}_${photoFile.name}`);
      
      // Upload the file
      const uploadTask = uploadBytes(photoRef, photoFile);
      
      // Get download URL
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);

      // Upload photo if changed
      let photoURL = editForm.photoURL;
      if (photoFile) {
        photoURL = await uploadPhoto();
      }

      await updateDoc(userDocRef, {
        fullName: editForm.fullName,
        bio: editForm.bio,
        github: editForm.github,
        linkedin: editForm.linkedin,
        email: editForm.email,
        skills: editForm.skills,
        photoURL: photoURL
      });

      // Update local state
      setUserData(prev => ({
        ...prev,
        name: editForm.fullName,
        bio: editForm.bio,
        photoURL: photoURL,
        socialLinks: {
          github: editForm.github,
          linkedin: editForm.linkedin,
          email: editForm.email
        },
        skills: editForm.skills
      }));

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ color: 'white', marginTop: '1rem' }}>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.errorContainer}
      >
        <p>{error}</p>
      </motion.div>
    );
  }

  if (!userData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.errorContainer}
      >
        <p>No user data found.</p>
      </motion.div>
    );
  }

  const { name, bio, photoURL, socialLinks, skills, experience } = userData;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.aboutContainer}
    >
      <div style={styles.aboutContent}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.profileSection}
        >
          <div style={styles.profileImageContainer}>
            <img 
              src={photoURL} 
              alt="Profile" 
              style={styles.profileImage}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
          <h1 style={styles.name}>{name}</h1>
          <div style={styles.socialLinks}>
            {socialLinks.github && (
              <a 
                href={socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.socialLink}
                onMouseOver={(e) => {
                  e.target.style.color = '#3498db';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#ffffff';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaGithub />
              </a>
            )}
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.socialLink}
                onMouseOver={(e) => {
                  e.target.style.color = '#3498db';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#ffffff';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaLinkedin />
              </a>
            )}
            {socialLinks.email && (
              <a 
                href={`mailto:${socialLinks.email}`}
                style={styles.socialLink}
                onMouseOver={(e) => {
                  e.target.style.color = '#3498db';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#ffffff';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaEnvelope />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={styles.bioSection}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={styles.sectionTitle}>About Me</h2>
            <button 
              style={styles.editButton}
              onClick={handleEditClick}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
          <p style={styles.bioText}>{bio}</p>
        </motion.div>

        {skills.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={styles.skillsSection}
          >
            <h2 style={styles.sectionTitle}>Skills</h2>
            <div style={styles.skillsGrid}>
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  style={styles.skillItem}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(52, 152, 219, 0.2)';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(52, 152, 219, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {experience.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={styles.experienceSection}
          >
            <h2 style={styles.sectionTitle}>Experience</h2>
            <div style={styles.experienceTimeline}>
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  style={styles.experienceItem}
                >
                  <h3 style={styles.experienceTitle}>{exp.title}</h3>
                  <p style={styles.company}>{exp.organization}</p>
                  <p style={styles.duration}>{exp.startDate} - {exp.endDate}</p>
                  <p style={styles.description}>{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {isEditing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ color: '#3498db', marginBottom: '1.5rem' }}>Edit Profile</h2>
            
            <div style={styles.photoUploadContainer}>
              <img 
                src={editForm.photoURL} 
                alt="Profile Preview" 
                style={styles.photoPreview}
                onClick={() => document.getElementById('photoInput').click()}
              />
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handlePhotoChange}
                style={styles.photoInput}
              />
              <button 
                style={styles.photoUploadButton}
                onClick={() => document.getElementById('photoInput').click()}
              >
                <FaCamera /> Change Photo
              </button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={styles.uploadProgress}>
                  <div 
                    style={{
                      ...styles.progressBar,
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Bio</label>
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>GitHub Profile</label>
              <input
                type="url"
                name="github"
                value={editForm.github}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="https://github.com/username"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={editForm.linkedin}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Skills</label>
              <div style={styles.skillsContainer}>
                {editForm.skills.map((skill, index) => (
                  <div key={index} style={styles.skillTag}>
                    {skill}
                    <span 
                      style={styles.removeSkill}
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
              <div style={styles.addSkillInput}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  style={styles.input}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button 
                  onClick={handleAddSkill}
                  style={styles.saveButton}
                >
                  Add
                </button>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button 
                onClick={handleSave}
                style={styles.saveButton}
              >
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default About;
