'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import MapboxInput from '@/components/ui/DynamicClientInput';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';

export default function PriceSimulator() {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [useNow, setUseNow] = useState(true);
  const [isLoggedIn] = useState(true); // simulation: forcé à true pour tests
  const [result, setResult] = useState<{
    distanceKm: number;
    durationMin: number;
    price: number;
  } | null>(null);

  const getCoordinates = async (address: string) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    const data = await res.json();
    return data.features?.[0]?.center || null;
  };

  const handleEstimate = async () => {
    if (!isLoggedIn) {
      alert("Veuillez vous connecter pour voir l'estimation du prix.");
      return;
    }

    const departureCoords = await getCoordinates(departure);
    const arrivalCoords = await getCoordinates(arrival);

    if (!departureCoords || !arrivalCoords) {
      alert("Adresse non reconnue. Veuillez réessayer.");
      return;
    }

    const url = `${DIRECTIONS_URL}/${departureCoords.join(',')};${arrivalCoords.join(',')}?access_token=${MAPBOX_TOKEN}&overview=false`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || !data.routes[0]) {
      alert("Impossible de calculer l’itinéraire.");
      return;
    }

    const route = data.routes[0];
    const distanceKm = route.distance / 1000;
    const durationMin = route.duration / 60;

    const baseFare = 5;
    const perKm = 1.2;
    const perMin = 0.3;
    const price = Math.round((baseFare + distanceKm * perKm + durationMin * perMin) * 100) / 100;

    setResult({ distanceKm, durationMin, price });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Estimez votre trajet</h2>

      <MapboxInput
        name="departure"
        value={departure}
        onChange={setDeparture}
        placeholder="Lieu de départ"
      />

      <MapboxInput
        name="arrival"
        value={arrival}
        onChange={setArrival}
        placeholder="Lieu d’arrivée"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          className="w-full border border-gray-300 p-2 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Heure</label>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant={useNow ? 'primary' : 'secondary'}
            onClick={() => {
              setUseNow(true);
              setHour(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }}
          >
            Maintenant
          </Button>
          <Button
            variant={!useNow ? 'primary' : 'secondary'}
            onClick={() => {
              setUseNow(false);
              setHour('');
            }}
          >
            Plus tard
          </Button>
        </div>
        {!useNow && (
          <input
            type="time"
            className="w-full border border-gray-300 p-2 rounded-lg"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          />
        )}
      </div>

      <Button fullWidth onClick={handleEstimate}>
        Estimer le prix
      </Button>

      {result && (
        <div className="bg-gray-100 p-4 mt-4 rounded-lg">
          <p><strong>Distance :</strong> {result.distanceKm.toFixed(1)} km</p>
          <p><strong>Durée :</strong> {result.durationMin.toFixed(0)} minutes</p>
          <p><strong>Prix estimé :</strong> {result.price.toFixed(2)} €</p>
        </div>
      )}
    </div>
  );
}
