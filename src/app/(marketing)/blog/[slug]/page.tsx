import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

// 1. Mock Data (In a real app, you'd fetch this from Django/Database)
const BLOG_DATABASE: any = {
  "future-of-ai-seo": {
    title: "The Future of AI in Search Engine Optimization",
    date: "April 1, 2026",
    author: "Strive Team",
    category: "AI Insights",
    content: `
      Search Engine Optimization is undergoing its most significant transformation since the invention of the backlink. 
      In 2026, Google's algorithms have shifted from matching keywords to understanding intent through deep neural networks.

      ### The Shift to Semantic Intent
      Gone are the days of stuffing keywords into headers. Modern search engines use Large Language Models (LLMs) to 
      evaluate the "Expertise, Authoritativeness, and Trustworthiness" (E-A-T) of your content in real-time.

      ### What this means for your Strategy:
      - **Focus on Depth:** AI can tell when a page is written for a bot versus a human.
      - **Technical Excellence:** As search engines get smarter, they demand faster load times.
      - **Schema Markup:** Structuring your data is now mandatory for AI visibility.
    `,
  },
  "core-web-vitals-2026": {
    title: "Mastering Core Web Vitals in 2026",
    date: "March 28, 2026",
    author: "SEO Lead",
    category: "Technical",
    content: "Performance is the bedrock of SEO. With the introduction of the Interaction to Next Paint (INP) metric, Google has doubled down on responsiveness as a primary ranking factor...",
  },
  "neural-content-strategy": {
    title: "Mastering Core Web Vitals in 2026",
    date: "March 28, 2026",
    author: "SEO Lead",
    category: "Strategy",
    content: "Performance is the bedrock of SEO. With the introduction of the Interaction to Next Paint (INP) metric, Google has doubled down on responsiveness as a primary ranking factor...",
  },
};

// 2. The Page Component
export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Grab the slug from the URL
  const { slug } = await params;
  const post = BLOG_DATABASE[slug];

  // If the slug doesn't exist in our data, show the 404 page
  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-slate-50/30 py-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#15418c] mb-12 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to all posts
        </Link>

        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#15418c] text-[10px] font-bold uppercase tracking-wider mb-6">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-8">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-slate-100 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar size={12} />
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#15418c] transition-colors">
              <Share2 size={16} /> Share
            </button>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-slate max-w-none 
          prose-headings:text-slate-900 prose-headings:font-bold 
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
          prose-li:text-slate-600 prose-li:text-lg
          whitespace-pre-line">
          {post.content}
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 p-8 md:p-12 bg-[#15418c] rounded-2xl text-center text-white shadow-2xl shadow-blue-900/20">
          <h3 className="text-2xl font-bold mb-4">Ready to boost your rankings?</h3>
          <p className="text-blue-100 mb-8 opacity-80">Let our AI analyze your site for free today.</p>
          <Link 
            href="/" 
            className="inline-block bg-white text-[#15418c] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
          >
            Start Analysis
          </Link>
        </footer>
      </div>
    </article>
  );
}