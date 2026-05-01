"use client";

import { AlertTriangle } from "lucide-react";

export default function AdminError({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full transition-all hover:shadow-md">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h2>
        <p className="text-gray-500 mb-8">
          {error || "There was a problem communicating with the server. Your session might have expired."}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm active:scale-95 transition-transform"
          >
            Retry Request
          </button>
          <a
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
          >
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
