import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SectionHeading from './SectionHeading';
import Slider from 'react-slick';
import Modal from './Modal';
import { Icon } from '@iconify/react';
import HackathonModal from './HackathonModal';
import { useNavigate } from 'react-router-dom';

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [sectionHeading, setSectionHeading] = useState({});
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            if (data.hackathon) {
              setHackathons(data.hackathon);
              setSectionHeading({
                miniTitle: "Hackathons",
                title: "My Hackathon Achievements"
              });
            }
          }
        } catch (error) {
          console.error('Error fetching hackathons:', error);
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

  const handleProjectDetails = (hackathon) => {
    setModalData(hackathon);
    setModal(true);
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 4000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    variableWidth: true,
  };

  if (loading) {
    return (
      <section className="project-section section gray-bg" id="hackathons">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hackathons || hackathons.length === 0) {
    return (
      <section className="project-section section gray-bg" id="hackathons">
        <div className="container">
          <SectionHeading
            miniTitle="Hackathons"
            title="My Hackathon Achievements"
          />
          <div className="empty-state-banner" style={{
            background: 'linear-gradient(45deg, #FF9800, #F57C00)',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            color: 'white',
            margin: '20px 0',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onClick={() => navigate('/upload')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon icon="bi:trophy" style={{ fontSize: '48px', marginBottom: '20px' }} />
            <h3>No Hackathons Yet</h3>
            <p>Showcase your hackathon achievements and wins!</p>
            <button className="btn btn-light mt-3">
              Add Hackathon <Icon icon="bi:arrow-right" style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="project-section section gray-bg" id="hackathons">
        <div className="container">
          <SectionHeading
            miniTitle={sectionHeading.miniTitle}
            title={sectionHeading.title}
          />
          <div
            className="full-width"
            data-aos="fade"
            data-aos-duration="1200"
            data-aos-delay="400"
          >
            <Slider {...settings} className="slider-gap-24">
              {hackathons.map((item, index) => (
                <div key={index} style={{ width: '416px' }}>
                  <div className="project-box">
                    <div className="project-media">
                      <img
                        src={item.imageUrl}
                        title={item.title}
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        alt={item.title}
                      />
                      <span
                        className="gallery-link"
                        onClick={() => handleProjectDetails(item)}
                      >
                        <i>
                          <Icon icon="bi:plus" />
                        </i>
                      </span>
                    </div>
                    <div className="project-body">
                      <div className="text">
                        <h5>{item.title}</h5>
                        <span>{item.organization}</span>
                      </div>
                      <div className="link">
                        <span
                          className="p-link"
                          onClick={() => handleProjectDetails(item)}
                        >
                          <Icon icon="bi:arrow-right" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      {modal && (
        <div className="mfp-wrap">
          <div className="mfp-container">
            <div className="mfp-bg" onClick={() => setModal(false)}></div>
            <div className="mfp-content">
              <button
                type="button"
                className="mfp-close"
                onClick={() => setModal(false)}
              >
                ×
              </button>
              <HackathonModal modalData={modalData} setModal={setModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
