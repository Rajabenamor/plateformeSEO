import { Target, Cpu, LineChart, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:hover:text-accent mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <section className="text-center mb-24">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-8 shadow-lg shadow-primary/5">
            <Zap size={28} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-8 text-foreground leading-[1.1]">
            Democratizing SEO with <br /><span className="text-accent italic">Intelligence.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            STRIVE was born out of a simple realization: Professional SEO is too expensive for most creators, and manual auditing is too slow for modern businesses.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-saas hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-2xl text-primary mb-6 group-hover:scale-110 transition-transform">
              <Target size={24} />
            </div>
            <h3 className="font-black text-xl mb-4 tracking-tight">The Mission</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">To provide enterprise-grade search insights to every website owner, regardless of their budget.</p>
          </div>

          <div className="p-8 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-saas hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-2xl text-primary mb-6 group-hover:scale-110 transition-transform">
              <Cpu size={24} />
            </div>
            <h3 className="font-black text-xl mb-4 tracking-tight">The Tech</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">By combining Google's raw data with advanced Neural Models, we identify fixes in seconds that humans miss in hours.</p>
          </div>

          <div className="p-8 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-saas hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-2xl text-primary mb-6 group-hover:scale-110 transition-transform">
              <LineChart size={24} />
            </div>
            <h3 className="font-black text-xl mb-4 tracking-tight">The Result</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">A smarter, faster, and more transparent way to climb the Search Engine Results Pages (SERPs).</p>
          </div>
        </div>
      </div>
    </div>
  );
}