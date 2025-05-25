'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import LoginModal from '@/components/ui/LoginModal';

const MapboxAddressInput = dynamic(
  () => import('@/components/ui/MapboxAddressInput'),
  { ssr: false }
);

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';

export default function PriceSimulator() {
  const router = useRouter();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  // Date initialisée au jour courant
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [hour, setHour] = useState('');
  const [useNow, setUseNow] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const getCoordinates = async (addr: string) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        addr
      )}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    const data = await res.json();
    return (data.features?.[0]?.center as [number, number]) || null;
  };

  const handleEstimate = async () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (!departure || !arrival || !date || (!useNow && !hour)) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    let selectedHour = hour;
    if (useNow) {
      const now = new Date();
      selectedHour = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHour(selectedHour);
    }

    const dep = await getCoordinates(departure);
    const arr = await getCoordinates(arrival);
    if (!dep || !arr) {
      alert('Adresse invalide');
      return;
    }

    const routeRes = await fetch(
      `${DIRECTIONS_URL}/${dep.join(',')};${arr.join(
        ','
      )}?access_token=${MAPBOX_TOKEN}&overview=false`
    );
    const routeData = await routeRes.json();
    const route = routeData.routes?.[0];
    if (!route) {
      alert('Aucun itinéraire trouvé.');
      return;
    }

    const distance = (route.distance / 1000).toFixed(1);
    const duration = Math.round(route.duration / 60).toString();
    const price = (5 + parseFloat(distance) * 1.2 + parseFloat(duration) * 0.3).toFixed(2);

    router.push(
      `/reservation?departure=${encodeURIComponent(departure)}` +
        `&arrival=${encodeURIComponent(arrival)}` +
        `&date=${date}&hour=${selectedHour}` +
        `&distance=${distance}&duration=${duration}&price=${price}`
    );
  };

  // Met à jour l'heure initiale si useNow est activé
  useEffect(() => {
    if (useNow) {
      const now = new Date();
      setHour(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [useNow]);

  return (
    <>
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setShowLogin(false);
          handleEstimate();
        }}
      />

      <div className="max-w-md mx-auto p-6 bg-blue-800 text-white rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-semibold text-center">Estimez votre trajet</h2>

        <MapboxAddressInput
          label="Départ"
          name="departure"
          value={departure}
          onChange={setDeparture}
        />
        <MapboxAddressInput
          label="Destination"
          name="arrival"
          value={arrival}
          onChange={setArrival}
        />

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded-lg text-gray-800"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Heure</label>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant={useNow ? 'primary' : 'secondary'}
              onClick={() => setUseNow(true)}
            >
              Maintenant
            </Button>
            <Button
              variant={!useNow ? 'primary' : 'secondary'}
              onClick={() => setUseNow(false)}
            >
              Plus tard
            </Button>
          </div>
          {!useNow && (
            <input
              type="time"
              className="w-full border border-gray-300 p-2 rounded-lg text-gray-800"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
          )}
        </div>

        <Button
          fullWidth
          onClick={handleEstimate}
          disabled={!departure || !arrival || !date || (!useNow && !hour)}
        >
          Estimer le prix
        </Button>
      </div>
    </>
  );
}
