import { verifyAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Zap, Search, BarChart3, ShieldCheck, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";

export default async function Home() {
  const isAdmin = await verifyAdminSession();
  if (isAdmin) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center text-center px-6">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-accent/30 rounded-full blur-[120px] animation-delay-2000" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[10px] font-black text-primary dark:text-accent tracking-widest uppercase">
              V2.0 Neural Engine Live
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tightest mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-700">
            Dominate search <br className="hidden md:block" />
            with <span className="text-accent italic">Intelligence.</span>
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-10 duration-1000">
            STRIVE provides the technical blueprint for your organic growth. 
            Professional SEO insights powered by neural logic.
          </p>

          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
             <SearchForm />
             <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-primary" /> Enterprise Grade</span>
                <span className="flex items-center gap-1.5"><Globe size={14} className="text-primary" /> Global Reach</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-primary" /> Real-time Analysis</span>
             </div>
          </div>
        </div>
      </section>

      {/* Superpowers Section */}
      <section className="py-32 bg-background/50 backdrop-blur-sm z-10 relative px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-black text-primary tracking-widest uppercase mb-4">
              Core Platform
            </h2>
            <h3 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tightest">
              Everything you need to <span className="text-accent italic">scale.</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              We've automated the technical complexities of SEO so you can focus on building what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-saas hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Search size={28} className="text-primary" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-4 tracking-tight">Smart Keywords</h4>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Discover high-intent, low-competition keywords tailored to your niche using neural search patterns.
              </p>
            </div>

            <div className="group bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-saas hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Zap size={28} className="text-accent" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-4 tracking-tight">Auto-Optimizer</h4>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Let our AI detect and fix technical bottlenecks automatically before search engines crawl your site.
              </p>
            </div>

            <div className="group bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-saas hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <BarChart3 size={28} className="text-primary" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-4 tracking-tight">Neural Insights</h4>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Clear, architectural reports delivered with precision. No jargon, just actionable intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto bg-primary/10 backdrop-blur-2xl rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-foreground mb-8 tracking-tightest leading-tight">
              Ready to master <br /> your <span className="text-accent italic">Search.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium leading-relaxed">
              Join the next generation of technical SEOs who are growing their digital footprint with STRIVE.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-10 py-5 text-sm font-black text-white bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group uppercase tracking-widest"
              >
                Get Started for Free
                <Zap size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-10 py-5 text-sm font-black text-foreground bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                View Pricing
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            © 2026 STRIVE AI SEO Solutions. Precision Intelligence for the modern web.
         </p>
      </footer>
    </div>
  );
}