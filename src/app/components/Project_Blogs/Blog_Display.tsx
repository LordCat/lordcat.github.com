'use client'

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import blogEntries from '@/app/components/Project_Blogs/blog_items.json'
import Image from 'next/image';

interface BlogEntry {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  tags: string[];
  imageUrl: string;
}

const BlogSlider: React.FC = () => {
  //Get the json items array
  const [entries] = useState<BlogEntry[]>(blogEntries);

  //manage selection state
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  
  //manage full view state
  const [fullScreenEntry, setFullScreenEntry] = useState<BlogEntry | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);



  const handleExpand = (id: string) => {
    setExpandedEntry(id);
  };

  const handleDoubleClick = (entry: BlogEntry) => {
    setFullScreenEntry(entry);
  };

  const closeFullScreen = () => {
    setFullScreenEntry(null);
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
    <div className="relative w-full h-full">
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {entries.map((entry) => (
          <div 
            key={entry.id}
            className={`flex-shrink-0 w-64 m-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out snap-start overflow-hidden ${
              expandedEntry === entry.id ? 'w-100 h-250' : 'h-48'
            }`}
            onClick={() => handleExpand(entry.id)}
            onDoubleClick={() => handleDoubleClick(entry)}
            style={{
              backgroundImage: `url(${entry.imageUrl})`,
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
                <p className="text-sm">{entry.summary}</p>
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
    {fullScreenEntry && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl max-h-[90vh] overflow-y-auto relative">
          <button 
            onClick={closeFullScreen}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-4">{fullScreenEntry.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{fullScreenEntry.date} - {fullScreenEntry.author}</p>
          <Image
            src={fullScreenEntry.imageUrl} 
            alt={fullScreenEntry.title} 
            className="w-full h-64 object-cover mb-4 rounded"
          />
          <p className="text-gray-700 mb-4">{fullScreenEntry.content}</p>
          <div className="flex flex-wrap gap-2">
            {fullScreenEntry.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default BlogSlider;