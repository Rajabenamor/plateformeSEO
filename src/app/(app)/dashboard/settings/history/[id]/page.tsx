// app/dashboard/settings/history/[id]/page.tsx
import { secureFetch } from "@/lib/api";
import Link from "next/link";
import { 
  ChevronLeft, 
  ShieldAlert, 
  Lightbulb, 
  Globe, 
  Activity, 
  Calendar,
  ExternalLink
} from "lucide-react";

interface ReportData {
  id: number;
  url_analyzed: string;
  status: string;
  seo_score: number | null;
  recommendations_summary: {
    critical_fixes?: string[];
    suggestions?: string[];
  };
  created_at: string;
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/history/${id}/`, {
    cache: 'no-store'
  });
  
  if (response.status === 404) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center p-8 bg-card border border-border rounded-2xl shadow-sm max-w-sm">
        <ShieldAlert className="mx-auto mb-4 text-red-500" size={40} />
        <h1 className="text-xl font-bold text-foreground">Archive Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested analysis report does not exist or has been purged.</p>
        <Link href="/dashboard/settings/history" className="mt-6 inline-block text-primary font-bold text-sm hover:underline">
          Return to Archives
        </Link>
      </div>
    </div>
  );

  if (!response.ok) return <div className="p-8 text-center text-red-500 font-mono">CRITICAL_SYSTEM_ERROR: Failed to establish secure connection to data node.</div>;

  const report: ReportData = await response.json();
  const { critical_fixes, suggestions } = report.recommendations_summary;
  const dateStr = new Date(report.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
        <Link href="/dashboard/settings/history" className="flex items-center gap-1 hover:text-primary transition-colors">
          <ChevronLeft size={14} /> History
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Report #{report.id}</span>
      </nav>

      {/* HEADER */}
      <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Activity size={12} /> Audit Complete
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight leading-tight max-w-2xl">
              SEO Audit for <span className="text-primary truncate block md:inline">{report.url_analyzed.replace('https://', '')}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary/60" />
                {dateStr}
              </div>
              <a
                href={report.url_analyzed}
                target="_blank"
                className="flex items-center gap-2 text-primary hover:underline transition-all"
              >
                <Globe size={16} /> Live URL <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center md:items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">SEO Score</span>
            <div className="relative">
                <div className={`text-5xl md:text-6xl font-bold tracking-tighter ${report.seo_score && report.seo_score >= 80 ? 'text-emerald-500' : 'text-orange-500'}`}>
                   {report.seo_score || '--'}<span className="text-xl text-muted-foreground/40">/100</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                   <div
                     className={`h-full transition-all duration-1000 ${report.seo_score && report.seo_score >= 80 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                     style={{ width: `${report.seo_score}%` }}
                   />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYSIS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CRITICAL ISSUES */}
        <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Critical Issues</h2>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Immediate Action Required</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold uppercase">
              {critical_fixes?.length || 0} Issues
            </span>
          </div>

          <div className="space-y-3">
            {critical_fixes && critical_fixes.length > 0 ? (
              critical_fixes.map((fix, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-red-500/30 transition-colors">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm font-medium text-foreground/80 leading-relaxed">{fix}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-emerald-500 font-medium">No critical issues found. Your site is well-optimized.</p>
              </div>
            )}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Lightbulb size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Recommendations</h2>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Growth Opportunities</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <p className="text-sm font-medium text-foreground/80 leading-relaxed">{sug}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground text-sm font-medium max-w-[280px]">
                  No additional recommendations available for this scan.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ACTION FOOTER */}
      <div className="flex justify-center pt-8 border-t border-border">
         <Link 
            href={`/dashboard?url=${encodeURIComponent(report.url_analyzed)}`}
            className="px-8 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
         >
            Re-Analyze Site Data
         </Link>
      </div>
    </div>
  );
}
