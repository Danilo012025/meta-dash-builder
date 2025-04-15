
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DashboardData, RevenueGoal } from "@/types/dashboard";

interface RevenueGoalsSectionProps {
  data: DashboardData;
  onUpdateData: (updatedData: Partial<DashboardData>) => void;
}

export function RevenueGoalsSection({ data, onUpdateData }: RevenueGoalsSectionProps) {
  const [goals, setGoals] = useState<RevenueGoal[]>(data.revenueGoals);

  const handleWeeklyGoalChange = (index: number, value: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = { ...updatedGoals[index], weeklyGoal: value };
    setGoals(updatedGoals);
    onUpdateData({ revenueGoals: updatedGoals });
  };

  const handleMonthlyGoalChange = (index: number, value: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = { ...updatedGoals[index], monthlyGoal: value };
    setGoals(updatedGoals);
    onUpdateData({ revenueGoals: updatedGoals });
  };

  const handleProgressChange = (index: number, value: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = { ...updatedGoals[index], progress: value };
    setGoals(updatedGoals);
    onUpdateData({ revenueGoals: updatedGoals });
  };

  return (
    <Card className="bg-card border-border mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-title text-white mb-4">
          💰 Metas de Faturamento
        </h2>
        
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="bg-secondary rounded-lg p-4 border border-border">
              <h3 className="text-lg font-semibold mb-3 text-brand-neon">
                Plano {goal.plan}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Meta Semanal (R$)
                  </label>
                  <Input 
                    type="number"
                    value={goal.weeklyGoal}
                    onChange={(e) => handleWeeklyGoalChange(index, Number(e.target.value))}
                    className="bg-muted text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Meta Mensal (R$)
                  </label>
                  <Input 
                    type="number"
                    value={goal.monthlyGoal}
                    onChange={(e) => handleMonthlyGoalChange(index, Number(e.target.value))}
                    className="bg-muted text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Progresso (%)
                  </label>
                  <Input 
                    type="number"
                    value={goal.progress}
                    onChange={(e) => handleProgressChange(index, Number(e.target.value))}
                    className="bg-muted text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <Progress value={goal.progress} className="h-2 bg-muted" 
                  style={{
                    backgroundImage: `linear-gradient(to right, #00FF00 ${goal.progress}%, transparent ${goal.progress}%)`
                  }}
                />
                <div className="text-right mt-1 text-sm text-muted-foreground">
                  {goal.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
