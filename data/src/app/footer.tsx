// components/Footer.tsx

'use client'; // Ensure this file is treated as a Client Component

import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-4 absolute bottom-0 left-0 w-full">
      <div className="container mx-auto flex flex-col items-center justify-between px-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; {currentYear} Enigma 2.0. All rights reserved.
          </p>
        </div>
        <div className="text-center mt-2 md:mt-0">
          <a href="/privacy" className="text-sm hover:underline mx-2">Privacy Policy</a>
          <a href="/terms" className="text-sm hover:underline mx-2">Terms of Service</a>
          <a href="/contact" className="text-sm hover:underline mx-2">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
