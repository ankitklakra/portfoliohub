import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

function PositionUpload() {
  const [position, setPosition] = useState({ title: '', organization: '', work: '', startDate: '', endDate: '', imageUrl: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setPosition({
      ...position,
      [field]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return '';

    const storage = getStorage();
    const imageRef = storageRef(storage, `images/${Date.now()}_${selectedImage.name}`);

    try {
      await uploadBytes(imageRef, selectedImage);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      return '';
    }
  };

  const handlePositionSubmit = async (e) => {
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
    const positionsRef = ref(db, `users/${userId}/positions`);

    const imageUrl = await uploadImage();
    const positionData = { ...position, imageUrl };

    push(positionsRef, positionData)
      .then(() => {
        setSuccess('Position uploaded successfully!');
        setPosition({ title: '', organization: '', work: '', startDate: '', endDate: '', imageUrl: '' });
        setSelectedImage(null);
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      })
      .catch((err) => {
        console.error('Error uploading position:', err);
        setError('Failed to upload position');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  return (
    <form onSubmit={handlePositionSubmit} style={{ maxWidth: '600px', color: 'white', margin: '0 auto', padding: '20px', borderRadius: '8px', backgroundColor: '#444' }}>
      <h2 style={{ textAlign: 'center' }}>Upload Position</h2>
      <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px', backgroundColor: '#333' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Position Title:</label>
          <input
            type="text"
            id="title"
            value={position.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="organization" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Organization:</label>
          <input
            type="text"
            id="organization"
            value={position.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="work" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Work Description:</label>
          <textarea
            id="work"
            value={position.work}
            onChange={(e) => handleInputChange('work', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="startDate" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={position.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="endDate" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>End Date:</label>
          <input
            type="date"
            id="endDate"
            value={position.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Upload Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
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
        Upload Position
      </button>
    </form>
  );
}

export default PositionUpload;
