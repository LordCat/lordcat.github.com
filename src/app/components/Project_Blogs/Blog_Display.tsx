'use client'

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Linkedin, Share2 } from 'lucide-react';
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
  const [entries] = useState<BlogEntry[]>(blogEntries);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [fullScreenEntry, setFullScreenEntry] = useState<BlogEntry | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fullScreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expandedEntry && entries.length > 0) {
      setExpandedEntry(entries[0].id);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (fullScreenRef.current && !fullScreenRef.current.contains(event.target as Node)) {
        closeFullScreen();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [entries, expandedEntry]);

  const handleExpand = (id: string) => {
    setExpandedEntry(id === expandedEntry ? null : id);
  };

  const openFullScreen = (entry: BlogEntry) => {
    setFullScreenEntry(entry);
  };

  const closeFullScreen = () => {
    setFullScreenEntry(null);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  const getShareUrl = (entry: BlogEntry) => {
    return `${window.location.origin}/blog/${entry.id}`;
  };

  const shareOnLinkedIn = (entry: BlogEntry) => {
    const url = getShareUrl(entry);
    const title = encodeURIComponent(entry.title);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank');
  };

  const shareOnBluesky = (entry: BlogEntry) => {
    const url = getShareUrl(entry);
    const text = encodeURIComponent(`Check out this blog post: ${entry.title}\n\n${url}`);
    window.open(`https://bsky.app/intent/compose?text=${text}`, '_blank');
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className={`flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 snap-start`}
          >
            <div 
              className="h-full rounded-lg cursor-pointer transition-all duration-300 ease-in-out overflow-hidden shadow-lg"
              onClick={() => handleExpand(entry.id)}
              style={{
                backgroundImage: `url(${entry.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className={`h-full w-full p-4 bg-black bg-opacity-50 text-white ${expandedEntry === entry.id ? 'overflow-y-auto' : ''}`}>
                <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
                <p className="text-xs mb-2">{entry.date} - {entry.author}</p>
                {expandedEntry === entry.id ? (
                  <div className="animate-fade-in">
                    <div className="text-sm mb-4 leading-relaxed line-clamp-5">{formatContent(entry.summary)}</div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {entry.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-500 bg-opacity-50 text-white px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openFullScreen(entry);
                      }}
                      className="flex items-center justify-center text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200"
                    >
                      Read Full Article
                    </button>
                  </div>
                ) : (
                  <p className="text-sm line-clamp-3">{entry.summary}</p>
                )}
              </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div 
            ref={fullScreenRef}
            className="bg-white rounded-lg p-8 max-w-4xl max-h-[90vh] overflow-y-auto relative w-full"
          >
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
              width={400}
              height={300}
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <div className="text-black prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
              {formatContent(fullScreenEntry.content)}
            </div>
            <div className="flex flex-wrap gap-2 my-4">
              {fullScreenEntry.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <button 
              onClick={() => shareOnLinkedIn(fullScreenEntry)}
              className="flex items-center text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              <Linkedin size={16} className="mr-2" />
              Share on LinkedIn
            </button>
            <button 
                onClick={() => shareOnBluesky(fullScreenEntry)}
                className="flex items-center text-sm bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded transition-colors duration-200"
              >
                <Share2 size={16} className="mr-2" />
                Bluesky
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSlider;