
import { DashboardData } from "../types/dashboard";

export const initialDashboardData: DashboardData = {
  referenceMonth: "Abril 2025",
  responsiblePerson: "Danilo Silva",
  indicators: [
    { name: "Total de Leads Gerados", value: 85, goal: 100, status: null },
    { name: "Ligações Realizadas", value: 150, goal: 120, status: null },
    { name: "Reuniões Agendadas", value: 32, goal: 40, status: null },
    { name: "Reuniões Realizadas", value: 28, goal: 35, status: null },
    { name: "Propostas Enviadas", value: 22, goal: 25, status: null },
    { name: "Vendas Fechadas", value: 12, goal: 15, status: null },
    { name: "Taxa de Conversão", value: 14, goal: 15, status: null },
    { name: "Taxa de Fechamento", value: 55, goal: 50, status: null }
  ],
  revenueGoals: [
    { plan: "Start", weeklyGoal: 2500, monthlyGoal: 10000, progress: 65 },
    { plan: "Pro", weeklyGoal: 5000, monthlyGoal: 20000, progress: 48 },
    { plan: "Elite", weeklyGoal: 7500, monthlyGoal: 30000, progress: 72 }
  ],
  weeklyCallData: [
    { week: "Semana 1", calls: 45 },
    { week: "Semana 2", calls: 32 },
    { week: "Semana 3", calls: 38 },
    { week: "Semana 4", calls: 35 }
  ],
  meetingsSalesData: [
    { month: "Jan", meetings: 20, sales: 8 },
    { month: "Fev", meetings: 25, sales: 10 },
    { month: "Mar", meetings: 30, sales: 12 },
    { month: "Abr", meetings: 28, sales: 12 }
  ],
  funnelData: [
    { name: "Leads", value: 85 },
    { name: "Contatos", value: 65 },
    { name: "Reuniões", value: 32 },
    { name: "Propostas", value: 22 },
    { name: "Vendas", value: 12 }
  ],
  leadSourceData: [
    { source: "Instagram", value: 45 },
    { source: "Facebook", value: 25 },
    { source: "Indicação", value: 15 },
    { source: "Google", value: 10 },
    { source: "Outros", value: 5 }
  ],
  qualifiedLeads: [
    {
      id: "1",
      name: "Maria Santos",
      company: "Café Aroma",
      instagram: "@cafearoma",
      phone: "(11)98765-4321",
      source: "Instagram",
      status: "Ativo",
      lastContact: "15/04/25",
      responsible: "Danilo"
    },
    {
      id: "2",
      name: "João Silva",
      company: "Tech Solutions",
      instagram: "@techsolutions",
      phone: "(21)97654-3210",
      source: "Facebook",
      status: "Ativo",
      lastContact: "14/04/25",
      responsible: "Danilo"
    },
    {
      id: "3",
      name: "Ana Oliveira",
      company: "Boutique Charme",
      instagram: "@boutiquecharme",
      phone: "(31)96543-2109",
      source: "Indicação",
      status: "Ativo",
      lastContact: "13/04/25",
      responsible: "Danilo"
    }
  ],
  meetingSummaries: [
    { week: 1, scheduled: 8, completed: 7, attendanceRate: 88 },
    { week: 2, scheduled: 10, completed: 6, attendanceRate: 60 },
    { week: 3, scheduled: 7, completed: 6, attendanceRate: 86 },
    { week: 4, scheduled: 9, completed: 8, attendanceRate: 89 }
  ],
  strategicNotes: "Semana 2 teve menor comparecimento, revisar abordagem e horário das reuniões. Leads do Instagram estão mostrando melhor taxa de conversão.",
  remarketingLeads: [
    {
      name: "Roberto Mendes",
      source: "Instagram",
      lossReason: "Sem resposta",
      nextAction: "Enviar mensagem",
      nextContactDate: "25/04/25"
    },
    {
      name: "Carla Duarte",
      source: "Facebook",
      lossReason: "Orçamento alto",
      nextAction: "Oferecer desconto",
      nextContactDate: "28/04/25"
    }
  ]
};

// Função para calcular o status dos indicadores automaticamente
export function calculateIndicatorStatus(value: number, goal: number): "success" | "warning" | "error" {
  const percentage = (value / goal) * 100;
  
  if (percentage >= 100) {
    return "success";
  } else if (percentage >= 80) {
    return "warning";
  } else {
    return "error";
  }
}

// Função para atualizar o status de todos os indicadores
export function updateAllIndicatorsStatus(data: DashboardData): DashboardData {
  const updatedData = {...data};
  
  updatedData.indicators = data.indicators.map(indicator => ({
    ...indicator,
    status: calculateIndicatorStatus(indicator.value, indicator.goal)
  }));
  
  return updatedData;
}
