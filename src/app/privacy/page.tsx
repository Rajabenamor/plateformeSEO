import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Globe, Lock } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "April 3, 2026";

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 rounded-[2.5rem] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#15418c] p-12 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck size={40} className="text-cyan-400" />
            <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-blue-100 opacity-80">Last Revised: {lastUpdated}</p>
        </div>

        <div className="p-8 md:p-16 space-y-12">
          
          {/* Table of Contents */}
          <nav className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Table of Contents</h2>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm font-medium text-[#15418c]">
              <li><a href="#intro" className="hover:underline">Introduction</a></li>
              <li><a href="#controller" className="hover:underline">Data Controller</a></li>
              <li><a href="#definitions" className="hover:underline">1. Important Definitions</a></li>
              <li><a href="#collection" className="hover:underline">2. Data We Collect</a></li>
              <li><a href="#usage" className="hover:underline">3. How We Use Data</a></li>
              <li><a href="#cookies" className="hover:underline">4. Cookies</a></li>
              <li><a href="#rights" className="hover:underline">5. Your Rights</a></li>
              <li><a href="#third-party" className="hover:underline">6. Third Party Services</a></li>
              <li><a href="#transfers" className="hover:underline">7. International Data Transfers</a></li>
              <li><a href="#security" className="hover:underline">8. Security Measures</a></li>
              <li><a href="#changes" className="hover:underline">9. Changes to Policy</a></li>
            </ul>
          </nav>

          {/* 1. Introduction & Controller */}
          <section id="intro">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="leading-relaxed text-slate-600">
              Welcome to STRIVE. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section id="controller" className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Controller</h3>
              <p className="text-sm text-slate-600">
                STRIVE AI SEO Solutions <br />
                Sousse, Tunisia <br />
                {/* Registration No: [Your Business ID] */}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Contact Information</h3>
              <div className="flex items-center gap-2 text-sm text-[#15418c]">
                <Mail size={16} />
                <a href="mailto:strive.company.support@gmail.com" className="hover:underline">strive.company.support@gmail.com</a>
              </div>
            </div>
          </section>

          {/* 2. Content Sections */}
          <section id="definitions">
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Important Definitions</h2>
            <p className="text-slate-600 text-sm italic">
              "Personal Data" means any information relating to an identified or identifiable natural person. "Processing" means any operation performed on personal data.
            </p>
          </section>

          <section id="collection">
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-3 text-slate-600">
              <li><strong>Identity Data:</strong> First name, last name, and username.</li>
              <li><strong>Contact Data:</strong> Email address and billing address.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and time zone settings.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and SEO tools.</li>
            </ul>
          </section>

          <section id="usage">
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. How We Use Data</h2>
            <p className="text-slate-600 mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
              <li>To register you as a new customer.</li>
              <li>To provide SEO audits and AI recommendations.</li>
              <li>To manage our relationship with you (e.g., notifying you about changes).</li>
            </ul>
          </section>

          <section id="cookies" className="bg-blue-50/50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Cookies</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We use "cookies" to enhance your experience. You can set your browser to refuse all or some browser cookies, but note that some parts of this website may become inaccessible or not function properly.
            </p>
          </section>

          <section id="rights">
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
            <p className="text-slate-600 mb-4 font-medium">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold uppercase tracking-tight text-[#15418c]">
              <div className="p-3 bg-slate-50 rounded-lg text-center">Request Access</div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">Request Correction</div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">Request Erasure</div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">Object to Processing</div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">Data Portability</div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">Withdraw Consent</div>
            </div>
          </section>

          <section id="third-party">
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Third Party Services</h2>
            <p className="text-slate-600">
              We share data with third-party processors to provide our service, specifically: <strong>Google Cloud (PageSpeed Insights)</strong>, <strong>OpenAI/Google Gemini (AI Analysis)</strong>, and <strong>Stripe (Payment Processing)</strong>.
            </p>
          </section>

          <section id="transfers">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Globe size={20} className="text-[#15418c]" /> 7. International Data Transfers</h2>
            <p className="text-slate-600">
              As we use global cloud providers (AWS/Vercel), your data may be transferred to and stored on servers located outside of your country of residence. We ensure all such transfers are protected by standard contractual clauses approved by relevant data protection authorities.
            </p>
          </section>

          <section id="security">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Lock size={20} className="text-[#15418c]" /> 8. Security Measures</h2>
            <p className="text-slate-600">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees and third parties who have a business need to know.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-slate-600">
              We keep our privacy policy under regular review. Any changes we may make to our privacy policy in the future will be posted on this page and, where appropriate, notified to you by email.
            </p>
          </section>

          <footer className="pt-10 border-t border-slate-100 text-center">
            <h2 className="text-xl font-black text-[#15418c] mb-4">Privacy Concerns?</h2>
            <p className="text-slate-500 text-sm mb-6">If you have any questions about this privacy policy or our privacy practices, please contact our data team.</p>
            <a href="mailto:strive.company.support@gmail.com" className="bg-[#15418c] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0f306b] transition-all inline-block">
              Email Privacy Team
            </a>
          </footer>

        </div>
      </div>
    </div>
  );
}