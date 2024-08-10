'use client'

import React, { useState, useEffect } from 'react';

interface GridItem {
  title: string;
  text: string;
}

interface PortfolioGridProps {
  items: GridItem[];
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items }) => {
  const [displayedItems, setDisplayedItems] = useState<GridItem[]>([]);

  const getRandomItems = () => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    const updateItems = () => {
      setDisplayedItems(getRandomItems());
    };

    // Initial update
    updateItems();

    // Set interval for updates
    const intervalId = setInterval(updateItems, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [items]);

  return (
    <div className="grid grid-cols-3 w-max gap-20">
      {displayedItems.map((item, index) => (
        <div key={index} className="bg-black-100 p-4 rounded-lg">
          <h3 className="text-sm font-bold mb-2">{item.title}</h3>
          <p className="text-xs">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;