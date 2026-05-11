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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Intelligence Insights</h2>
          <p className="text-sm text-muted-foreground font-medium">Strategic metrics translated into actionable growth opportunities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Missed Clicks Metric */}
        {stats.missed_clicks && stats.missed_clicks.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MousePointerClick size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                  Traffic Potential
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tighter">
                +{stats.missed_clicks[0].potential_traffic_gain}
              </h3>
              <p className="text-sm font-semibold text-muted-foreground mb-4">Estimated extra clicks / mo</p>
              
              <div className="bg-muted/30 rounded-xl p-3 border border-border text-xs mb-4">
                <p className="text-muted-foreground mb-1">Target Keyword:</p>
                <p className="font-bold text-foreground">"{stats.missed_clicks[0].keyword}"</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Ranking #{stats.missed_clicks[0].current_position} with {stats.missed_clicks[0].current_ctr}% CTR. Optimizing your meta title could capture this missing traffic.
            </p>
          </div>
        )}

        {/* Mobile Penalty Index */}
        {stats.mobile_penalty && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                  Mobile Experience
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tighter">
                {stats.mobile_penalty.penalty_gap !== undefined ? `-${stats.mobile_penalty.penalty_gap}` : "--"} <span className="text-lg">pts</span>
              </h3>
              <p className="text-sm font-semibold text-muted-foreground mb-4">Desktop vs Mobile Gap</p>
              
              <div className="bg-muted/30 rounded-xl p-3 border border-border text-xs mb-4 space-y-2">
                {stats.mobile_penalty.critical_issues && stats.mobile_penalty.critical_issues.length > 0 ? (
                  stats.mobile_penalty.critical_issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="font-medium">{issue}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-medium">No critical mobile issues detected.</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {stats.mobile_penalty.penalty_gap !== undefined && stats.mobile_penalty.penalty_gap > 10 
                ? "Mobile performance is significantly lagging. This discrepancy often leads to ranking penalties in mobile search."
                : "Your mobile experience is well-aligned with desktop performance, ensuring consistent ranking across all devices."}
            </p>
          </div>
        )}

        {/* Traffic Decay Alert */}
        {stats.traffic_decay && stats.traffic_decay.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <TrendingDown size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">
                  Performance Alert
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tighter">
                -{stats.traffic_decay[0].drop_percentage}%
              </h3>
              <p className="text-sm font-semibold text-muted-foreground mb-4">Traffic variance (30d)</p>
              
              <div className="bg-muted/30 rounded-xl p-3 border border-border text-xs mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                <p className="text-muted-foreground mb-1">Impacted Resource:</p>
                <p className="font-bold text-foreground text-[10px]">{stats.traffic_decay[0].url}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {stats.traffic_decay[0].recommended_action}
            </p>
          </div>
        )}

        {/* Cannibalization Warning */}
        {stats.cannibalization && stats.cannibalization.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <GitMerge size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-1 rounded-md">
                  Content Overlap
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1 tracking-tighter truncate">
                "{stats.cannibalization[0].keyword}"
              </h3>
              <p className="text-sm font-semibold text-muted-foreground mb-4">Competing internal pages</p>
              
              <div className="bg-muted/30 rounded-xl p-3 border border-border text-xs mb-4 space-y-1">
                {stats.cannibalization[0].competing_urls?.slice(0, 2).map((url, idx) => (
                   <p key={idx} className="font-medium text-muted-foreground truncate text-[10px]">{url}</p>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {stats.cannibalization[0].recommended_action}
            </p>
          </div>
        )}

        {/* Competitor Blind Spot */}
        {stats.competitor_blind_spots && stats.competitor_blind_spots.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group md:col-span-2 xl:col-span-2">
             <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <EyeOff size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                  Competitive Gap
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1 tracking-tighter">
                    Opportunities for "{stats.competitor_blind_spots[0].target_keyword}"
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground mb-4">Topic gaps identified against top competitors</p>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Analysis shows that top-ranking pages feature these specific topics which are currently missing from your content. Addressing these gaps could improve topical authority.
                  </p>
                </div>
                
                <div className="flex-1 bg-muted/30 rounded-2xl p-4 border border-border">
                   <div className="flex flex-wrap gap-2">
                     {stats.competitor_blind_spots[0].missing_topics?.map((topic, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-bold text-foreground shadow-sm">
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