'use client'

import React, { useState, useEffect, useMemo } from 'react';

interface GridItem {
  title: string;
  text: string;
  tags: string[];
  videoUrl: string;
}

interface PortfolioGridProps {
  items: GridItem[];
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items }) => {
  const [displayedItems, setDisplayedItems] = useState<GridItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Create a memoized video cache
  const videoCache = useMemo(() => {
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

  const getRandomItems = () => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

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
    const intervalId = setInterval(updateItems, 100000);
    return () => clearInterval(intervalId);
  }, [items, hoveredIndex]);

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

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {displayedItems.map((item, index) => (
        <div 
          key={index} 
          className="relative h-0 pb-[56.25%] overflow-hidden rounded-lg group"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 group-hover:bg-transparent transition-colors duration-300">
            <h3 className="text-white text-lg font-bold text-center px-4 py-2 bg-black bg-opacity-50 rounded group-hover:opacity-0 transition-opacity duration-300">
              {item.title}
            </h3>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <video
              ref={el => {
                if (el) {
                  el.src = videoCache[item.videoUrl].src;
                  el.load();
                }
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto min-h-full object-cover transition-all duration-300 ease-in-out group-hover:w-[120%] group-hover:h-[120%]"
              loop
              muted
              playsInline
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
            <p className="text-white text-sm mb-4">{item.text}</p>
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