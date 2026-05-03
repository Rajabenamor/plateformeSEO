"use client";

import { useActionState } from "react"; 
import { AlertCircle, Globe, Zap } from "lucide-react";
import { analyzeUrlAction } from "@/app/actions/dashboard";

export default function SearchForm() {
  const [state, formAction] = useActionState(analyzeUrlAction, { error: null });

  return (
    <div className="w-full max-w-xl mx-auto z-20 relative">
      
      {state?.error && (
        <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm font-semibold border border-red-100 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={18} />
          {state.error}
        </div>
      )}

      <form
        action={formAction}
        className={`py-3.5 bg-white p-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border flex items-center mb-5 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] ${
          state?.error ? "border-red-500 ring-4 ring-red-50" : "border-[#334155]"
        }`}
      >
        <div className="pl-4 pr-2 shrink-0">
          <Globe size={20} className={state?.error ? "text-red-400" : "text-gray-400"} />
        </div>
        
        <input
          name="url"
          type="text"
          placeholder="Enter your website URL (e.g., https://yourbrand.com)"
          className="grow bg-transparent border-none focus:ring-0 text-sm text-gray-700 outline-none w-full"
        />
        
        <button
          type="submit"
          className="bg-[#15418c] text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-[#0f306b] transition-colors whitespace-nowrap flex items-center gap-2 shrink-0"
        >
          Analyse
          <Zap size={10} />
        </button>
      </form>
    </div>
  );
}