'use client'

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import blogEntries from '@/app/components/Project_Blogs/blog_items.json'

interface BlogEntry {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  tags: string[];
  imageUrl?: string;
}

const BlogSlider: React.FC = () => {
  const [entries, setEntries] = useState<BlogEntry[]>(blogEntries);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleExpand = (id: string) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className={`flex-shrink-0 w-64 m-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out snap-start overflow-hidden ${
              expandedEntry === entry.id ? 'w-96 h-auto' : 'h-48'
            }`}
            onClick={() => handleExpand(entry.id)}
            style={{
              backgroundImage: entry.imageUrl ? `url(${entry.imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="h-full w-full p-4 bg-black bg-opacity-50 text-white">
              <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
              <p className="text-xs mb-2">{entry.date} - {entry.author}</p>
              {expandedEntry === entry.id ? (
                <div>
                  <div className="text-sm mb-2 overflow-y-auto max-h-60">{entry.content}</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-500 bg-opacity-50 text-white px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm truncate">{entry.summary}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 shadow-md transition-all duration-200"
      >
        <ChevronLeft size={24} className="text-black" />
      </button>
      <button 
        onClick={() => scroll('right')} 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 shadow-md transition-all duration-200"
      >
        <ChevronRight size={24} className="text-black" />
      </button>
    </div>
  );
};

export default BlogSlider;