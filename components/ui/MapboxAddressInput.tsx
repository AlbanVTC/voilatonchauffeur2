'use client';

import { AddressAutofill } from '@mapbox/search-js-react';

interface MapboxAddressInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export default function MapboxAddressInput({
  label,
  name,
  value,
  onChange,
}: MapboxAddressInputProps) {
  return (
    <div className="mb-6 relative z-10">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}>
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="street-address"
          placeholder="Saisir une adresse"
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
      </AddressAutofill>
    </div>
  );
}
