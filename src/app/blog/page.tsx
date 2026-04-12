import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "future-of-ai-seo",
    title: "The Future of AI in Search Engine Optimization",
    excerpt: "How neural networks are changing the way Google understands content and what it means for your strategy.",
    date: "April 1, 2026",
    readTime: "5 min",
    category: "AI Insights",
    imageColor: "bg-blue-600"
  },
  {
    slug: "core-web-vitals-2026",
    title: "Mastering Core Web Vitals in 2026",
    excerpt: "Speed is no longer optional. Learn how to optimize your LCP and INP scores using automated AI tools.",
    date: "March 28, 2026",
    readTime: "8 min",
    category: "Technical SEO",
    imageColor: "bg-cyan-500"
  },
  {
    slug: "neural-content-strategy",
    title: "How to Outrank Competitors with Neural Content",
    excerpt: "Moving beyond keywords: using semantic intelligence to create content that humans and bots love.",
    date: "March 15, 2026",
    readTime: "6 min",
    category: "Strategy",
    imageColor: "bg-indigo-600"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#15418c] mb-12 transition-all">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4">The Strive Blog</h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">Expert technical advice on SEO, AI intelligence, and scaling your organic growth.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className={`h-64 ${post.imageColor} rounded-[2rem] mb-6 transition-transform duration-500 group-hover:scale-[1.02] shadow-xl shadow-blue-900/10 flex items-center justify-center`}>
                 <span className="text-white/20 font-black text-6xl uppercase tracking-tighter italic">{post.category.split(' ')[0]}</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#15418c]">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1 text-slate-400"><Clock size={12}/> {post.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-[#15418c] transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-1 text-[#15418c] font-bold text-xs pt-2">
                  Read Article <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}