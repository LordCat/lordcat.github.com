//This Component displayes the entries in portfolio_items.js in
// It displays as 3 views that change entry on random every 10 seconds

'use client'

import React, { useState, useEffect, useRef } from 'react';

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
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.load();
        video.play().catch(error => console.error("Error playing video:", error));
      }
    });
  }, [displayedItems]);

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
          className="relative  pb-[70%] overflow-hidden rounded-lg group"
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
              ref={el => { videoRefs.current[index] = el; }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto min-h-full object-cover transition-all duration-300 ease-in-out group-hover:w-[120%] group-hover:h-[120%]"
              loop
              muted
              playsInline
            >
              <source src={item.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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