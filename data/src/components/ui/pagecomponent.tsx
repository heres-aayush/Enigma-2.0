"use client";
import React from 'react';
import Particles from "@tsparticles/react";

const ParticleBackground = () => {
  return (
    <Particles
      id="tsparticles"
      options={{
        background: {
          color: {
            value: "#000000", // Background color
          },
        },
        particles: {
          number: {
            value: 100, // Number of particles
            density: {
              enable: true,
            //   value_area: 800, // Controls particle density
            },
          },
          color: {
            value: "#ffffff", // Particle color
          },
          shape: {
            type: "circle",
          },
          size: {
            value: 3,
          },
          move: {
            enable: true,
            speed: 1,
          },
        },
        detectRetina: true, // Retina display support
      }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -1, // Make sure particles stay in the background
      }}
    />
  );
};

export default ParticleBackground;
