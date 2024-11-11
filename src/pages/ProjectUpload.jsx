import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function ProjectUpload() {
  const [project, setProject] = useState({ title: '', description: '', codeLink: '', deployLink: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setProject({
      ...project,
      [field]: value,
    });
  };

  const handleProjectSubmit = (e) => {
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
    const projectsRef = ref(db, `users/${userId}/projects`);

    push(projectsRef, project)
      .then(() => {
        setSuccess('Project uploaded successfully!');
        setProject({ title: '', description: '', codeLink: '', deployLink: '' });
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      })
      .catch((err) => {
        console.error('Error uploading project:', err);
        setError('Failed to upload project');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  return (
    <form onSubmit={handleProjectSubmit} style={{ maxWidth: '600px', color: 'white', margin: '0 auto', padding: '20px', borderRadius: '8px', backgroundColor: '#444' }}>
      <h2 style={{ textAlign: 'center' }}>Upload Project</h2>
      <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px', backgroundColor: '#333' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Title:</label>
          <input
            type="text"
            id="title"
            value={project.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Description:</label>
          <textarea
            id="description"
            value={project.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="codeLink" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>GitHub Link:</label>
          <input
            type="url"
            id="codeLink"
            value={project.codeLink}
            onChange={(e) => handleInputChange('codeLink', e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#222', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="deployLink" style={{ display: 'block', color: 'white', marginBottom: '5px' }}>Deployment Link:</label>
          <input
            type="url"
            id="deployLink"
            value={project.deployLink}
            onChange={(e) => handleInputChange('deployLink', e.target.value)}
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
        Upload Project
      </button>
    </form>
  );
}

export default ProjectUpload;
