import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Users, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { GlasackoMjesto } from "@shared/schema";
import { DetaljiDialog } from "@/components/dashboard/detalji-dialog";
import { mockGlasackaMjesta } from "@/lib/mockData";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'aktivno':
      return <Badge variant="default" data-testid={`badge-status-aktivno`}>Aktivno</Badge>;
    case 'upozorenje':
      return <Badge variant="secondary" data-testid={`badge-status-upozorenje`}>Upozorenje</Badge>;
    case 'kriticno':
      return <Badge variant="destructive" data-testid={`badge-status-kriticno`}>Kritično</Badge>;
    case 'neaktivno':
      return <Badge variant="outline" data-testid={`badge-status-neaktivno`}>Neaktivno</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'aktivno':
      return 'text-foreground';
    case 'upozorenje':
      return 'text-foreground';
    case 'kriticno':
      return 'text-destructive';
    case 'neaktivno':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
};

export default function GlasackaMjesta() {
  const [search, setSearch] = useState("");
  const [entitetFilter, setEntitetFilter] = useState<string>("svi");
  const [statusFilter, setStatusFilter] = useState<string>("svi");
  const [selectedMjesto, setSelectedMjesto] = useState<GlasackoMjesto | null>(null);

  // Use mock data directly for static deployment
  const glasackaMjesta = mockGlasackaMjesta;
  const isLoading = false;

  const filteredMjesta = glasackaMjesta.filter(mjesto => {
    const matchesSearch = mjesto.naziv.toLowerCase().includes(search.toLowerCase()) ||
                         mjesto.opstina.toLowerCase().includes(search.toLowerCase());
    const matchesEntitet = entitetFilter === "svi" || mjesto.entitet === entitetFilter;
    const matchesStatus = statusFilter === "svi" || mjesto.status === statusFilter;
    return matchesSearch && matchesEntitet && matchesStatus;
  });

  const izlaznostProcenat = (mjesto: GlasackoMjesto) => {
    if (!mjesto.brojBiraca || mjesto.brojBiraca === 0) return 0;
    return Math.round((mjesto.glasalo / mjesto.brojBiraca) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-glasacka-mjesta">Glasačka Mjesta</h1>
        <p className="text-muted-foreground">Pregled svih glasačkih mjesta u BiH</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži po nazivu ili opštini..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-mjesta"
          />
        </div>
        <Select value={entitetFilter} onValueChange={setEntitetFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-entitet">
            <SelectValue placeholder="Entitet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svi" data-testid="option-entitet-svi">Svi entiteti</SelectItem>
            <SelectItem value="FBiH" data-testid="option-entitet-fbih">Federacija BiH</SelectItem>
            <SelectItem value="RS" data-testid="option-entitet-rs">Republika Srpska</SelectItem>
            <SelectItem value="BD" data-testid="option-entitet-bd">Brčko Distrikt</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svi" data-testid="option-status-svi">Svi statusi</SelectItem>
            <SelectItem value="aktivno" data-testid="option-status-aktivno">Aktivno</SelectItem>
            <SelectItem value="upozorenje" data-testid="option-status-upozorenje">Upozorenje</SelectItem>
            <SelectItem value="kriticno" data-testid="option-status-kriticno">Kritično</SelectItem>
            <SelectItem value="neaktivno" data-testid="option-status-neaktivno">Neaktivno</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupno Mjesta</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-ukupno">{filteredMjesta.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivna</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-aktivna">
              {filteredMjesta.filter(m => m.status === 'aktivno').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upozorenja</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-upozorenja">
              {filteredMjesta.filter(m => m.status === 'upozorenje').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritična</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-kriticna">
              {filteredMjesta.filter(m => m.status === 'kriticno').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid View */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMjesta.map((mjesto) => (
            <Card key={mjesto.id} className="hover-elevate" data-testid={`card-mjesto-${mjesto.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid={`text-naziv-${mjesto.id}`}>
                      {mjesto.naziv}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`text-lokacija-${mjesto.id}`}>
                      {mjesto.opstina}, {mjesto.entitet}
                    </p>
                  </div>
                  {getStatusBadge(mjesto.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Izlaznost */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Izlaznost</span>
                    </div>
                    <span className="text-sm font-bold" data-testid={`text-izlaznost-${mjesto.id}`}>
                      {izlaznostProcenat(mjesto)}%
                    </span>
                  </div>
                  <Progress value={izlaznostProcenat(mjesto)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {mjesto.glasalo.toLocaleString('bs')} / {mjesto.brojBiraca.toLocaleString('bs')} glasača
                  </p>
                </div>

                {/* Statistike */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-xs text-muted-foreground">Validni Glasovi</div>
                    <div className="text-sm font-bold" data-testid={`text-validni-${mjesto.id}`}>
                      {mjesto.validnihGlasova.toLocaleString('bs')}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-xs text-muted-foreground">Nevažeći</div>
                    <div className="text-sm font-bold text-destructive" data-testid={`text-nevazeci-${mjesto.id}`}>
                      {mjesto.nevazeciGlasova.toLocaleString('bs')}
                    </div>
                  </div>
                </div>

                {/* Autentifikacije */}
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Autentifikacije:</span>
                  <span className={`font-semibold ${getStatusColor(mjesto.status)}`}>
                    {(mjesto.autentifikacije.uspjesne + mjesto.autentifikacije.neuspjesne + mjesto.autentifikacije.blokirane).toLocaleString('bs')}
                  </span>
                </div>

                {/* Akcija */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedMjesto(mjesto)}
                  data-testid={`button-detalji-${mjesto.id}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Prikaži Detalje
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMjesta.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Nema rezultata</h3>
            <p className="text-muted-foreground">Pokušajte promijeniti filtere ili pojam pretrage.</p>
          </div>
        )}
      </div>

      {/* Detalji Dialog */}
      {selectedMjesto && (
        <DetaljiDialog
          mjesto={selectedMjesto}
          open={!!selectedMjesto}
          onOpenChange={(open) => !open && setSelectedMjesto(null)}
        />
      )}
    </div>
  );
}
