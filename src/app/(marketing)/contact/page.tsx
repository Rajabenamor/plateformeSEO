"use client";

import { Mail, MessageSquare, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Grab the data directly from the form
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Format the email subject and body so it looks good in their email app
    const subject = encodeURIComponent(`Enterprise Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    // Trigger the mailto link
    window.location.href = `mailto:strive.company.support@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 bg-card/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-16 shadow-sm">
          <div className="flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary dark:hover:text-accent mb-12 transition-colors group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />{" "}
                Back to Home
              </Link>
              <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
                Get in <span className="text-accent italic">touch.</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 max-w-sm text-lg">
                Have questions about our AI analysis or enterprise plans? We're
                here to help.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email us
                    </p>
                    <p className="font-bold text-foreground text-lg">
                      strive.company.support@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-lg shadow-accent/5">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Live Chat
                    </p>
                    <p className="font-bold text-foreground text-lg">
                      Available Mon-Fri, 9am-5pm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Average response time: 2 hours
              </p>
            </div>
          </div>

          {/* UPDATED FORM: Added onSubmit handler and name attributes */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/5 p-8 md:p-12 rounded-2xl border border-white/5 shadow-inner"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium text-foreground placeholder:text-slate-700"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 ml-1">
                Work Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium text-foreground placeholder:text-slate-700"
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 ml-1">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium text-foreground placeholder:text-slate-700 resize-none"
                placeholder="How can we help?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
            >
              Send Message
              <Zap
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
