import React from 'react';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Hackathons from '../components/Hackathons';
import Positions from '../components/Positions';

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Hackathons />
      <Positions />
    </main>
  );
}
