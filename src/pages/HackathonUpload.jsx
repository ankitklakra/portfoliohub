import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function HackathonUpload() {
  const [hackathon, setHackathon] = useState({ name: '', description: '', imageUrl: '', deployLink: '', codeLink: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setHackathon({
      ...hackathon,
      [field]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Assuming you will handle image upload separately
    // For now, let's assume the file URL is directly assigned
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('imageUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHackathonSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('User not logged in');
      return;
    }

    const userId = user.uid;
    const db = getDatabase();
    const hackathonsRef = ref(db, `users/${userId}/hackathons`);

    push(hackathonsRef, hackathon)
      .then(() => {
        setSuccess('Hackathon uploaded successfully!');
        setHackathon({ name: '', description: '', imageUrl: '', deployLink: '', codeLink: '' });
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      })
      .catch((err) => {
        console.error('Error uploading hackathon:', err);
        setError('Failed to upload hackathon');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  return (
    <form onSubmit={handleHackathonSubmit} style={{ maxWidth: '600px', color: 'white', margin: '0 auto', padding: '20px', borderRadius: '8px', backgroundColor: '#444' }}>
      <h2 style={{ textAlign: 'center' }}>Upload Hackathon</h2>
      <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px', backgroundColor: '#333' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            id="name"
            value={hackathon.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Description:</label>
          <textarea
            id="description"
            value={hackathon.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Image Upload:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="deployLink" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Deployment Link:</label>
          <input
            type="url"
            id="deployLink"
            value={hackathon.deployLink}
            onChange={(e) => handleInputChange('deployLink', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="codeLink" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Code Link:</label>
          <input
            type="url"
            id="codeLink"
            value={hackathon.codeLink}
            onChange={(e) => handleInputChange('codeLink', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
      <button
        type="submit"
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#61dafb',
          color: '#282c34',
          cursor: 'pointer',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Upload Hackathon
      </button>
    </form>
  );
}

export default HackathonUpload;
