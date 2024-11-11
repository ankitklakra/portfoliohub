import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Icon } from '@iconify/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Hero() {
  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    linkedin: '',
    github: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getDatabase();
        const userId = user.uid;
        const userRef = ref(db, `users/${userId}`);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData({
              name: data.name || '',
              bio: data.bio || '',
              linkedin: data.links?.linkedin || '',
              github: data.links?.github || '',
              photoURL: data.photoURL || '',
            });
          } else {
            console.log('No data available');
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

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  if (loading) {
    return (
      <section className="home-section" id="home" data-scroll-index={0}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hs-text-box">
                {/* Skeleton elements for text */}
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-heading"></div>
                <div className="skeleton skeleton-subheading"></div>
                <div className="skeleton skeleton-paragraph"></div>
                <div className="skeleton skeleton-button"></div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hs-banner">
                {/* Skeleton element for image */}
                <div className="skeleton skeleton-image"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section" id="home" data-scroll-index={0}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hs-text-box">
              <h6 data-aos="fade-up" data-aos-duration="1200">
                <span>{userData.name}</span>
              </h6>

              <h1
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="100"
              >
                {userData.name}
              </h1>
              <p
                className="text"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="300"
              >
                {userData.bio}
              </p>
              <div
                className="btn-bar d-flex align-items-sm-center flex-column flex-sm-row"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="400"
              >
                <a
                  style={{ marginRight: '20px' }}
                  href={userData.linkedin}
                  target="_blank"
                  className="px-btn"
                >
                  LinkedIn{' '}
                  <i className="d-flex">
                    <Icon icon="bi:linkedin" />
                  </i>
                </a>
                
                <a href={userData.github} target="_blank" className="px-btn">
                  GitHub{' '}
                  <i className="d-flex">
                    <Icon icon="bi:github" />
                  </i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hs-banner">
              <img height={'500px'} width={'500px'} src={userData.photoURL} alt="photo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
