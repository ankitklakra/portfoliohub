import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload'; 
import Layout from './components/Layout';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';

function App() {
  useEffect(() => {
    Aos.init({
      once: true,
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} /> 
    </Routes>
  );
}

export default App;
