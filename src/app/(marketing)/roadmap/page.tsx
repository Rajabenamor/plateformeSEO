import { Calendar, CheckCircle2, CircleDashed, Rocket, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

const ROADMAP_ITEMS = [
  { status: "done", q: "Q1 2026", title: "Neural Engine V2", desc: "Upgraded our underlying LLM for 40% more accurate technical SEO fixes." },
  { status: "now", q: "Q2 2026", title: "Automated Internal Linking", desc: "AI that suggests perfect internal link structures based on topical authority." },
  { status: "next", q: "Q3 2026", title: "Backlink Health Monitor", desc: "Detect and disavow toxic backlinks automatically using real-time spam detection." },
  { status: "future", q: "Q4 2026", title: "Global Team Collaboration", desc: "Multi-user workspaces and white-labeling for digital agencies." }
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:hover:text-accent mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        
        <header className="mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-[1.1] tracking-tightest">The Strive <span className="text-accent italic">Roadmap.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Transparent development. Building the future of SEO together.
          </p>
        </header>

        <div className="space-y-4">
          {ROADMAP_ITEMS.map((item, i) => (
            <div key={i} className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 ${
                  item.status === 'done' ? 'bg-green-500/10 text-green-500' : 
                  item.status === 'now' ? 'bg-primary/20 text-primary animate-pulse' : 
                  'bg-white/5 text-slate-600 border border-white/5'
                }`}>
                  {item.status === 'done' ? <CheckCircle2 size={20}/> : <CircleDashed size={20}/>}
                </div>
                {i < ROADMAP_ITEMS.length - 1 && <div className="w-px h-full bg-white/5 mt-4 group-hover:bg-primary/20 transition-colors"></div>}
              </div>
              <div className="pb-16 pt-1">
                <span className={`text-[10px] font-black uppercase tracking-widest mb-3 block ${
                    item.status === 'now' ? 'text-accent' : 'text-slate-600'
                }`}>{item.q}</span>
                <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 pt-16 border-t border-white/5 text-center">
           <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-accent/20 text-primary mb-6">
              <Zap size={24} />
           </div>
           <h2 className="text-2xl font-black text-foreground mb-4 tracking-tight">Have a feature request?</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">We build for our users. Join the conversation on our roadmap.</p>
           <Link href="/contact" className="bg-primary text-white px-10 py-4 rounded-xl font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 inline-block text-xs uppercase tracking-widest">
              Contact Product Team
           </Link>
        </footer>
      </div>
    </div>
  );
}