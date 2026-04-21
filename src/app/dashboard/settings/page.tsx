// @/app/dashboard/settings/page.tsx
"use client";

// import Link from "next/link";
// import { User, Shield, Link2, Clock, ChevronRight } from "lucide-react";

// // Data array to keep the component clean and map through the cards
// const SETTINGS_CARDS = [
//   {
//     name: "Profile",
//     description: "Manage your personal information, username, and email address.",
//     href: "/dashboard/settings/profile",
//     icon: User,
//     color: "bg-blue-50 text-[#15418c]",
//   },
//   {
//     name: "Security",
//     description: "Update your password and secure your account credentials.",
//     href: "/dashboard/settings/security",
//     icon: Shield,
//     color: "bg-emerald-50 text-emerald-600",
//   },
//   {
//     name: "Integrations",
//     description: "Connect GitHub and GA4 for AI-powered SEO code fixes.",
//     href: "/dashboard/settings/integrations",
//     icon: Link2,
//     color: "bg-purple-50 text-purple-600",
//   },
//   {
//     name: "SEO History",
//     description: "Review your past URL analyses and deep AI recommendations.",
//     href: "/dashboard/settings/history",
//     icon: Clock,
//     color: "bg-orange-50 text-orange-600",
//   },
// ];

// export default function SettingsOverviewPage() {
//   return (
//     <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
//       {/* Header Section */}
//       <div>
//         <h2 className="text-2xl font-bold text-slate-900 mb-2">Settings Overview</h2>
//         <p className="text-base text-slate-500">
//           Manage your Strive account, security preferences, and third-party integrations.
//         </p>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {SETTINGS_CARDS.map((card) => {
//           const Icon = card.icon;
          
//           return (
//             <Link
//               key={card.name}
//               href={card.href}
//               className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#15418c]/30 hover:shadow-lg hover:shadow-[#15418c]/5 transition-all duration-300"
//             >
//               <div className="flex items-center justify-between mb-5">
//                 <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${card.color}`}>
//                   <Icon size={24} strokeWidth={2} />
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#15418c]/10 transition-colors">
//                   <ChevronRight 
//                     size={18} 
//                     className="text-slate-400 group-hover:text-[#15418c] group-hover:translate-x-0.5 transition-all" 
//                   />
//                 </div>
//               </div>
              
//               <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#15418c] transition-colors">
//                 {card.name}
//               </h3>
//               <p className="text-sm text-slate-500 leading-relaxed">
//                 {card.description}
//               </p>
//             </Link>
//           );
//         })}
//       </div>

//     </div>
//   );
// }
import { redirect } from "next/navigation";

export default function SettingsIndexPage() {
  // Bypasses the redundant overview and puts them right to work
  redirect("/dashboard/settings/profile");
}