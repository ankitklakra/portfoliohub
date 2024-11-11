import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function About() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userId = user.uid;
          const db = getDatabase();
          const userRef = ref(db, 'users/' + userId);

          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            setError('User data not found');
          }
        } else {
          setError('No user is currently logged in.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!userData) {
    return <p style={{ color: 'white', textAlign: 'center' }}>No user data found.</p>;
  }

  const { name = 'No Name Available', bio = 'No Bio Available', collegeName = 'No College Name Available', photoURL = 'default-image-url' } = userData;

  return (
    <div style={{
        padding: '20px',
        backgroundColor: '#282c31',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '500px',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#444',
          textAlign: 'center'
        }}>
          <img src={photoURL} alt="Profile" style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '20px'
          }} />
          <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>{name}</h1>
          <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>{bio}</p>
          <p style={{ fontSize: '1em', color: '#ccc' }}>{collegeName}</p>
        </div>
       
      </div>
      
    
  );
}

export default About;
