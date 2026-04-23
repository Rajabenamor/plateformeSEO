// app/dashboard/history/[id]/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

// Define the shape of our deep recommendations
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

export default async function ReportPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect('/login');
  }

  // Fetch the single report using the ID from the URL
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/history/${params.id}/`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: 'no-store'
  });

  if (response.status === 401) redirect('/login');
  if (response.status === 404) return <div className="p-8 text-center text-red-500">Report not found.</div>;
  if (!response.ok) return <div className="p-8 text-center text-red-500">Failed to load report.</div>;

  const report: ReportData = await response.json();
  const { critical_fixes, suggestions } = report.recommendations_summary;

  return (
    <div className="max-w-5xl p-6 mx-auto mt-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/history" className="text-sm text-blue-600 hover:underline">
            &larr; Back to History
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">SEO Analysis Report</h1>
          <p className="text-gray-500">{report.url_analyzed}</p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">Overall Score</div>
          <div className={`text-4xl font-extrabold ${report.seo_score && report.seo_score >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
            {report.seo_score ? `${report.seo_score}/100` : 'Pending'}
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Critical Fixes Panel */}
        <div className="p-6 bg-red-50 border border-red-100 rounded-xl">
          <h2 className="flex items-center mb-4 text-lg font-bold text-red-800">
            <span className="mr-2">🚨</span> Critical AI Fixes
          </h2>
          {critical_fixes && critical_fixes.length > 0 ? (
            <ul className="space-y-3 text-red-900 list-disc list-inside">
              {critical_fixes.map((fix, idx) => (
                <li key={idx} className="leading-relaxed">{fix}</li>
              ))}
            </ul>
          ) : (
            <p className="text-red-700 italic">No critical issues found!</p>
          )}
        </div>

        {/* Suggestions Panel */}
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
          <h2 className="flex items-center mb-4 text-lg font-bold text-blue-800">
            <span className="mr-2">💡</span> Deep Recommendations
          </h2>
          {suggestions && suggestions.length > 0 ? (
            <ul className="space-y-3 text-blue-900 list-disc list-inside">
              {suggestions.map((sug, idx) => (
                <li key={idx} className="leading-relaxed">{sug}</li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-700 italic">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}