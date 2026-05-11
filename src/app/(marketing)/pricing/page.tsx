import { Check, X, ArrowLeft, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary dark:hover:text-accent mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
            Ready to scale your <span className="text-accent italic">Traffic?</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Choose the plan that fits your growth stage. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col p-8 md:p-10 rounded-2xl transition-all duration-300 border backdrop-blur-xl ${
                plan.highlight 
                  ? "bg-primary/10 border-primary/50 shadow-2xl shadow-primary/20 scale-105 z-10" 
                  : "bg-card/50 border-white/5 shadow-sm hover:border-white/20"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 uppercase tracking-wider ${plan.highlight ? "text-accent" : "text-slate-500"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold tracking-tight">${plan.price}</span>
                  <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">/mo</span>
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="flex-grow space-y-4 mb-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">What's included:</p>
                <ul className="space-y-4">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm font-medium">
                      {feature.included ? (
                        <div className={`p-0.5 rounded-full ${plan.highlight ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
                          <Check size={14} />
                        </div>
                      ) : (
                        <div className="p-0.5 rounded-full bg-slate-500/10 text-slate-600">
                           <X size={14} />
                        </div>
                      )}
                      <span className={!feature.included ? "text-slate-600 line-through" : "text-slate-300"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={plan.name === "Agency" ? "/contact" : "/auth/register"} 
                className={`block text-center py-4 rounded-xl font-bold transition-all shadow-lg ${
                  plan.highlight 
                    ? "bg-accent text-primary-foreground hover:bg-accent/90 shadow-accent/20" 
                    : "bg-white/5 text-foreground border border-white/10 hover:bg-white/10 shadow-black/20"
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            All plans include 256-bit SSL encryption and automated daily backups. 
            <br/> Need a custom plan? <Link href="/contact" className="text-accent font-bold hover:underline">Contact our sales team</Link>.
          </p>
        </footer>
      </div>
    </div>
  );
}