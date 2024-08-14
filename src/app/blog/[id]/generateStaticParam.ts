import blogEntries from '@/app/components/Project_Blogs/blog_items.json';

export async function generateStaticParams() {
  return blogEntries.map((entry) => ({
    id: entry.id,
  }));
}