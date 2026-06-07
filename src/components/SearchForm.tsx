"use client";

import { useActionState } from "react"; 
import { AlertCircle, Globe, Zap, ArrowRight } from "lucide-react";
import { analyzeUrlAction } from "@/app/actions/dashboard";

export default function SearchForm() {
  const [state, formAction] = useActionState(analyzeUrlAction, { error: null });

  return (
    <div className="w-full relative group">
      {state?.error && (
        <div className="absolute -top-12 left-0 right-0 flex items-center gap-2 text-red-500 bg-red-500/5 px-4 py-2 rounded-lg text-xs font-semibold border border-red-500/10 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={14} />
          {state.error}
        </div>
      )}

      <form
        action={formAction}
        className={`relative flex items-center transition-all duration-300 ${
          state?.error ? "opacity-100" : ""
        }`}
      >
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none">
            <Globe size={16} />
          </div>

          <input
            name="url"
            type="text"
            autoComplete="off"
            placeholder="target-domain.com"
            className={`w-full bg-muted/50 border-2 rounded-lg py-4 pl-11 pr-32 text-sm font-medium transition-all outline-none placeholder:text-muted-foreground/50 ${
              state?.error 
                ? "border-red-500/50 ring-2 ring-red-500/10" 
                : "border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
            }`}
          />

          <div className="absolute right-1.5 flex items-center gap-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-3 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
            >
              Analyze
              <Zap size={12} className="opacity-70" />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-3 flex items-center justify-between px-1">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Ready for analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
               <Zap size={10} className="text-amber-500/50" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">AI-Powered Audit</span>
            </div>
         </div>
         <span className="text-[10px] font-medium text-muted-foreground italic">HTTPS suggested</span>
      </div>
    </div>
  );
}