export interface ActionItem {
  id: string;
  title: string;
  impact_score: number;
  effort_level: string;
  explanation: string;
  technical_details: string;
  code_fix?: string;
  target_file?: string;
  status: string;
}

export interface TrafficDecayAlert {
  url: string;
  drop_percentage: number;
  recommended_action: string;
}

export interface CannibalizationWarning {
  keyword: string;
  competing_urls: string[];
  recommended_action: string;
}

export interface MissedClicksMetric {
  keyword: string;
  url: string;
  current_position: number;
  current_ctr: number;
  potential_traffic_gain: number;
}

export interface MobilePenaltyIndex {
  desktop_score: number;
  mobile_score: number;
  penalty_gap: number;
  critical_issues: string[];
}

export interface CompetitorBlindSpot {
  target_keyword: string;
  missing_topics: string[];
  competitor_urls: string[];
}

export interface EnrichedStatistics {
  traffic_decay: TrafficDecayAlert[];
  cannibalization: CannibalizationWarning[];
  missed_clicks: MissedClicksMetric[];
  mobile_penalty: MobilePenaltyIndex;
  competitor_blind_spots: CompetitorBlindSpot[];
}

export interface DashboardData {
  global_health_score: number;
  traffic_velocity: string;
  enriched_statistics: EnrichedStatistics;
  critical_action_items: ActionItem[];
  // Maintain backward compatibility for now if needed, or remove old fields
  overall_score?: number;
  analyzed_url?: string;
  traffic?: { date: string; users: number; displayDate: string }[];
  seo_fixes?: any[];
  technical_health?: number;
  content_score?: number;
  backlink_strength?: number;
}

