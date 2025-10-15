import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Shield } from "lucide-react";
import { GlasackoMjesto } from "@shared/schema";

interface AutentifikacijePanelProps {
  glasackaMjesta: GlasackoMjesto[];
}

export function AutentifikacijePanel({ glasackaMjesta }: AutentifikacijePanelProps) {
  const uspjesne = glasackaMjesta.reduce((sum, m) => sum + m.autentifikacije.uspjesne, 0);
  const neuspjesne = glasackaMjesta.reduce((sum, m) => sum + m.autentifikacije.neuspjesne, 0);
  const blokirane = glasackaMjesta.reduce((sum, m) => sum + m.autentifikacije.blokirane, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Autentifikacije (UŽIVO)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uspješne</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-uspjesne">{uspjesne.toLocaleString('bs')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-2 py-1 bg-success/20 rounded text-xs font-medium text-success">
                Normalno
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <XCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Neuspješne</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-neuspjesne">{neuspjesne.toLocaleString('bs')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-2 py-1 bg-warning/20 rounded text-xs font-medium text-warning">
                Praćeno
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-danger/10 rounded-lg border border-danger/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger/20 rounded-lg">
                <Shield className="h-6 w-6 text-danger" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blokirane</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-blokirane">{blokirane.toLocaleString('bs')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-2 py-1 bg-danger/20 rounded text-xs font-medium text-danger">
                Kritično
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">Posljednje ažuriranje</p>
          <p className="text-sm font-medium text-foreground mt-1">{new Date().toLocaleTimeString('bs')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
