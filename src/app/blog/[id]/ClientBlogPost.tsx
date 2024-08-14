'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Share2 } from 'lucide-react';

interface BlogEntry {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  imageUrl: string;
  tags: string[];
}

const ClientBlogPost: React.FC<{ entry: BlogEntry }> = ({ entry }) => {
  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  const getShareUrl = () => {
    return `${window.location.origin}/blog/${entry.id}`;
  };

  const shareOnLinkedIn = () => {
    const url = getShareUrl();
    const title = encodeURIComponent(entry.title);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank');
  };

  const shareOnBluesky = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(`Check out this blog post: ${entry.title}\n\n${url}`);
    window.open(`https://bsky.app/intent/compose?text=${text}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{entry.date} - {entry.author}</p>
      <Image
        src={entry.imageUrl}
        alt={entry.title}
        width={800}
        height={400}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <div className="text-white-700 mb-20 prose prose-sm sm:prose lg:prose xl:prose max-w-200">
        {formatContent(entry.content)}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {entry.tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex space-x-2 mt-4">
        <button 
          onClick={shareOnLinkedIn}
          className="flex items-center text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          <Linkedin size={16} className="mr-2" />
          Share on LinkedIn
        </button>
        <button 
          onClick={shareOnBluesky}
          className="flex items-center text-sm bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          <Share2 size={16} className="mr-2" />
          Share on Bluesky
        </button>
      </div>
    </div>
  );
};

export default ClientBlogPost;