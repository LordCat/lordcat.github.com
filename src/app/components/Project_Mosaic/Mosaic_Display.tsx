'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface GridItem {
  title: string;
  text: string;
  tags: string[];
  videoUrl: string;
  projectUrl: string;
}

interface PortfolioGridProps {
  items: GridItem[];
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items }) => {
  const [displayedItems, setDisplayedItems] = useState<GridItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const videoCache = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const cache: { [url: string]: HTMLVideoElement } = {};
    
    items.forEach(item => {
      if (!cache[item.videoUrl]) {
        const video = document.createElement('video');
        video.src = item.videoUrl;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        cache[item.videoUrl] = video;
      }
    });
    return cache;
  }, [items]);

  const getRandomItems = useCallback(() => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [items]);

  useEffect(() => {
    const updateItems = () => {
      if (hoveredIndex === null) {
        setDisplayedItems(prevItems => {
          const newItems = getRandomItems();
          return newItems.map((item, index) => prevItems[index] && hoveredIndex === index ? prevItems[index] : item);
        });
      }
    };

    updateItems();
    const intervalId = setInterval(updateItems, 10000);
    return () => clearInterval(intervalId);
  }, [items, hoveredIndex, getRandomItems]);

  useEffect(() => {
    displayedItems.forEach(item => {
      const video = videoCache[item.videoUrl];
      if (video) {
        video.play().catch(error => console.error("Error playing video:", error));
      }
    });
  }, [displayedItems, videoCache]);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {displayedItems.map((item, index) => (
        <div 
          key={index} 
          className="relative cursor-pointer aspect-square rounded-lg overflow-hidden shadow-lg"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(item.projectUrl)}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 group-hover:bg-transparent transition-colors duration-300">
            <h3 className="text-white text-lg font-bold text-center px-4 py-2 bg-black bg-opacity-50 rounded group-hover:opacity-0 transition-opacity duration-300">
              {item.title}
            </h3>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <video
              key={item.videoUrl}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-110"
              loop
              muted
              playsInline
              autoPlay
              src={item.videoUrl}
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
            <p className="text-white text-sm mb-4 line-clamp-3">{item.text}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {item.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="text-xs bg-blue-500 bg-opacity-75 text-white px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;