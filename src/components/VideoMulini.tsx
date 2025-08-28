"use client";

import { useState, useRef } from 'react';

export default function VideoMulini() {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadStart = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Caricamento video...</div>
        </div>
      )}
      <video
        ref={videoRef}
        src="https://cdn.shopify.com/videos/c/o/v/4b7e2fb2887c4bd0aa15d62db11b58d2.mp4"
        controls
        preload="metadata"
        className="w-full h-auto rounded-lg shadow-lg"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        poster="/logo.png"
      />
    </div>
  );
}