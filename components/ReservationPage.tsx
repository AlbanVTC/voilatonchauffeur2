'use client';

import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ReservationPage() {
  const params = useSearchParams();
  const departure = params.get('departure') ?? '';
  const arrival = params.get('arrival') ?? '';
  const date = params.get('date') ?? '';
  const hour = params.get('hour') ?? '';
  const distance = params.get('distance') ?? '';
  const duration = params.get('duration') ?? '';
  const price = params.get('price') ?? '';

  const handleConfirm = () => {
    alert('Réservation confirmée !');
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Récapitulatif de votre course</h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Départ</p>
            <p className="text-lg font-medium">{departure}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Destination</p>
            <p className="text-lg font-medium">{arrival}</p>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-medium">{date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Heure</p>
              <p className="text-lg font-medium">{hour}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-lg font-medium">{distance} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Durée</p>
              <p className="text-lg font-medium">{duration} min</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Prix estimé</p>
            <p className="text-2xl font-bold text-green-600">{price} €</p>
          </div>
        </div>

        <Button fullWidth onClick={handleConfirm}>
          Confirmer la réservation
        </Button>
      </div>
    </main>
  );
}
