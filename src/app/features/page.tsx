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
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#15418c] mb-12 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        
        <header className="max-w-3xl mb-20">
          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Built for speed. <br/><span className="text-[#15418c]">Designed for growth.</span></h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">Everything you need to dominate the search results, powered by the latest in neural intelligence.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
          {FEATURE_LIST.map((f, i) => (
            <div key={i} className="group">
              <div className="w-14 h-14 bg-slate-50 text-[#15418c] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#15418c] group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}