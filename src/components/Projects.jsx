import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database } from '../firebase'; // Import your firebase configuration
import SectionHeading from './SectionHeading';
import Slider from 'react-slick';
import Modal from './Modal';
import { Icon } from '@iconify/react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [sectionHeading, setSectionHeading] = useState({});
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const projectsRef = ref(database, `users/${user.uid}/projects`);
        
        // Ensure that the listener is set up only once
        onValue(projectsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const projectList = Object.values(data);
            setProjects(projectList); // Set projects state
            setSectionHeading({
              miniTitle: "Projects",
              title: "My Recent Work"
            });
          }
          setLoading(false);
        });
      } else {
        console.error("User is not authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Clean up the observer on component unmount
  }, []);

  const handleProjectDetails = (project) => {
    setModalData(project);
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
    return <div>Loading...</div>; // Show a loading indicator while waiting
  }

  return (
    <>
      <section className="project-section section gray-bg" id="project">
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
              {projects.map((item, index) => (
                <div key={index} style={{ width: '416px' }}>
                  <div className="project-box">
                    <div className="project-media">
                      <iframe
                        src={item.deployLink}
                        title={item.title}
                        frameBorder="0"
                        style={{ width: '100%', height: '300px' }}
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
                        <span>{item.subTitle}</span>
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
              <Modal modalData={modalData} setModal={setModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
