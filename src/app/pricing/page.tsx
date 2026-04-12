import { Check, X, ArrowLeft, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for testing the waters.",
    features: [
      { text: "5 Site Audits per month", included: true },
      { text: "Basic AI SEO fixes", included: true },
      { text: "Standard PageSpeed insights", included: true },
      { text: "GA4 Integration", included: false },
      { text: "Priority Support", included: false },
      { text: "White-label reports", included: false },
    ],
    buttonText: "Start for Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "49",
    description: "For serious creators and small teams.",
    features: [
      { text: "Unlimited Site Audits", included: true },
      { text: "Advanced AI Neural fixes", included: true },
      { text: "Full GA4 Analytics Sync", included: true },
      { text: "Keyword Gap Analysis", included: true },
      { text: "Priority Email Support", included: true },
      { text: "White-label reports", included: false },
    ],
    buttonText: "Start 14-Day Trial",
    highlight: true,
  },
  {
    name: "Agency",
    price: "199",
    description: "The ultimate tool for SEO professionals.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "White-label Reporting", included: true },
      { text: "Custom API Access", included: true },
      { text: "50 Project Seats", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Custom Contract & Billing", included: true },
    ],
    buttonText: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#15418c] mb-8 transition-colors">
          <ArrowLeft size={16} /> BACK TO DASHBOARD
        </Link>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Ready to scale your <span className="text-[#15418c]">Traffic?</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Choose the plan that fits your growth stage. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col p-8 md:p-10 rounded-[2.5rem] transition-all duration-300 ${
              plan.highlight 
                ? "bg-[#15418c] text-white shadow-2xl shadow-blue-900/30 scale-105 z-10 border-none" 
                : "bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md"
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 text-blue-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                Recommended
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-cyan-300" : "text-[#15418c]"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-black">${plan.price}</span>
                <span className={`text-sm ${plan.highlight ? "opacity-60" : "text-slate-400"}`}>/mo</span>
              </div>
              <p className={`text-sm leading-relaxed ${plan.highlight ? "opacity-80" : "text-slate-500"}`}>
                {plan.description}
              </p>
            </div>

            <div className="flex-grow space-y-4 mb-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">What's included:</p>
              <ul className="space-y-4">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-sm font-medium">
                    {feature.included ? (
                      <Check size={18} className={plan.highlight ? "text-cyan-400" : "text-[#15418c]"} />
                    ) : (
                      <X size={18} className="text-slate-300" />
                    )}
                    <span className={!feature.included ? "text-slate-300 line-through" : ""}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href={plan.name === "Agency" ? "/contact" : "/auth/register"} 
              className={`block text-center py-4 rounded-2xl font-black transition-all ${
                plan.highlight 
                  ? "bg-white text-[#15418c] hover:bg-blue-50 shadow-lg shadow-blue-900/20" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>

      <footer className="mt-20 text-center">
        <p className="text-sm text-slate-400">
          All plans include 256-bit SSL encryption and automated daily backups. 
          <br/> Need a custom plan? <Link href="/contact" className="text-[#15418c] font-bold hover:underline">Contact our sales team</Link>.
        </p>
      </footer>
    </div>
  );
}