import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlasackoMjesto } from "@shared/schema";
import 'leaflet/dist/leaflet.css';

interface MapaPanelProps {
  glasackaMjesta: GlasackoMjesto[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'aktivno': return '#10B981'; // zelena
    case 'upozorenje': return '#F59E0B'; // žuta
    case 'kriticno': return '#EF4444'; // crvena
    case 'neaktivno': return '#9CA3AF'; // siva
    default: return '#9CA3AF';
  }
};

export function MapaPanel({ glasackaMjesta }: MapaPanelProps) {
  const fbihMjesta = glasackaMjesta.filter(m => m.entitet === 'FBiH').length;
  const rsMjesta = glasackaMjesta.filter(m => m.entitet === 'RS').length;
  const bdMjesta = glasackaMjesta.filter(m => m.entitet === 'BD').length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Pregled po entitetima</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-[280px] relative">
          <MapContainer
            center={[43.8564, 18.4131]}
            zoom={7}
            className="h-full w-full z-0"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {glasackaMjesta.map((mjesto) => (
              <CircleMarker
                key={mjesto.id}
                center={mjesto.koordinate as [number, number]}
                radius={6}
                pathOptions={{
                  fillColor: getStatusColor(mjesto.status),
                  color: getStatusColor(mjesto.status),
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.8,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{mjesto.naziv}</p>
                    <p className="text-muted-foreground text-xs">{mjesto.grad}, {mjesto.opstina}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs">Izlaznost: <span className="font-medium">{mjesto.izlaznost}%</span></p>
                      <p className="text-xs">Glasalo: <span className="font-medium">{mjesto.glasalo}/{mjesto.brojBiraca}</span></p>
                      <Badge 
                        variant={mjesto.status === 'aktivno' ? 'default' : mjesto.status === 'kriticno' ? 'destructive' : 'secondary'}
                        className="text-xs mt-1"
                      >
                        {mjesto.status}
                      </Badge>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        <div className="p-4 pt-3 border-t bg-muted/30">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">FBiH</p>
              <p className="text-lg font-bold text-foreground" data-testid="text-fbih-count">{fbihMjesta}</p>
              <p className="text-xs text-muted-foreground">mjesta</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">RS</p>
              <p className="text-lg font-bold text-foreground" data-testid="text-rs-count">{rsMjesta}</p>
              <p className="text-xs text-muted-foreground">mjesta</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">BD</p>
              <p className="text-lg font-bold text-foreground" data-testid="text-bd-count">{bdMjesta}</p>
              <p className="text-xs text-muted-foreground">mjesta</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
