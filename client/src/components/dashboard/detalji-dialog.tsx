import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MapPin, Users, CheckCircle, XCircle, Shield, Clock, AlertTriangle } from "lucide-react";
import { GlasackoMjesto } from "@shared/schema";

interface DetaljiDialogProps {
  mjesto: GlasackoMjesto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const satniPodaci = [
  { sat: '08:00', glasalo: 45 },
  { sat: '09:00', glasalo: 123 },
  { sat: '10:00', glasalo: 215 },
  { sat: '11:00', glasalo: 287 },
  { sat: '12:00', glasalo: 356 },
  { sat: '13:00', glasalo: 445 },
  { sat: '14:00', glasalo: 578 },
  { sat: '15:00', glasalo: 698 },
];

const autentifikacijeTimeline = [
  { vrijeme: '15:32', tip: 'uspješna', korisnik: 'Birač #4532', detalj: 'Biometrijska autentifikacija' },
  { vrijeme: '15:31', tip: 'uspješna', korisnik: 'Birač #4531', detalj: 'ID kartica' },
  { vrijeme: '15:30', tip: 'neuspješna', korisnik: 'Pokušaj #892', detalj: 'Neispravna biometrija' },
  { vrijeme: '15:29', tip: 'uspješna', korisnik: 'Birač #4530', detalj: 'Biometrijska autentifikacija' },
  { vrijeme: '15:28', tip: 'blokirana', korisnik: 'Pokušaj #891', detalj: 'Previše neuspješnih pokušaja' },
  { vrijeme: '15:27', tip: 'uspješna', korisnik: 'Birač #4529', detalj: 'ID kartica' },
];

const auditLog = [
  { vrijeme: '15:30:45', korisnik: 'Revizor: A. Hasanović', akcija: 'Pregled statusa', tip: 'info' },
  { vrijeme: '14:20:12', korisnik: 'Sistem', akcija: 'Automatsko ažuriranje podataka', tip: 'system' },
  { vrijeme: '13:45:33', korisnik: 'Revizor: M. Kovač', akcija: 'Izmjena anomalije - označeno kao riješeno', tip: 'edit' },
  { vrijeme: '12:15:22', korisnik: 'Sistem', akcija: 'Upozorenje: Visoka stopa neuspješnih autentifikacija', tip: 'warning' },
  { vrijeme: '11:00:00', korisnik: 'Sistem', akcija: 'Početak rada glasačkog mjesta', tip: 'system' },
];

export function DetaljiDialog({ mjesto, open, onOpenChange }: DetaljiDialogProps) {
  if (!mjesto) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktivno': return 'bg-success text-white';
      case 'upozorenje': return 'bg-warning text-white';
      case 'kriticno': return 'bg-danger text-white';
      case 'neaktivno': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">{mjesto.naziv}</DialogTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{mjesto.grad}, {mjesto.opstina} ({mjesto.entitet})</span>
                <span>•</span>
                <span className="font-mono">{mjesto.id}</span>
              </div>
            </div>
            <Badge className={getStatusColor(mjesto.status)}>
              {mjesto.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="opste" className="flex-1">
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="opste" data-testid="tab-opste">Opšte</TabsTrigger>
              <TabsTrigger value="statistike" data-testid="tab-statistike">Statistike</TabsTrigger>
              <TabsTrigger value="autentifikacije" data-testid="tab-autentifikacije">Autentifikacije</TabsTrigger>
              <TabsTrigger value="validacija" data-testid="tab-validacija">Validacija</TabsTrigger>
              <TabsTrigger value="audit" data-testid="tab-audit">Audit Log</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="px-6 py-4">
              {/* Opšte informacije */}
              <TabsContent value="opste" className="mt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Osnovni podaci</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Broj birača:</span>
                        <span className="font-medium">{mjesto.brojBiraca.toLocaleString('bs')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Glasalo:</span>
                        <span className="font-medium">{mjesto.glasalo.toLocaleString('bs')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Izlaznost:</span>
                        <span className="font-medium">{mjesto.izlaznost}%</span>
                      </div>
                      <Progress value={parseFloat(mjesto.izlaznost)} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Kontakt informacije</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telefon:</span>
                        <span className="font-medium">+387 33 123 456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-xs">gm{mjesto.id.split('-')[1]}@cik.ba</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Koordinate:</span>
                        <span className="font-medium text-xs font-mono">{mjesto.koordinate[0]}, {mjesto.koordinate[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Članovi biračkog odbora</h3>
                  <div className="space-y-2">
                    {['Predsjednik: Haris Mustafić', 'Zamjenik: Amira Softić', 'Član: Petar Marković', 'Član: Jelena Nikolić'].map((clan, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{clan}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  Posljednje ažuriranje: {new Date(mjesto.zadnjeAzuriranje).toLocaleString('bs')}
                </div>
              </TabsContent>

              {/* Statistike glasanja */}
              <TabsContent value="statistike" className="mt-0 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-3">Graf izlaznosti po satima</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={satniPodaci}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="sat" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                        />
                        <Line type="monotone" dataKey="glasalo" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-sm mb-3">Distribucija glasova</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Validni glasovi</span>
                        <span className="font-medium">{mjesto.validnihGlasova} ({((mjesto.validnihGlasova / mjesto.glasalo) * 100).toFixed(1)}%)</span>
                      </div>
                      <Progress value={(mjesto.validnihGlasova / mjesto.glasalo) * 100} className="h-2 bg-success/20" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Nevažeći glasovi</span>
                        <span className="font-medium">{mjesto.nevazeciGlasova} ({((mjesto.nevazeciGlasova / mjesto.glasalo) * 100).toFixed(1)}%)</span>
                      </div>
                      <Progress value={(mjesto.nevazeciGlasova / mjesto.glasalo) * 100} className="h-2 bg-danger/20" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sporni glasovi</span>
                        <span className="font-medium">{mjesto.spornihGlasova} ({((mjesto.spornihGlasova / mjesto.glasalo) * 100).toFixed(1)}%)</span>
                      </div>
                      <Progress value={(mjesto.spornihGlasova / mjesto.glasalo) * 100} className="h-2 bg-warning/20" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Autentifikacije */}
              <TabsContent value="autentifikacije" className="mt-0 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-xs text-muted-foreground">Uspješne</span>
                    </div>
                    <p className="text-xl font-bold">{mjesto.autentifikacije.uspjesne}</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-warning" />
                      <span className="text-xs text-muted-foreground">Neuspješne</span>
                    </div>
                    <p className="text-xl font-bold">{mjesto.autentifikacije.neuspjesne}</p>
                  </div>
                  <div className="p-3 bg-danger/10 rounded-lg border border-danger/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-danger" />
                      <span className="text-xs text-muted-foreground">Blokirane</span>
                    </div>
                    <p className="text-xl font-bold">{mjesto.autentifikacije.blokirane}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Prosječno vrijeme autentifikacije:</span>
                  <span className="font-semibold text-sm">{mjesto.autentifikacije.prosjecnoVrijeme}</span>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-sm mb-3">Timeline autentifikacija</h3>
                  <div className="space-y-2">
                    {autentifikacijeTimeline.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-md hover-elevate border">
                        <div className="pt-1">
                          {item.tip === 'uspješna' && <CheckCircle className="h-4 w-4 text-success" />}
                          {item.tip === 'neuspješna' && <XCircle className="h-4 w-4 text-warning" />}
                          {item.tip === 'blokirana' && <Shield className="h-4 w-4 text-danger" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.korisnik}</span>
                            <span className="text-xs text-muted-foreground">{item.vrijeme}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.detalj}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Validacija glasova */}
              <TabsContent value="validacija" className="mt-0 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <p className="text-3xl font-bold text-success">{mjesto.validnihGlasova}</p>
                    <p className="text-sm text-muted-foreground mt-1">Validni glasovi</p>
                  </div>
                  <div className="text-center p-4 bg-danger/10 rounded-lg">
                    <p className="text-3xl font-bold text-danger">{mjesto.nevazeciGlasova}</p>
                    <p className="text-sm text-muted-foreground mt-1">Nevažeći glasovi</p>
                  </div>
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <p className="text-3xl font-bold text-warning">{mjesto.spornihGlasova}</p>
                    <p className="text-sm text-muted-foreground mt-1">Sporni glasovi</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-sm mb-3">Razlozi nevažećih listića</h3>
                  <div className="space-y-2">
                    {[
                      { razlog: 'Višestruko označavanje', broj: 8 },
                      { razlog: 'Neprepoznatljiva oznaka', broj: 5 },
                      { razlog: 'Oštećen listić', broj: 3 },
                      { razlog: 'Prazna koverata', broj: 2 },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                        <span className="text-sm">{item.razlog}</span>
                        <Badge variant="outline">{item.broj}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-sm mb-3">Sporni glasovi</h3>
                  <div className="space-y-2">
                    {mjesto.spornihGlasova > 0 ? (
                      Array.from({ length: Math.min(mjesto.spornihGlasova, 3) }, (_, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <span className="font-medium text-sm">Sporni glas #{i + 1}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Označavanje nije potpuno jasno - potrebna dodatna revizija
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">Nema spornih glasova</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Audit Log */}
              <TabsContent value="audit" className="mt-0 space-y-3">
                <div className="space-y-2">
                  {auditLog.map((log, i) => (
                    <div key={i} className="p-3 border rounded-lg hover-elevate">
                      <div className="flex items-start gap-3">
                        <div className="pt-1">
                          {log.tip === 'warning' && <AlertTriangle className="h-4 w-4 text-warning" />}
                          {log.tip === 'edit' && <span className="text-info">✏️</span>}
                          {log.tip === 'info' && <span className="text-muted-foreground">ℹ️</span>}
                          {log.tip === 'system' && <span className="text-muted-foreground">⚙️</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{log.korisnik}</span>
                            <span className="text-xs text-muted-foreground">{log.vrijeme}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.akcija}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
