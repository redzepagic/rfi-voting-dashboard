import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, AlertTriangle, CheckCircle, Clock, MapPin, Filter } from "lucide-react";
import { Anomalija } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockAnomalije } from "@/lib/mockData";

const getPrioritetBadge = (tip: string) => {
  switch (tip) {
    case 'kritično':
      return <Badge variant="destructive" data-testid="badge-kriticno">Kritično</Badge>;
    case 'upozorenje':
      return <Badge variant="secondary" data-testid="badge-upozorenje">Upozorenje</Badge>;
    default:
      return <Badge variant="outline">{tip}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'aktivno':
      return <Badge variant="destructive" data-testid="badge-status-aktivno">Aktivno</Badge>;
    case 'riješeno':
      return <Badge variant="default" data-testid="badge-status-rijeseno">Riješeno</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Anomalije() {
  const [search, setSearch] = useState("");
  const [tipFilter, setTipFilter] = useState<string>("svi");
  const [statusFilter, setStatusFilter] = useState<string>("svi");

  // Use mock data directly for static deployment
  const anomalije = mockAnomalije;
  const isLoading = false;

  const filteredAnomalije = anomalije.filter(anomalija => {
    const matchesSearch = 
      anomalija.opis.toLowerCase().includes(search.toLowerCase()) ||
      anomalija.glasackoMjestoId.toLowerCase().includes(search.toLowerCase());
    const matchesTip = tipFilter === "svi" || anomalija.tip === tipFilter;
    const matchesStatus = statusFilter === "svi" || anomalija.status === statusFilter;
    return matchesSearch && matchesTip && matchesStatus;
  });

  const stats = {
    ukupno: anomalije.length,
    aktivne: anomalije.filter(a => a.status === 'aktivno').length,
    rijesene: anomalije.filter(a => a.status === 'riješeno').length,
    kriticne: anomalije.filter(a => a.tip === 'kritično' && a.status === 'aktivno').length,
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
        <h1 className="text-3xl font-bold" data-testid="heading-anomalije">Evidencija Anomalija</h1>
        <p className="text-muted-foreground">Pregled svih detektovanih anomalija i upozorenja</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži po opisu ili ID glasačkog mjesta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-anomalije"
          />
        </div>
        <Select value={tipFilter} onValueChange={setTipFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-tip">
            <SelectValue placeholder="Prioritet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svi" data-testid="option-tip-svi">Svi prioriteti</SelectItem>
            <SelectItem value="kritično" data-testid="option-tip-kriticno">Kritično</SelectItem>
            <SelectItem value="upozorenje" data-testid="option-tip-upozorenje">Upozorenje</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svi" data-testid="option-status-svi">Svi statusi</SelectItem>
            <SelectItem value="aktivno" data-testid="option-status-aktivno">Aktivno</SelectItem>
            <SelectItem value="riješeno" data-testid="option-status-rijeseno">Riješeno</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupno Anomalija</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-ukupno">{stats.ukupno}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivne</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-aktivne">{stats.aktivne}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riješene</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-rijesene">{stats.rijesene}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritične (Aktivne)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-kriticne">{stats.kriticne}</div>
          </CardContent>
        </Card>
      </div>

      {/* Anomalije List */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Lista Anomalija ({filteredAnomalije.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {filteredAnomalije.map((anomalija) => (
                <Card 
                  key={anomalija.id} 
                  className="hover-elevate"
                  data-testid={`card-anomalija-${anomalija.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getPrioritetBadge(anomalija.tip)}
                          {getStatusBadge(anomalija.status)}
                        </div>
                        <p className="font-medium" data-testid={`text-opis-${anomalija.id}`}>
                          {anomalija.opis}
                        </p>
                      </div>
                      <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${anomalija.tip === 'kritično' ? 'text-destructive' : 'text-muted-foreground'}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Glasačko mjesto:</span>
                      <span className="font-medium" data-testid={`text-mjesto-${anomalija.id}`}>
                        {anomalija.glasackoMjestoId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Vrijeme:</span>
                      <span data-testid={`text-vrijeme-${anomalija.id}`}>
                        {anomalija.vrijeme}
                      </span>
                    </div>
                    {anomalija.status === 'aktivno' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full"
                        data-testid={`button-rijesi-${anomalija.id}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Označi kao riješeno
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {filteredAnomalije.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Nema anomalija</h3>
              <p className="text-muted-foreground">Pokušajte promijeniti filtere ili pojam pretrage.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
