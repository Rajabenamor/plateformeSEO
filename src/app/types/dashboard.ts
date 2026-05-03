export interface DashboardData {
  overall_score: number;
  analyzed_url?: string;
  traffic: { date: string; users: number; displayDate: string }[];
  seo_fixes: { title: string; explanation: string; code_fix: string; target_file?: string }[];
  technical_health: number;
  content_score: number;
  backlink_strength: number;
}
