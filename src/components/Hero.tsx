"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          {!imageLoaded && (
            <div className="w-32 h-32 mx-auto bg-gray-200 animate-pulse rounded-lg mb-8"></div>
          )}
          <Image
            src="/logo.png"
            alt="Logo"
            width={128}
            height={128}
            className={`mx-auto mb-8 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
            onLoad={() => setImageLoaded(true)}
            priority
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Benvenuto su SwitchFy
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          La piattaforma che ti aiuta a risparmiare sui tuoi contratti di energia e gas
        </p>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
          Inizia a Risparmiare
        </button>
      </div>
    </section>
  );
}