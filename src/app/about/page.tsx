import { Target, Cpu, LineChart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#15418c] mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <section className="text-center mb-20">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-slate-900">
            Democratizing SEO with <span className="text-[#15418c]">Intelligence</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            STRIVE was born out of a simple realization: Professional SEO is too expensive for most creators, and manual auditing is too slow for modern businesses.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-2xl text-[#15418c]">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-xl">The Mission</h3>
            <p className="text-sm text-slate-600">To provide enterprise-grade search insights to every website owner, regardless of their budget.</p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-2xl text-[#15418c]">
              <Cpu size={24} />
            </div>
            <h3 className="font-bold text-xl">The Tech</h3>
            <p className="text-sm text-slate-600">By combining Google's raw data with advanced Neural Models, we identify fixes in seconds that humans miss in hours.</p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-2xl text-[#15418c]">
              <LineChart size={24} />
            </div>
            <h3 className="font-bold text-xl">The Result</h3>
            <p className="text-sm text-slate-600">A smarter, faster, and more transparent way to climb the Search Engine Results Pages (SERPs).</p>
          </div>
        </div>
      </div>
    </div>
  );
}