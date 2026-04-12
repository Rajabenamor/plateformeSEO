import { Mail, MessageSquare, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-slate-100">
        
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#15418c] mb-8 transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-4xl font-extrabold mb-6">Get in touch</h1>
          <p className="text-slate-600 mb-10">Have questions about our AI analysis or enterprise plans? We're here to help.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#15418c]"><Mail size={20} /></div>
              <div><p className="text-xs font-bold uppercase text-slate-400">Email us</p><p className="font-medium">strive.company.support@gmail.com</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#15418c]"><MessageSquare size={20} /></div>
              <div><p className="text-xs font-bold uppercase text-slate-400">Live Chat</p><p className="font-medium">Available Mon-Fri, 9am-5pm</p></div>
            </div>
          </div>
        </div>

        <form className="space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <div>
            <label className="block text-[10px] font-bold uppercase mb-2">Full Name</label>
            <input type="text" className="w-full bg-white border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase mb-2">Work Email</label>
            <input type="email" className="w-full bg-white border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@company.com" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase mb-2">Message</label>
            <textarea rows={4} className="w-full bg-white border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="How can we help?"></textarea>
          </div>
          <button className="w-full bg-[#15418c] text-white font-bold py-4 rounded-xl hover:bg-[#0f306b] transition-colors shadow-lg shadow-blue-900/10">
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
}