import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, User, Clock, Shield, Settings, AlertTriangle, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditEntry {
  id: string;
  vrijeme: string;
  korisnik: string;
  akcija: string;
  tip: 'system' | 'edit' | 'warning' | 'info' | 'security';
  detalji?: string;
  glasackoMjestoId?: string;
}

// Mock audit log data
const mockAuditLog: AuditEntry[] = [
  { id: '1', vrijeme: '2024-10-14 15:30:45', korisnik: 'Revizor: A. Hasanović', akcija: 'Pregled statusa glasačkog mjesta GM-0001', tip: 'info', glasackoMjestoId: 'GM-0001' },
  { id: '2', vrijeme: '2024-10-14 15:25:12', korisnik: 'Sistem', akcija: 'Automatsko ažuriranje podataka', tip: 'system' },
  { id: '3', vrijeme: '2024-10-14 15:20:33', korisnik: 'Revizor: M. Kovač', akcija: 'Izmjena anomalije - označeno kao riješeno', tip: 'edit', detalji: 'Anomalija A-123 riješena' },
  { id: '4', vrijeme: '2024-10-14 15:15:22', korisnik: 'Sistem', akcija: 'Upozorenje: Visoka stopa neuspješnih autentifikacija', tip: 'warning', glasackoMjestoId: 'GM-0003' },
  { id: '5', vrijeme: '2024-10-14 15:10:00', korisnik: 'Administrator: S. Jurić', akcija: 'Promjena korisničkih postavki', tip: 'security' },
  { id: '6', vrijeme: '2024-10-14 15:05:45', korisnik: 'Sistem', akcija: 'Početak rada glasačkog mjesta GM-0015', tip: 'system', glasackoMjestoId: 'GM-0015' },
  { id: '7', vrijeme: '2024-10-14 15:00:30', korisnik: 'Revizor: L. Popović', akcija: 'Generisanje izvještaja za period 12:00-15:00', tip: 'info' },
  { id: '8', vrijeme: '2024-10-14 14:55:15', korisnik: 'Sistem', akcija: 'Kritično: Prekid komunikacije sa GM-0007', tip: 'warning', glasackoMjestoId: 'GM-0007' },
  { id: '9', vrijeme: '2024-10-14 14:50:00', korisnik: 'Administrator: S. Jurić', akcija: 'Kreiranje novog korisničkog naloga', tip: 'security', detalji: 'Korisnik: revizor_novi' },
  { id: '10', vrijeme: '2024-10-14 14:45:22', korisnik: 'Revizor: A. Hasanović', akcija: 'Pregled anomalija za FBiH region', tip: 'info' },
  { id: '11', vrijeme: '2024-10-14 14:40:11', korisnik: 'Sistem', akcija: 'Automatska validacija podataka', tip: 'system' },
  { id: '12', vrijeme: '2024-10-14 14:35:05', korisnik: 'Revizor: M. Kovač', akcija: 'Export podataka u CSV format', tip: 'info' },
  { id: '13', vrijeme: '2024-10-14 14:30:50', korisnik: 'Sistem', akcija: 'Upozorenje: Niska izlaznost na GM-0012', tip: 'warning', glasackoMjestoId: 'GM-0012' },
  { id: '14', vrijeme: '2024-10-14 14:25:33', korisnik: 'Administrator: S. Jurić', akcija: 'Ažuriranje sistemskih postavki', tip: 'security' },
  { id: '15', vrijeme: '2024-10-14 14:20:18', korisnik: 'Revizor: L. Popović', akcija: 'Pregled validacionih izvještaja', tip: 'info' },
];

const getTypeBadge = (tip: string) => {
  switch (tip) {
    case 'system':
      return <Badge variant="outline" data-testid={`badge-tip-system`}><Settings className="h-3 w-3 mr-1" />Sistem</Badge>;
    case 'edit':
      return <Badge variant="default" data-testid={`badge-tip-edit`}><FileText className="h-3 w-3 mr-1" />Izmjena</Badge>;
    case 'warning':
      return <Badge variant="destructive" data-testid={`badge-tip-warning`}><AlertTriangle className="h-3 w-3 mr-1" />Upozorenje</Badge>;
    case 'security':
      return <Badge variant="secondary" data-testid={`badge-tip-security`}><Shield className="h-3 w-3 mr-1" />Sigurnost</Badge>;
    case 'info':
      return <Badge variant="outline" data-testid={`badge-tip-info`}><Info className="h-3 w-3 mr-1" />Info</Badge>;
    default:
      return <Badge variant="outline">{tip}</Badge>;
  }
};

const getTypeIcon = (tip: string) => {
  switch (tip) {
    case 'system':
      return <Settings className="h-5 w-5 text-muted-foreground" />;
    case 'edit':
      return <FileText className="h-5 w-5 text-foreground" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case 'security':
      return <Shield className="h-5 w-5 text-foreground" />;
    case 'info':
      return <Info className="h-5 w-5 text-muted-foreground" />;
    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [tipFilter, setTipFilter] = useState<string>("svi");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEntries = mockAuditLog.filter(entry => {
    const matchesSearch = 
      entry.akcija.toLowerCase().includes(search.toLowerCase()) ||
      entry.korisnik.toLowerCase().includes(search.toLowerCase());
    const matchesTip = tipFilter === "svi" || entry.tip === tipFilter;
    return matchesSearch && matchesTip;
  });

  // Reset pagination when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTipFilterChange = (value: string) => {
    setTipFilter(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    ukupno: mockAuditLog.length,
    system: mockAuditLog.filter(e => e.tip === 'system').length,
    warning: mockAuditLog.filter(e => e.tip === 'warning').length,
    security: mockAuditLog.filter(e => e.tip === 'security').length,
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-audit-log">Revizijski Zapisnik</h1>
        <p className="text-muted-foreground">Kompletan log svih sistemskih i korisničkih aktivnosti</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži po akciji ili korisniku..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            data-testid="input-search-audit"
          />
        </div>
        <Select value={tipFilter} onValueChange={handleTipFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-tip-filter">
            <SelectValue placeholder="Tip akcije" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svi" data-testid="option-tip-svi">Sve akcije</SelectItem>
            <SelectItem value="system" data-testid="option-tip-system">Sistem</SelectItem>
            <SelectItem value="edit" data-testid="option-tip-edit">Izmjene</SelectItem>
            <SelectItem value="warning" data-testid="option-tip-warning">Upozorenja</SelectItem>
            <SelectItem value="security" data-testid="option-tip-security">Sigurnost</SelectItem>
            <SelectItem value="info" data-testid="option-tip-info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupno Zapisa</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-ukupno-audit">{stats.ukupno}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistemski</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-system">{stats.system}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upozorenja</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-warning">{stats.warning}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sigurnost</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-security">{stats.security}</div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Aktivnosti (Stranica {currentPage} od {totalPages})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {paginatedEntries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="flex gap-4 pb-4 border-b last:border-0"
                  data-testid={`audit-entry-${entry.id}`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(entry.tip)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <p className="font-medium" data-testid={`text-akcija-${entry.id}`}>
                          {entry.akcija}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground" data-testid={`text-korisnik-${entry.id}`}>
                            {entry.korisnik}
                          </p>
                        </div>
                        {entry.detalji && (
                          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-detalji-${entry.id}`}>
                            {entry.detalji}
                          </p>
                        )}
                      </div>
                      {getTypeBadge(entry.tip)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground" data-testid={`text-vrijeme-${entry.id}`}>
                        {entry.vrijeme}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-md border hover-elevate disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-prev-page"
              >
                Prethodna
              </button>
              <span className="text-sm text-muted-foreground" data-testid="text-page-info">
                Stranica {currentPage} od {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-md border hover-elevate disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-next-page"
              >
                Sljedeća
              </button>
            </div>
          )}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Nema zapisa</h3>
              <p className="text-muted-foreground">Pokušajte promijeniti filtere ili pojam pretrage.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
