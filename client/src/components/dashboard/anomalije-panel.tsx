import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Wifi, TrendingUp } from "lucide-react";
import { Anomalija } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnomalijePanelProps {
  anomalije: Anomalija[];
}

const getAnomalijaIcon = (tip: string) => {
  if (tip === 'kritično') return <AlertCircle className="h-4 w-4 text-danger" />;
  return <AlertTriangle className="h-4 w-4 text-warning" />;
};

const getTipBadgeVariant = (tip: string): "destructive" | "secondary" => {
  return tip === 'kritično' ? 'destructive' : 'secondary';
};

const getAnomalijaOpisIcon = (opis: string) => {
  if (opis.toLowerCase().includes('veze') || opis.toLowerCase().includes('internet')) {
    return <Wifi className="h-3.5 w-3.5 text-muted-foreground" />;
  }
  if (opis.toLowerCase().includes('stopa')) {
    return <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />;
  }
  return null;
};

export function AnomalijePanel({ anomalije }: AnomalijePanelProps) {
  const aktivneAnomalije = anomalije.filter(a => a.status === 'aktivno');
  const kritične = aktivneAnomalije.filter(a => a.tip === 'kritično').length;
  const upozorenja = aktivneAnomalije.filter(a => a.tip === 'upozorenje').length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Anomalije i upozorenja</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs" data-testid="badge-kriticne">
              {kritične} kritično
            </Badge>
            <Badge variant="secondary" className="text-xs" data-testid="badge-upozorenja">
              {upozorenja} upozorenja
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 pb-4">
        <ScrollArea className="h-[340px] px-6">
          {aktivneAnomalije.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="p-3 bg-success/10 rounded-full mb-3">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <p className="text-sm font-medium text-foreground">Nema novih anomalija</p>
              <p className="text-xs text-muted-foreground mt-1">Sistem funkcioniše normalno</p>
            </div>
          ) : (
            <div className="space-y-3">
              {aktivneAnomalije.map((anomalija) => (
                <div 
                  key={anomalija.id} 
                  className="p-3 border rounded-lg hover-elevate"
                  data-testid={`anomalija-${anomalija.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      {getAnomalijaIcon(anomalija.tip)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">
                          {anomalija.glasackoMjestoId}
                        </Badge>
                        <Badge variant={getTipBadgeVariant(anomalija.tip)} className="text-xs">
                          {anomalija.tip}
                        </Badge>
                      </div>
                      <div className="flex items-start gap-2">
                        {getAnomalijaOpisIcon(anomalija.opis)}
                        <p className="text-sm text-foreground flex-1">{anomalija.opis}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{anomalija.vrijeme}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
