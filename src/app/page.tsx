
import { verifyAdminSession } from "@/lib/session";
import { analyzeUrlAction } from "./actions/dashboard";
import { redirect } from "next/navigation";
import {  Globe, Zap } from "lucide-react";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";

export default async function Home() {
  const isAdmin = await verifyAdminSession();
  if (isAdmin) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300 font-sans overflow-hidden">
      <section className="relative pt-20 pb-24 lg:pt-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-125 opacity-40 dark:opacity-20 pointer-events-none">
          <div className="absolute top-2 -left-100 w-97 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />

          <div className="absolute top-8 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-10 -right-25 w-100 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute top-8 -left-25 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />

          <div className="absolute top-10 right-10 w-100 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute top-70 -right-120 w-98 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute top-70  w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-70 -right-20  w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />

          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
              V2.0 Neural Update Live
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 leading-tight transition-colors">
            Dominate Search <br className="hidden md:block" />
            with{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400">
              AI Intelligence
            </span>
          </h1>
          <p className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-colors">
            Strive for the top : Professional SEO insights to outrank the
            competition.
          </p>
          <SearchForm />
        </div>
        <p className="text-[10px] text-foreground/50">Partially Free</p>
      </section>
      <section className="py-20 bg-background  z-10 relative px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
            Our Superpowers
          </h2>
          <h3 className="text-3xl md:text-4xl font font-bold text-primary mb-4">
            Everything you need to grow
          </h3>
          <p className="text-foreground/70 text-sm max-w-xl mx-auto">
            We've automated the boring parts of SEO so you can focus on creating
            what you love.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4">
          <div className="bg-card rounded-3xl p-8 border border-border-card shadow-md shadow-primary/40 hover:shadow-xl transition-all">
            <div className="w-10 h-10 rounded-md bg-border-card/10 flex items-center justify-center mb-6">
              <svg
                width="19"
                height="25"
                viewBox="0 0 19 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 25C8.6875 25 8.09896 24.7552 7.60938 24.2656C7.11979 23.776 6.875 23.1875 6.875 22.5H11.875C11.875 23.1875 11.6302 23.776 11.1406 24.2656C10.651 24.7552 10.0625 25 9.375 25ZM4.375 21.25V18.75H14.375V21.25H4.375ZM4.6875 17.5C3.25 16.6458 2.10938 15.5 1.26562 14.0625C0.421875 12.625 0 11.0625 0 9.375C0 6.77083 0.911458 4.55729 2.73438 2.73438C4.55729 0.911458 6.77083 0 9.375 0C11.9792 0 14.1927 0.911458 16.0156 2.73438C17.8385 4.55729 18.75 6.77083 18.75 9.375C18.75 11.0625 18.3281 12.625 17.4844 14.0625C16.6406 15.5 15.5 16.6458 14.0625 17.5H4.6875ZM5.4375 15H13.3125C14.25 14.3333 14.974 13.5104 15.4844 12.5312C15.9948 11.5521 16.25 10.5 16.25 9.375C16.25 7.45833 15.5833 5.83333 14.25 4.5C12.9167 3.16667 11.2917 2.5 9.375 2.5C7.45833 2.5 5.83333 3.16667 4.5 4.5C3.16667 5.83333 2.5 7.45833 2.5 9.375C2.5 10.5 2.75521 11.5521 3.26562 12.5312C3.77604 13.5104 4.5 14.3333 5.4375 15Z"
                  fill="#0D6CF2"
                />
              </svg>
            </div>
            <div className="text-lg font-bold text-foreground mb-3">
              Smart Keywords
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Discover low-competition, high-impact keywords tailored to your
              niche in seconds.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 border border-border-card shadow-md shadow-primary/40 hover:shadow-xl transition-all">
            <div className="w-10 h-10 rounded-md bg-border-card/10 flex items-center justify-center mb-6">
              <svg
                width="25"
                height="23"
                viewBox="0 0 25 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 13.9688L11.25 11.25L13.9688 10L11.25 8.75L10 6.03125L8.75 8.75L6.03125 10L8.75 11.25L10 13.9688ZM10 20L6.875 13.125L0 10L6.875 6.875L10 0L13.125 6.875L20 10L13.125 13.125L10 20ZM20 22.5L18.4375 19.0625L15 17.5L18.4375 15.9375L20 12.5L21.5625 15.9375L25 17.5L21.5625 19.0625L20 22.5Z"
                  fill="#16A34A"
                />
              </svg>
            </div>
            <div className="text-lg font-bold text-foreground mb-3">
              Auto-Optimizer
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Let our AI detect and fix technical issues automatically before
              search engines find them.
            </p>
          </div>
          <div className="bg-card rounded-3xl p-8 border border-border-card shadow-md shadow-primary/40 hover:shadow-xl transition-all">
            <div className="w-10 h-10 rounded-md bg-border-card/10 flex items-center justify-center mb-6">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 20V11.25H20V20H15ZM7.5 20V0H12.5V20H7.5ZM0 20V6.25H5V20H0Z"
                  fill="#EA580C"
                />
              </svg>
            </div>
            <div className="text-lg font-bold text-foreground mb-3">
              Weekly Insights
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Clear, jargon-free reports delivered to your inbox every Monday
              morning.
            </p>
          </div>
        </div>
      </section>
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-card  rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden border border-border-card">
          <div className="absolute top-10 right-0 w-64 h-64 bg-blue-200/50 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -top-4 -right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />

          <div className="absolute top-10 right-120 w-64 h-64 bg-blue-200/50 rounded-full mix-blend-multiply filter blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-6 tracking-tight">
              Ready to master your SEO?
            </h2>
            <p className="text-foreground/60 text-sm md:text-base max-w-md mx-auto mb-10">
              Join thousands of creators who are growing their business with
              STRIVE
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#15418c] rounded-full hover:bg-[#0f306b] transition-colors shadow-2xl shadow-primary/40"
              >
                Get Started for Free
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto px-10 py-3.5 text-md font-semibold text-[#15418c] bg-white border border-transparent rounded-full hover:border-[#15418c]/20 hover:bg-gray-50 transition-all shadow-2xl shadow-primary/40"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
