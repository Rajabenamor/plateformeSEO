export interface AnalysisRecord {
  id: number;
  url_analyzed: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  seo_score: number | null;
  created_at: string;
}
