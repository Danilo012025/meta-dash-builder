
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardData, MeetingSummary } from "@/types/dashboard";

interface MeetingSummaryProps {
  data: DashboardData;
  onUpdateData: (updatedData: Partial<DashboardData>) => void;
}

export function MeetingSummarySection({ data, onUpdateData }: MeetingSummaryProps) {
  const [summaries, setSummaries] = useState<MeetingSummary[]>(data.meetingSummaries);

  const handleScheduledChange = (index: number, value: number) => {
    const updatedSummaries = [...summaries];
    updatedSummaries[index] = { 
      ...updatedSummaries[index], 
      scheduled: value,
      attendanceRate: calculateAttendanceRate(value, updatedSummaries[index].completed)
    };
    setSummaries(updatedSummaries);
    onUpdateData({ meetingSummaries: updatedSummaries });
  };

  const handleCompletedChange = (index: number, value: number) => {
    const updatedSummaries = [...summaries];
    updatedSummaries[index] = { 
      ...updatedSummaries[index], 
      completed: value,
      attendanceRate: calculateAttendanceRate(updatedSummaries[index].scheduled, value)
    };
    setSummaries(updatedSummaries);
    onUpdateData({ meetingSummaries: updatedSummaries });
  };

  const calculateAttendanceRate = (scheduled: number, completed: number): number => {
    if (scheduled === 0) return 0;
    return Math.round((completed / scheduled) * 100);
  };

  return (
    <Card className="bg-card border-border mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-title text-white mb-4">
          🗓️ Resumo de Reuniões (Semanal)
        </h2>
        
        <div className="space-y-4">
          {summaries.map((summary, index) => (
            <div key={index} className="bg-secondary rounded-lg p-4 border border-border">
              <h3 className="text-lg font-semibold mb-3 text-white">
                Semana {summary.week}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Reuniões Agendadas
                  </label>
                  <Input 
                    type="number"
                    value={summary.scheduled}
                    onChange={(e) => handleScheduledChange(index, Number(e.target.value))}
                    className="bg-muted text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Reuniões Realizadas
                  </label>
                  <Input 
                    type="number"
                    value={summary.completed}
                    onChange={(e) => handleCompletedChange(index, Number(e.target.value))}
                    className="bg-muted text-white"
                  />
                </div>
                
                <div className="flex items-end">
                  <div className="w-full bg-muted rounded-md p-2 text-center text-white">
                    <span className="font-semibold">
                      Comparecimento: {summary.attendanceRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
