import React from 'react';
import blogEntries from '@/app/components/Project_Blogs/blog_items.json';
import ClientBlogPost from './ClientBlogPost';

export async function generateStaticParams() {
  return blogEntries.map((entry) => ({
    id: entry.id,
  }));
}

const BlogPost = ({ params }: { params: { id: string } }) => {
  const entry = blogEntries.find(entry => entry.id === params.id);

  if (!entry) {
    return <div>Blog post not found</div>;
  }

  return <ClientBlogPost entry={entry} />;
};

export default BlogPost;