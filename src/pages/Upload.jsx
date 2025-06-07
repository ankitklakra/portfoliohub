import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Icon } from '@iconify/react';

function Upload() {
  const [selectedSection, setSelectedSection] = useState('Web Project');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    deployLink: '',
    githubLink: '',
    subTitle: '',
    startDate: '',
    endDate: '',
    role: '',
    organization: '',
    achievements: '',
    technologies: '',
    image: null
  });

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return '';
    const user = auth.currentUser;
    const imageRef = ref(storage, `${selectedSection.toLowerCase()}/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please log in to upload content');
      }

      const userDocRef = doc(db, 'users', user.uid);
      let uploadData = { ...formData };
      
      // Upload image if exists
      if (formData.image) {
        uploadData.imageUrl = await uploadImage(formData.image);
        delete uploadData.image;
      }

      // Add timestamp and type
      uploadData.createdAt = new Date().toISOString();
      uploadData.type = selectedSection;

      // Update Firestore document
      await updateDoc(userDocRef, {
        [selectedSection.toLowerCase()]: arrayUnion(uploadData)
      });

      setSuccess(`${selectedSection} uploaded successfully!`);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        deployLink: '',
        githubLink: '',
        subTitle: '',
        startDate: '',
        endDate: '',
        role: '',
        organization: '',
        achievements: '',
        technologies: '',
        image: null
      });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#282c34',
      color: 'white',
      '@media (min-width: 768px)': {
        flexDirection: 'row'
      }
    },
    sidebar: {
      width: '100%',
      backgroundColor: '#333',
      padding: '20px',
      '@media (min-width: 768px)': {
        width: '250px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }
    },
    mobileMenuButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      backgroundColor: '#333',
      color: 'white',
      border: 'none',
      width: '100%',
      cursor: 'pointer',
      '@media (min-width: 768px)': {
        display: 'none'
      }
    },
    sidebarContent: {
      display: isMobileMenuOpen ? 'block' : 'none',
      '@media (min-width: 768px)': {
        display: 'block'
      }
    },
    content: {
      flex: 1,
      padding: '20px',
      '@media (min-width: 768px)': {
        padding: '40px'
      }
    },
    formContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    },
    form: {
      backgroundColor: '#1a1a1a',
      padding: '20px',
      borderRadius: '8px',
      color: 'white',
      '@media (min-width: 768px)': {
        padding: '30px'
      }
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: 'white',
      fontSize: '0.9rem',
      '@media (min-width: 768px)': {
        fontSize: '1rem'
      }
    },
    input: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#2d2d2d',
      color: 'white',
      border: '1px solid #404040',
      borderRadius: '4px',
      fontSize: '0.9rem',
      '@media (min-width: 768px)': {
        padding: '12px',
        fontSize: '1rem'
      }
    },
    textarea: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#2d2d2d',
      color: 'white',
      border: '1px solid #404040',
      borderRadius: '4px',
      minHeight: '100px',
      resize: 'vertical',
      fontSize: '0.9rem',
      '@media (min-width: 768px)': {
        padding: '12px',
        fontSize: '1rem'
      }
    },
    sectionButton: {
      width: '100%',
      padding: '12px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#444',
      color: 'white',
      cursor: 'pointer',
      textAlign: 'left',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '8px',
      fontSize: '0.9rem',
      '@media (min-width: 768px)': {
        padding: '10px',
        fontSize: '1rem'
      }
    },
    activeSectionButton: {
      backgroundColor: '#61dafb',
      color: '#282c34'
    },
    submitButton: {
      marginTop: '20px',
      padding: '12px 24px',
      backgroundColor: '#61dafb',
      color: '#1a1a1a',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: '100%',
      justifyContent: 'center',
      fontSize: '0.9rem',
      '@media (min-width: 768px)': {
        width: 'auto',
        fontSize: '1rem'
      }
    },
    alert: {
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '20px',
      fontSize: '0.9rem',
      '@media (min-width: 768px)': {
        padding: '15px',
        fontSize: '1rem'
      }
    },
    alertDanger: {
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      color: '#dc3545',
      border: '1px solid rgba(220, 53, 69, 0.2)'
    },
    alertSuccess: {
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      color: '#28a745',
      border: '1px solid rgba(40, 167, 69, 0.2)'
    }
  };

  const renderForm = () => {
    const commonFields = (
      <>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
            style={styles.input}
          />
        </div>
      </>
    );

    switch (selectedSection) {
      case 'Web Project':
      case 'AI/ML Project':
      case 'Android Project':
        return (
          <>
            {commonFields}
            <div style={styles.formGroup}>
              <label style={styles.label}>Deploy Link</label>
              <input
                type="url"
                name="deployLink"
                value={formData.deployLink}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Technologies Used</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="e.g., React, Node.js, Python"
              />
            </div>
          </>
        );
      case 'Hackathon':
        return (
          <>
            {commonFields}
            <div style={styles.formGroup}>
              <label style={styles.label}>Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                style={styles.textarea}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Technologies Used</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="e.g., React, Node.js, Python"
              />
            </div>
          </>
        );
      case 'Position of Responsibility':
        return (
          <>
            {commonFields}
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                style={styles.textarea}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Mobile Menu Button */}
      <button
        style={styles.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span>Upload Dashboard</span>
        <Icon icon={isMobileMenuOpen ? 'bi:chevron-up' : 'bi:chevron-down'} />
      </button>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', display: { xs: 'none', md: 'block' } }}>
            Upload Dashboard
          </h2>
          {['Web Project', 'AI/ML Project', 'Android Project', 'Hackathon', 'Position of Responsibility'].map(section => (
            <button
              key={section}
              onClick={() => {
                setSelectedSection(section);
                setIsMobileMenuOpen(false);
              }}
              style={{
                ...styles.sectionButton,
                ...(selectedSection === section ? styles.activeSectionButton : {})
              }}
            >
              <Icon 
                icon={
                  section.includes('Project') ? 'bi:code-square' :
                  section === 'Hackathon' ? 'bi:trophy' :
                  'bi:briefcase'
                } 
              />
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.content}>
        <div style={styles.formContainer}>
          <h2 style={{ marginBottom: '20px' }}>Upload {selectedSection}</h2>
          
          {error && (
            <div style={{...styles.alert, ...styles.alertDanger}}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {renderForm()}
            
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Uploading...
                </>
              ) : (
                <>
                  <Icon icon="bi:cloud-upload" />
                  Upload {selectedSection}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
