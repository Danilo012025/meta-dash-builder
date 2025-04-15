
export interface Indicator {
  name: string;
  value: number;
  goal: number;
  status: "success" | "warning" | "error" | null;
}

export interface RevenueGoal {
  plan: string;
  weeklyGoal: number;
  monthlyGoal: number;
  progress: number;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  instagram: string;
  phone: string;
  source: string;
  status: string;
  lastContact: string;
  responsible: string;
}

export interface MeetingSummary {
  week: number;
  scheduled: number;
  completed: number;
  attendanceRate: number;
}

export interface RemarketingLead {
  name: string;
  source: string;
  lossReason: string;
  nextAction: string;
  nextContactDate: string;
}

export interface WeeklyCallData {
  week: string;
  calls: number;
}

export interface MeetingsSalesData {
  month: string;
  meetings: number;
  sales: number;
}

export interface FunnelData {
  name: string;
  value: number;
}

export interface LeadSourceData {
  source: string;
  value: number;
}

export interface DashboardData {
  referenceMonth: string;
  responsiblePerson: string;
  indicators: Indicator[];
  revenueGoals: RevenueGoal[];
  weeklyCallData: WeeklyCallData[];
  meetingsSalesData: MeetingsSalesData[];
  funnelData: FunnelData[];
  leadSourceData: LeadSourceData[];
  qualifiedLeads: Lead[];
  meetingSummaries: MeetingSummary[];
  strategicNotes: string;
  remarketingLeads: RemarketingLead[];
}
