import React from 'react';
import { Icon } from '@iconify/react';

export default function PositionModal({ modalData, setModal }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9999,
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px'
  };

  const containerStyle = {
    position: 'relative',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    maxWidth: '800px',
    width: '100%',
    color: '#333',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    margin: '40px auto',
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  };

  const imageStyle = {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '25px'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#1a1a1a'
  };

  const sectionStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '5px',
    display: 'block'
  };

  const valueStyle = {
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '15px'
  };

  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 10px',
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  };

  const linkHoverStyle = {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)'
  };

  const dateRangeStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px'
  };

  const dateItemStyle = {
    flex: 1
  };

  return (
    <div style={modalStyle}>
      <div style={containerStyle}>
        <button
          type="button"
          style={closeButtonStyle}
          onClick={() => setModal(false)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#555'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#333'}
        >
          ×
        </button>
        
        <img
          src={modalData.imageUrl}
          alt={modalData.title}
          style={imageStyle}
        />
        
        <h2 style={titleStyle}>{modalData.title}</h2>
        
        <div style={sectionStyle}>
          <span style={labelStyle}>Role</span>
          <p style={valueStyle}>{modalData.role}</p>
          
          <span style={labelStyle}>Organization</span>
          <p style={valueStyle}>{modalData.organization}</p>
          
          <div style={dateRangeStyle}>
            <div style={dateItemStyle}>
              <span style={labelStyle}>Start Date</span>
              <p style={valueStyle}>{formatDate(modalData.startDate)}</p>
            </div>
            <div style={dateItemStyle}>
              <span style={labelStyle}>End Date</span>
              <p style={valueStyle}>{formatDate(modalData.endDate)}</p>
            </div>
          </div>
          
          {modalData.description && (
            <>
              <span style={labelStyle}>Description</span>
              <p style={valueStyle}>{modalData.description}</p>
            </>
          )}
          
          {modalData.achievements && modalData.achievements.trim() !== '' && (
            <>
              <span style={labelStyle}>Achievements</span>
              <p style={valueStyle}>{modalData.achievements}</p>
            </>
          )}
          
          {modalData.technologies && modalData.technologies.trim() !== '' && (
            <>
              <span style={labelStyle}>Technologies</span>
              <p style={valueStyle}>{modalData.technologies}</p>
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          {modalData.deployLink && modalData.deployLink.trim() !== '' && (
            <a
              href={modalData.deployLink}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = linkHoverStyle.backgroundColor;
                e.target.style.transform = linkHoverStyle.transform;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = linkStyle.backgroundColor;
                e.target.style.transform = 'none';
              }}
            >
              <Icon icon="bi:link-45deg" />
              View Project
            </a>
          )}
          
          {modalData.githubLink && modalData.githubLink.trim() !== '' && (
            <a
              href={modalData.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = linkHoverStyle.backgroundColor;
                e.target.style.transform = linkHoverStyle.transform;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = linkStyle.backgroundColor;
                e.target.style.transform = 'none';
              }}
            >
              <Icon icon="bi:github" />
              View Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 