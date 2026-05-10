import React from "react";
import { 
  TrendingDown, 
  GitMerge, 
  MousePointerClick, 
  Smartphone, 
  EyeOff 
} from "lucide-react";
import { EnrichedStatistics } from "@/app/types/dashboard";

interface EnrichedStatsGridProps {
  stats?: EnrichedStatistics;
}

export default function EnrichedStatsGrid({ stats }: EnrichedStatsGridProps) {
  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Intelligence Insights</h2>
          <p className="text-sm text-slate-500 font-medium">AI-translated metrics that directly impact your revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Missed Clicks Metric */}
        {stats.missed_clicks && stats.missed_clicks.length > 0 && (
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <MousePointerClick size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">
                  Unclicked Potential
                </span>
              </div>
              <h3 className="text-3xl font-black text-foreground mb-1 tracking-tighter">
                +{stats.missed_clicks[0].potential_traffic_gain}
              </h3>
              <p className="text-sm font-bold text-slate-400 mb-4">Potential extra clicks / mo</p>
              
              <div className="bg-background rounded-xl p-3 border border-border text-xs mb-4">
                <p className="text-slate-500 mb-1">Target Keyword:</p>
                <p className="font-bold text-foreground">"{stats.missed_clicks[0].keyword}"</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              You rank #{stats.missed_clicks[0].current_position} but CTR is only {stats.missed_clicks[0].current_ctr}%. Updating the Meta Title could instantly unlock these clicks.
            </p>
          </div>
        )}

        {/* Mobile Penalty Index */}
        {stats.mobile_penalty && (
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                  Mobile Penalty Risk
                </span>
              </div>
              <h3 className="text-3xl font-black text-foreground mb-1 tracking-tighter">
                -{stats.mobile_penalty.penalty_gap} pts
              </h3>
              <p className="text-sm font-bold text-slate-400 mb-4">Desktop vs Mobile Gap</p>
              
              <div className="bg-background rounded-xl p-3 border border-border text-xs mb-4 space-y-2">
                {stats.mobile_penalty.critical_issues?.map((issue, idx) => (
                   <div key={idx} className="flex items-center gap-2 text-slate-500">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                     <span className="font-medium">{issue}</span>
                   </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {stats.mobile_penalty.penalty_gap > 10 
                ? "Your mobile site is significantly slower than desktop, risking a Google ranking penalty for mobile searchers."
                : stats.mobile_penalty.penalty_gap > 0
                ? "There is a slight performance gap between mobile and desktop. Aim for parity to ensure consistent rankings."
                : "Your mobile performance is perfectly aligned with desktop. You are protected from mobile-specific ranking penalties."}
            </p>
          </div>
        )}

        {/* Traffic Decay Alert */}
        {stats.traffic_decay && stats.traffic_decay.length > 0 && (
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <TrendingDown size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">
                  Fading Content
                </span>
              </div>
              <h3 className="text-3xl font-black text-foreground mb-1 tracking-tighter">
                -{stats.traffic_decay[0].drop_percentage}%
              </h3>
              <p className="text-sm font-bold text-slate-400 mb-4">Traffic drop (30d)</p>
              
              <div className="bg-background rounded-xl p-3 border border-border text-xs mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                <p className="text-slate-500 mb-1">Affected URL:</p>
                <p className="font-bold text-foreground text-[10px]">{stats.traffic_decay[0].url}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {stats.traffic_decay[0].recommended_action}
            </p>
          </div>
        )}

        {/* Cannibalization Warning */}
        {stats.cannibalization && stats.cannibalization.length > 0 && (
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <GitMerge size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 px-2 py-1 rounded-md">
                  Keyword Cannibalization
                </span>
              </div>
              <h3 className="text-xl font-black text-foreground mb-1 tracking-tighter truncate">
                "{stats.cannibalization[0].keyword}"
              </h3>
              <p className="text-sm font-bold text-slate-400 mb-4">Pages fighting each other</p>
              
              <div className="bg-background rounded-xl p-3 border border-border text-xs mb-4 space-y-1">
                {stats.cannibalization[0].competing_urls?.slice(0, 2).map((url, idx) => (
                   <p key={idx} className="font-medium text-slate-500 truncate text-[10px]">{url}</p>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {stats.cannibalization[0].recommended_action}
            </p>
          </div>
        )}

        {/* Competitor Blind Spot */}
        {stats.competitor_blind_spots && stats.competitor_blind_spots.length > 0 && (
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group md:col-span-2 xl:col-span-2">
             <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <EyeOff size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                  Competitor Blind Spot
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-foreground mb-1 tracking-tighter">
                    Missing Topics for "{stats.competitor_blind_spots[0].target_keyword}"
                  </h3>
                  <p className="text-sm font-bold text-slate-400 mb-4">What top 3 competitors cover that you don't</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Our semantic scraper found that pages outranking you heavily feature these specific topics. Consider adding a section or FAQ addressing them to close the content gap.
                  </p>
                </div>
                
                <div className="flex-1 bg-background rounded-2xl p-4 border border-border">
                   <div className="flex flex-wrap gap-2">
                     {stats.competitor_blind_spots[0].missing_topics?.map((topic, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-bold text-foreground shadow-sm">
                           {topic}
                        </span>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}