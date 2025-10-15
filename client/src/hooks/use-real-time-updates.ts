import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { GlasackoMjesto, Anomalija } from '@shared/schema';

export function useRealTimeUpdates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const simulateDataUpdate = useCallback(() => {
    // Ažuriraj glasačka mjesta sa random promjenama
    queryClient.setQueryData(['/api/glasacka-mjesta'], (oldData: GlasackoMjesto[] | undefined) => {
      if (!oldData) return oldData;

      return oldData.map(mjesto => {
        // Random šansa da se mjesto ažurira (20%)
        if (Math.random() > 0.8) {
          const dodatniGlasovi = Math.floor(Math.random() * 15) + 1;
          const noviGlasalo = Math.min(mjesto.glasalo + dodatniGlasovi, mjesto.brojBiraca);
          const novaIzlaznost = ((noviGlasalo / mjesto.brojBiraca) * 100).toFixed(2);
          
          // Distribucija glasova
          const validni = Math.floor(noviGlasalo * 0.97);
          const nevazeci = Math.floor(noviGlasalo * 0.02);
          const sporni = noviGlasalo - validni - nevazeci;

          // Ažuriraj autentifikacije
          const dodatneUspjesne = dodatniGlasovi;
          const dodatneNeuspjesne = Math.floor(Math.random() * 3);
          const dodatneBlokirane = Math.random() > 0.9 ? 1 : 0;

          return {
            ...mjesto,
            glasalo: noviGlasalo,
            izlaznost: novaIzlaznost,
            validnihGlasova: validni,
            nevazeciGlasova: nevazeci,
            spornihGlasova: sporni,
            autentifikacije: {
              ...mjesto.autentifikacije,
              uspjesne: mjesto.autentifikacije.uspjesne + dodatneUspjesne,
              neuspjesne: mjesto.autentifikacije.neuspjesne + dodatneNeuspjesne,
              blokirane: mjesto.autentifikacije.blokirane + dodatneBlokirane,
            },
            zadnjeAzuriranje: new Date(),
          };
        }
        return mjesto;
      });
    });

    // Random šansa za novu anomaliju (5%)
    if (Math.random() > 0.95) {
      const glasackaMjesta = queryClient.getQueryData<GlasackoMjesto[]>(['/api/glasacka-mjesta']);
      if (glasackaMjesta && glasackaMjesta.length > 0) {
        const randomMjesto = glasackaMjesta[Math.floor(Math.random() * glasackaMjesta.length)];
        
        const anomalijeOpisi = [
          'Privremeni prekid veze',
          'Sporije vrijeme autentifikacije',
          'Povećan broj neuspješnih pokušaja',
          'Problemi sa čitačem biometrije',
        ];

        const novaAnomalija: Anomalija = {
          id: `anomalija-${Date.now()}`,
          glasackoMjestoId: randomMjesto.id,
          tip: Math.random() > 0.7 ? 'kritično' : 'upozorenje',
          opis: anomalijeOpisi[Math.floor(Math.random() * anomalijeOpisi.length)],
          vrijeme: new Date().toLocaleTimeString('bs', { hour: '2-digit', minute: '2-digit' }),
          status: 'aktivno',
          createdAt: new Date(),
        };

        queryClient.setQueryData(['/api/anomalije'], (oldData: Anomalija[] | undefined) => {
          if (!oldData) return [novaAnomalija];
          return [...oldData, novaAnomalija];
        });

        // Prikaži toast notifikaciju
        toast({
          title: novaAnomalija.tip === 'kritično' ? '🔴 Nova kritična anomalija' : '⚠️ Novo upozorenje',
          description: `${novaAnomalija.glasackoMjestoId}: ${novaAnomalija.opis}`,
          variant: novaAnomalija.tip === 'kritično' ? 'destructive' : 'default',
        });
      }
    }
  }, [queryClient, toast]);

  useEffect(() => {
    // Simuliraj ažuriranje svakih 3-5 sekundi
    const getRandomInterval = () => Math.random() * 2000 + 3000; // 3-5 sekundi

    let timeoutId: NodeJS.Timeout;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        simulateDataUpdate();
        scheduleNext();
      }, getRandomInterval());
    };

    scheduleNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [simulateDataUpdate]);
}
