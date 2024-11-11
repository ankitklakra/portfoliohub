import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

function ProfileUpload({ setLoading, setError, setSuccess }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!name || !bio || !collegeName || !photo) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const userId = user.uid;
    const storage = getStorage();
    const photoRef = storageRef(storage, `photos/${userId}_${Date.now()}`);

    uploadBytes(photoRef, photo)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);

        const userProfileData = {
          name,
          bio,
          collegeName,
          photoURL: downloadURL,
          links: {
            linkedin,
            github,
          },
        };

        return set(userRef, userProfileData);
      })
      .then(() => {
        setSuccess('Profile information saved successfully!');
        setName('');
        setBio('');
        setCollegeName('');
        setLinkedin('');
        setGithub('');
        setPhoto(null);
        document.getElementById('photo').value = ''; // Reset file input
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      })
      .catch((err) => {
        console.error('Error uploading data:', err);
        setError('Failed to save profile information');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleProfileSubmit} style={{ maxWidth: '600px', color: 'white', margin: '0 auto', padding: '20px', borderRadius: '8px', backgroundColor: '#444', marginBottom: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Profile Information</h2>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="name" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="bio" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="collegeName" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>College Name:</label>
        <input
          type="text"
          id="collegeName"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="linkedin" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>LinkedIn Profile:</label>
        <input
          type="url"
          id="linkedin"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="github" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>GitHub Profile:</label>
        <input
          type="url"
          id="github"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="photo" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Photo:</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'block', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white', width: '100%' }}
        />
      </div>
      <button
        type="submit"
        disabled={setLoading}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#61dafb',
          color: '#282c34',
          cursor: setLoading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {setLoading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}

export default ProfileUpload;
