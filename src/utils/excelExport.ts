
import * as XLSX from "xlsx";
import { DashboardData } from "../types/dashboard";

export function exportToExcel(data: DashboardData): void {
  // Criar uma planilha para os indicadores
  const indicatorsSheet = XLSX.utils.json_to_sheet(
    data.indicators.map(ind => ({
      Indicador: ind.name,
      Valor: ind.value,
      Meta: ind.goal,
      Status: ind.status === "success" ? "✅ Meta Atingida" : 
              ind.status === "warning" ? "⚠️ Em Andamento" : "❌ Meta Não Atingida"
    }))
  );

  // Criar uma planilha para as metas de faturamento
  const revenueSheet = XLSX.utils.json_to_sheet(
    data.revenueGoals.map(goal => ({
      Plano: goal.plan,
      "Meta Semanal (R$)": goal.weeklyGoal,
      "Meta Mensal (R$)": goal.monthlyGoal,
      "Progresso (%)": goal.progress
    }))
  );

  // Criar uma planilha para os leads qualificados
  const leadsSheet = XLSX.utils.json_to_sheet(
    data.qualifiedLeads.map(lead => ({
      Nome: lead.name,
      Empresa: lead.company,
      Instagram: lead.instagram,
      Telefone: lead.phone,
      Origem: lead.source,
      Status: lead.status,
      "Último Contato": lead.lastContact,
      Responsável: lead.responsible
    }))
  );

  // Criar uma planilha para o resumo de reuniões
  const meetingsSheet = XLSX.utils.json_to_sheet(
    data.meetingSummaries.map(summary => ({
      Semana: summary.week,
      "Reuniões Agendadas": summary.scheduled,
      "Reuniões Realizadas": summary.completed,
      "Taxa de Comparecimento (%)": summary.attendanceRate
    }))
  );

  // Criar uma planilha para remarketing
  const remarketingSheet = XLSX.utils.json_to_sheet(
    data.remarketingLeads.map(lead => ({
      Nome: lead.name,
      Origem: lead.source,
      "Motivo da Perda": lead.lossReason,
      "Próxima Ação": lead.nextAction,
      "Data para Reabordar": lead.nextContactDate
    }))
  );

  // Criar uma planilha para informações gerais
  const generalInfoSheet = XLSX.utils.json_to_sheet([
    { Chave: "Mês de Referência", Valor: data.referenceMonth },
    { Chave: "Responsável pela Atualização", Valor: data.responsiblePerson },
    { Chave: "Observações Estratégicas", Valor: data.strategicNotes }
  ]);

  // Criar um novo workbook
  const wb = XLSX.utils.book_new();
  
  // Adicionar as planilhas ao workbook
  XLSX.utils.book_append_sheet(wb, indicatorsSheet, "Indicadores");
  XLSX.utils.book_append_sheet(wb, revenueSheet, "Metas de Faturamento");
  XLSX.utils.book_append_sheet(wb, leadsSheet, "Leads Qualificados");
  XLSX.utils.book_append_sheet(wb, meetingsSheet, "Resumo de Reuniões");
  XLSX.utils.book_append_sheet(wb, remarketingSheet, "Remarketing");
  XLSX.utils.book_append_sheet(wb, generalInfoSheet, "Informações Gerais");
  
  // Exportar o arquivo
  const fileName = `Dashboard_CRM_${data.referenceMonth.replace(" ", "_")}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
