import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, FileText, FolderOpen } from "lucide-react";
import { GlasackoMjesto } from "@shared/schema";

interface GlasackaMjestaTabelaProps {
  glasackaMjesta: GlasackoMjesto[];
  onDetalji: (mjesto: GlasackoMjesto) => void;
}

const getStatusVariant = (status: string): "default" | "destructive" | "secondary" => {
  switch (status) {
    case 'aktivno': return 'default';
    case 'kriticno': return 'destructive';
    default: return 'secondary';
  }
};

export function GlasackaMjestaTabela({ glasackaMjesta, onDetalji }: GlasackaMjestaTabelaProps) {
  const [search, setSearch] = useState("");
  const [entitetFilter, setEntitetFilter] = useState<string>("svi");
  const [statusFilter, setStatusFilter] = useState<string>("svi");

  const filteredMjesta = useMemo(() => {
    return glasackaMjesta.filter(mjesto => {
      const matchesSearch = 
        mjesto.id.toLowerCase().includes(search.toLowerCase()) ||
        mjesto.naziv.toLowerCase().includes(search.toLowerCase()) ||
        mjesto.opstina.toLowerCase().includes(search.toLowerCase()) ||
        mjesto.grad.toLowerCase().includes(search.toLowerCase());
      
      const matchesEntitet = entitetFilter === "svi" || mjesto.entitet === entitetFilter;
      const matchesStatus = statusFilter === "svi" || mjesto.status === statusFilter;

      return matchesSearch && matchesEntitet && matchesStatus;
    });
  }, [glasackaMjesta, search, entitetFilter, statusFilter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-base font-semibold">Detaljan pregled po glasačkom mjestu</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pretraži..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[200px]"
                data-testid="input-search"
              />
            </div>
            
            <Select value={entitetFilter} onValueChange={setEntitetFilter}>
              <SelectTrigger className="w-[130px]" data-testid="select-entitet">
                <SelectValue placeholder="Entitet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svi">Svi entiteti</SelectItem>
                <SelectItem value="FBiH">FBiH</SelectItem>
                <SelectItem value="RS">RS</SelectItem>
                <SelectItem value="BD">BD</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]" data-testid="select-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svi">Svi statusi</SelectItem>
                <SelectItem value="aktivno">Aktivno</SelectItem>
                <SelectItem value="upozorenje">Upozorenje</SelectItem>
                <SelectItem value="kriticno">Kritično</SelectItem>
                <SelectItem value="neaktivno">Neaktivno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Naziv i lokacija</TableHead>
                <TableHead className="w-[160px]">Izlaznost</TableHead>
                <TableHead className="w-[140px]">Glasovi</TableHead>
                <TableHead className="w-[120px]">Autentif.</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[140px] text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMjesta.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nema rezultata
                  </TableCell>
                </TableRow>
              ) : (
                filteredMjesta.map((mjesto) => (
                  <TableRow key={mjesto.id} className="hover-elevate" data-testid={`row-${mjesto.id}`}>
                    <TableCell className="font-mono text-sm">{mjesto.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{mjesto.naziv}</p>
                        <p className="text-xs text-muted-foreground">{mjesto.grad}, {mjesto.opstina} ({mjesto.entitet})</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">{mjesto.izlaznost}%</span>
                          <span className="text-muted-foreground">{mjesto.glasalo}/{mjesto.brojBiraca}</span>
                        </div>
                        <Progress value={parseFloat(mjesto.izlaznost)} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <p><span className="text-success">✓</span> {mjesto.validnihGlasova}</p>
                        <p><span className="text-danger">✗</span> {mjesto.nevazeciGlasova}</p>
                        <p><span className="text-warning">!</span> {mjesto.spornihGlasova}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <p className="text-success">{mjesto.autentifikacije.uspjesne}</p>
                        <p className="text-danger">{mjesto.autentifikacije.neuspjesne}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(mjesto.status)} className="text-xs">
                        {mjesto.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDetalji(mjesto)}
                          data-testid={`button-detalji-${mjesto.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-izvjestaj-${mjesto.id}`}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-audit-${mjesto.id}`}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Prikazano {filteredMjesta.length} od {glasackaMjesta.length} glasačkih mjesta</p>
        </div>
      </CardContent>
    </Card>
  );
}
