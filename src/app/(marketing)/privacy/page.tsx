import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Globe, Lock, Zap } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "April 3, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10 bg-card/50 backdrop-blur-xl border border-white/5 shadow-sm rounded-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-primary/20 p-12 border-b border-white/5">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary dark:hover:text-accent mb-12 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 flex text-white">
               <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight uppercase text-foreground">Privacy Policy</h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Last Revised: {lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16 space-y-16">
          
          {/* Table of Contents */}
          <nav className="bg-white/5 p-8 rounded-2xl border border-white/5 shadow-inner">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-6">Navigation</h2>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm font-bold text-slate-400">
              <li><a href="#intro" className="hover:text-accent transition-colors flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-accent" /> Introduction</a></li>
              <li><a href="#controller" className="hover:text-accent transition-colors flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-accent" /> Data Controller</a></li>
              <li><a href="#collection" className="hover:text-accent transition-colors flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-accent" /> 1. Data We Collect</a></li>
              <li><a href="#usage" className="hover:text-accent transition-colors flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-accent" /> 2. How We Use Data</a></li>
              <li><a href="#rights" className="hover:text-accent transition-colors flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-accent" /> 3. Your Rights</a></li>
              <li><a href="#security" className="hover:text-accent transition-colors flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-accent" /> 4. Security Measures</a></li>
            </ul>
          </nav>

          {/* 1. Introduction & Controller */}
          <section id="intro">
            <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-3">
               <span className="text-accent italic">0.</span> Introduction
            </h2>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
              Welcome to STRIVE. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section id="controller" className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-4">Data Controller</h3>
              <p className="text-sm text-foreground font-bold leading-relaxed">
                STRIVE AI SEO Solutions <br />
                Sousse, Tunisia
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-4">Contact Information</h3>
              <div className="flex items-center gap-2 text-sm text-accent font-bold">
                <Mail size={16} />
                <a href="mailto:strive.support@gmail.com" className="hover:underline">strive.support@gmail.com</a>
              </div>
            </div>
          </section>

          {/* 2. Content Sections */}
          <section id="collection">
            <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-3">
               <span className="text-accent italic">1.</span> Data We Collect
            </h2>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Identity Data:</strong> First name, last name, and username.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Contact Data:</strong> Email address and billing address.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Technical Data:</strong> IP address, browser type, and time zone settings.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Usage Data:</strong> Information about how you use our website and SEO tools.</span>
              </li>
            </ul>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-3">
               <span className="text-accent italic">2.</span> How We Use Data
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">Customer Registration</div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">SEO Audit Delivery</div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">Service Updates</div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">Platform Security</div>
            </div>
          </section>

          <section id="rights">
            <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-3">
               <span className="text-accent italic">3.</span> Your Rights
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[10px] font-bold uppercase tracking-tight text-accent">
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">Request Access</div>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">Request Correction</div>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">Request Erasure</div>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">Object to Processing</div>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">Data Portability</div>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">Withdraw Consent</div>
            </div>
          </section>

          <section id="security" className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
            <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight flex items-center gap-3">
               <Lock size={24} className="text-primary" /> 4. Security Measures
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees and third parties who have a business need to know.
            </p>
          </section>

          <footer className="pt-16 border-t border-white/5 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-accent/20 text-primary mb-6">
               <Zap size={24} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Privacy Concerns?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">If you have any questions about this privacy policy or our privacy practices, please contact our data team.</p>
            <a href="mailto:strive.support@gmail.com" className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 inline-block text-xs uppercase tracking-wider">
              Email Privacy Team
            </a>
          </footer>

        </div>
      </div>
    </div>
  );
}