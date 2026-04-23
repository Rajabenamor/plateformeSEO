'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHistoryAction } from '@/app/actions/settings'; // Adjust path to where you saved the action
import { AnalysisRecord } from '@/app/types/auth';

// ... (Keep the AnalysisRecord interface if it's not imported) ...

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getHistoryAction();
      
      if (result.success && result.data) {
        setHistory(result.data);
      } else {
        setError(result.error || 'Could not load analysis history.');
      }
      
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  // 3. Helper function for status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Completed</span>;
      case 'PENDING': return <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full animate-pulse">Pending...</span>;
      case 'FAILED': return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Failed</span>;
      default: return <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your history...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // 4. Render the UI
  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SEO Analysis History</h1>
        <Link 
          href="/dashboard" 
          className="px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + New Analysis
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No history found</h3>
          <p className="mt-2 text-gray-500">You haven't analyzed any URLs yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Analyzed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.url_analyzed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {record.seo_score ? `${record.seo_score}/100` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {record.status === 'COMPLETED' && (
                      <Link href={`/dashboard/history/${record.id}`} className="text-blue-600 hover:text-blue-900">
                        View Report →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}