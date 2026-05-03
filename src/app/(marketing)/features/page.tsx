import { BarChart3, Zap, Shield, Search, Globe, MousePointerClick, ArrowLeft } from "lucide-react";
import Link from "next/link";

const FEATURE_LIST = [
  { icon: <Zap />, title: "Real-time Audits", desc: "Our AI scans your site in seconds, identifying technical bottlenecks before they impact your ranking." },
  { icon: <Search />, title: "Keyword Intelligence", desc: "Discover high-intent keywords your competitors are missing with neural search gap analysis." },
  { icon: <BarChart3 />, title: "GA4 Integration", desc: "Seamlessly connect your Google Analytics data for a unified view of traffic and SEO health." },
  { icon: <Shield />, title: "Safe Code Fixes", desc: "Get AI-generated React/HTML snippets designed to fix SEO issues safely and efficiently." },
  { icon: <Globe />, title: "Global Rank Tracking", desc: "Track your position across different regions and languages with pinpoint accuracy." },
  { icon: <MousePointerClick />, title: "One-Click Optimization", desc: "Automate meta-tag generation and image alt-text with our neural processing engine." }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:hover:text-accent mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        
        <header className="max-w-4xl mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 leading-[1.1] tracking-tightest">
            Built for speed. <br/><span className="text-accent italic">Designed for growth.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-2xl">
            Everything you need to dominate the search results, powered by the latest in neural intelligence.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURE_LIST.map((f, i) => (
            <div key={i} className="group p-8 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-saas hover:border-primary/50 transition-all">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-foreground mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}