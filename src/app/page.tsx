import PortfolioGrid from "@/app/components/Project_Mosaic/Mosaic_Display";
import portfolioData from "@/app/components/Project_Mosaic/portfolio_items.json";
import BlogSlider from "./components/Project_Blogs/Blog_Display";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col w-max h-50 items-center">
      <h1> Kristian Kelly</h1>
      <p> Welcome to my website</p>
      
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <PortfolioGrid items={portfolioData.portfolioItems} />
      <BlogSlider />
      </div>
      </div>
    </main>
  )
}
