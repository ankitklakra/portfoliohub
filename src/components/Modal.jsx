import React from 'react';

export default function Modal({ modalData, setModal }) {
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
    alignItems: 'center',
  };

  const containerStyle = {
    position: 'relative',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    maxWidth: '800px', // Increased to accommodate the iframe
    width: '100%',
    textAlign: 'center',
    color: '#000', // Set text color to black
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '50%',
  };

  const iframeStyle = {
    width: '100%',
    height: '400px',
    border: '1px solid #ddd',
    marginBottom: '20px',
  };

  const linkStyle = {
    display: 'inline-block',
    margin: '0 10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background 0.3s',
  };

  const linkHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={modalStyle}>
      <div style={containerStyle}>
        <button
          type="button"
          style={closeButtonStyle}
          onClick={() => setModal(false)}
        >
          ×
        </button>
        <iframe
          src={modalData.deployLink}
          title={modalData.title}
          style={iframeStyle}
        />
        <h2>{modalData.title}</h2>
        <p>{modalData.description}</p>
        <div className="modal-links">
          <a
            href={modalData.deployLink}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = linkStyle.backgroundColor)}
          >
            Live Demo
          </a>
          <a
            href={modalData.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = linkStyle.backgroundColor)}
          >
            View Code
          </a>
        </div>
      </div>
    </div>
  );
}
