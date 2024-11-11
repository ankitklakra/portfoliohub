import React, { useState } from 'react';
import ProfileUpload from './ProfileUpload';
import ProjectUpload from './ProjectUpload';
// import AchievementUpload from './AchievementUpload';
import HackathonUpload from './HackathonUpload';
import PositionUpload from './PositionUpload';
import AndroidProjectUpload from './AndroidProjectUpload';
import AIProjectUpload from './AIProjectUpload';

function Upload() {
  const [selectedSection, setSelectedSection] = useState('Profile');

  const renderSection = () => {
    switch (selectedSection) {
      case 'Profile':
        return <ProfileUpload />;
      case 'Web Project':
        return <ProjectUpload type="Web" />;
      case 'AI/ML Project':
        return <AIProjectUpload type="AI/ML" />;
      case 'Android Project':
        return <AndroidProjectUpload type="Android" />;
      case 'Hackathon':
        return <HackathonUpload />;
      case 'Position of Responsibility':
        return <PositionUpload />;
      default:
        return <ProfileUpload />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#282c34', color: 'white' }}>
      {/* Left Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#333', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Upload Dashboard</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {['Profile', 'Web Project', 'AI/ML Project', 'Android Project', 'Hackathon', 'Position of Responsibility'].map(section => (
            <li key={section} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => setSelectedSection(section)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: selectedSection === section ? '#61dafb' : '#444',
                  color: selectedSection === section ? '#282c34' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}
              >
                {section}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content Area */}
      <div style={{ flex: 1, padding: '20px' }}>
        {renderSection()}
      </div>
    </div>
  );
}

export default Upload;
