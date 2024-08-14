// app/blog/[id]/page.tsx


import React from 'react';
import { useParams } from 'next/navigation';
import blogEntries from '@/app/components/Project_Blogs/blog_items.json';
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
    return blogEntries.map((entry) => ({
      id: entry.id,
    }));
  }

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const entry = blogEntries.find(entry => entry.id === id);

  if (!entry) {
    return <div>Blog post not found</div>;
  }

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
      <p className="text-gray-700 mb-4">{entry.content}</p>
      <div className="flex flex-wrap gap-2">
        {entry.tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;