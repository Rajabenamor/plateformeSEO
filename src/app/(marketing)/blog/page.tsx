import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight, Zap } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "future-of-ai-seo",
    title: "The Future of AI in Search Engine Optimization",
    excerpt: "How neural networks are changing the way Google understands content and what it means for your strategy.",
    date: "April 1, 2026",
    readTime: "5 min",
    category: "AI Insights",
    imageColor: "bg-primary"
  },
  {
    slug: "core-web-vitals-2026",
    title: "Mastering Core Web Vitals in 2026",
    excerpt: "Speed is no longer optional. Learn how to optimize your LCP and INP scores using automated AI tools.",
    date: "March 28, 2026",
    readTime: "8 min",
    category: "Technical SEO",
    imageColor: "bg-accent"
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
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:hover:text-accent mb-12 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <header className="mb-20 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest text-foreground mb-6 leading-[1.1]">The Strive <span className="text-accent italic">Blog.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            Expert technical advice on SEO, AI intelligence, and scaling your organic growth.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className={`h-64 ${post.imageColor} rounded-3xl mb-8 transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1 shadow-2xl shadow-black/20 flex items-center justify-center relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                 <span className="text-white/20 font-black text-6xl uppercase tracking-tighter italic relative z-10">{post.category.split(' ')[0]}</span>
                 <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap size={20} className="text-white" />
                 </div>
              </div>
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-accent">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className="flex items-center gap-1 text-slate-500"><Clock size={12}/> {post.readTime}</span>
                </div>
                <h2 className="text-2xl font-black text-foreground group-hover:text-accent transition-colors leading-tight tracking-tight">
                  {post.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-1 text-primary dark:text-accent font-black text-xs pt-2 uppercase tracking-widest group-hover:gap-2 transition-all">
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