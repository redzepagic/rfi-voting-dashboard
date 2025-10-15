import { useState } from "react";
import { MapaPanel } from "@/components/dashboard/mapa-panel";
import { StatistikePanel } from "@/components/dashboard/statistike-panel";
import { AutentifikacijePanel } from "@/components/dashboard/autentifikacije-panel";
import { AnomalijePanel } from "@/components/dashboard/anomalije-panel";
import { GlasackaMjestaTabela } from "@/components/dashboard/glasacka-mjesta-tabela";
import { DetaljiDialog } from "@/components/dashboard/detalji-dialog";
import { GlasackoMjesto } from "@shared/schema";
import { mockGlasackaMjesta, mockAnomalije } from "@/lib/mockData";

export default function Dashboard() {
  const [selectedMjesto, setSelectedMjesto] = useState<GlasackoMjesto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use mock data directly for static deployment
  const glasackaMjesta = mockGlasackaMjesta;
  const anomalije = mockAnomalije;

  const handleDetalji = (mjesto: GlasackoMjesto) => {
    setSelectedMjesto(mjesto);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Grid - 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapaPanel glasackaMjesta={glasackaMjesta} />
        <StatistikePanel glasackaMjesta={glasackaMjesta} />
        <AutentifikacijePanel glasackaMjesta={glasackaMjesta} />
        <AnomalijePanel anomalije={anomalije} />
      </div>

      {/* Tabela glasačkih mjesta */}
      <GlasackaMjestaTabela 
        glasackaMjesta={glasackaMjesta} 
        onDetalji={handleDetalji}
      />

      {/* Detalji Dialog */}
      <DetaljiDialog
        mjesto={selectedMjesto}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
