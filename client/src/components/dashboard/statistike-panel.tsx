import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { GlasackoMjesto } from "@shared/schema";

interface StatistikePanelProps {
  glasackaMjesta: GlasackoMjesto[];
}

export function StatistikePanel({ glasackaMjesta }: StatistikePanelProps) {
  const ukupnoGlasova = glasackaMjesta.reduce((sum, m) => sum + m.glasalo, 0);
  const validni = glasackaMjesta.reduce((sum, m) => sum + m.validnihGlasova, 0);
  const nevazeci = glasackaMjesta.reduce((sum, m) => sum + m.nevazeciGlasova, 0);
  const sporni = glasackaMjesta.reduce((sum, m) => sum + m.spornihGlasova, 0);

  const validniProcenat = ukupnoGlasova > 0 ? ((validni / ukupnoGlasova) * 100).toFixed(1) : '0';
  const nevazeciProcenat = ukupnoGlasova > 0 ? ((nevazeci / ukupnoGlasova) * 100).toFixed(1) : '0';
  const sporniProcenat = ukupnoGlasova > 0 ? ((sporni / ukupnoGlasova) * 100).toFixed(1) : '0';

  const data = [
    { name: 'Validni', value: validni, color: '#10B981' },
    { name: 'Nevažeći', value: nevazeci, color: '#EF4444' },
    { name: 'Sporni', value: sporni, color: '#F59E0B' },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Statistike validnosti</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between p-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => value.toLocaleString('bs')}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <p className="text-xs text-muted-foreground">Validni</p>
            </div>
            <p className="text-xl font-bold text-foreground" data-testid="text-validni-procenat">{validniProcenat}%</p>
            <p className="text-xs text-muted-foreground">{validni.toLocaleString('bs')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
              <p className="text-xs text-muted-foreground">Nevažeći</p>
            </div>
            <p className="text-xl font-bold text-foreground" data-testid="text-nevazeci-procenat">{nevazeciProcenat}%</p>
            <p className="text-xs text-muted-foreground">{nevazeci.toLocaleString('bs')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <p className="text-xs text-muted-foreground">Sporni</p>
            </div>
            <p className="text-xl font-bold text-foreground" data-testid="text-sporni-procenat">{sporniProcenat}%</p>
            <p className="text-xs text-muted-foreground">{sporni.toLocaleString('bs')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
