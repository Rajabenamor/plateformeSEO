import { Calendar, CheckCircle2, CircleDashed, Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";

const ROADMAP_ITEMS = [
  { status: "done", q: "Q1 2026", title: "Neural Engine V2", desc: "Upgraded our underlying LLM for 40% more accurate technical SEO fixes." },
  { status: "now", q: "Q2 2026", title: "Automated Internal Linking", desc: "AI that suggests perfect internal link structures based on topical authority." },
  { status: "next", q: "Q3 2026", title: "Backlink Health Monitor", desc: "Detect and disavow toxic backlinks automatically using real-time spam detection." },
  { status: "future", q: "Q4 2026", title: "Global Team Collaboration", desc: "Multi-user workspaces and white-labeling for digital agencies." }
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#15418c] mb-12 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        
        <header className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4">The Strive Roadmap</h1>
          <p className="text-slate-500 text-lg font-medium">Transparent development. Building the future of SEO together.</p>
        </header>

        <div className="space-y-12">
          {ROADMAP_ITEMS.map((item, i) => (
            <div key={i} className="flex gap-6 md:gap-10">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === 'done' ? 'bg-green-100 text-green-600' : 
                  item.status === 'now' ? 'bg-blue-100 text-blue-600 animate-pulse' : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  {item.status === 'done' ? <CheckCircle2 size={18}/> : <CircleDashed size={18}/>}
                </div>
                <div className="w-px h-full bg-slate-100 mt-2"></div>
              </div>
              <div className="pb-12">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">{item.q}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xl">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}