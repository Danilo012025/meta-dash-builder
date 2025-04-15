
import { Card, CardContent } from "@/components/ui/card";
import { DashboardData } from "@/types/dashboard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface ChartsSectionProps {
  data: DashboardData;
}

// Cores para o gráfico de pizza
const COLORS = ['#00FF00', '#00CC00', '#00AA00', '#008800', '#006600'];

export function ChartsSection({ data }: ChartsSectionProps) {
  return (
    <Card className="bg-card border-border mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-title text-white mb-6">
          📈 Gráficos e Métricas Visuais
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de Barras - Ligações por semana */}
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 text-white">Gráfico de Barras – Ligações por semana</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.weeklyCallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #333' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="calls" fill="#00FF00" name="Ligações" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Gráfico de Linha - Reuniões vs Vendas */}
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 text-white">Gráfico de Linha – Reuniões vs Vendas</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.meetingsSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #333' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="meetings" stroke="#00FF00" name="Reuniões" />
                <Line type="monotone" dataKey="sales" stroke="#ffffff" name="Vendas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Funil - Jornada Lead → Venda */}
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 text-white">Gráfico de Funil – Jornada: Lead → Venda</h3>
            <ResponsiveContainer width="100%" height={250}>
              <FunnelChart>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #333' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Funnel
                  data={data.funnelData}
                  dataKey="value"
                  nameKey="name"
                  fill="#00FF00"
                >
                  <LabelList position="right" fill="#ffffff" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          
          {/* Gráfico de Pizza - Origem dos Leads */}
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 text-white">Gráfico de Pizza – Origem dos Leads</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.leadSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="source"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #333' }} 
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
