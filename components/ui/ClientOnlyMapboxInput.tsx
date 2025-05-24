'use client';

import { AddressAutofill } from '@mapbox/search-js-react';

interface Props {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ClientOnlyMapboxInput({
  name,
  value,
  onChange,
  placeholder = 'Adresse',
}: Props) {
  return (
    
    <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="street-address"
        placeholder={placeholder}
        className="w-full border border-gray-300 p-2 rounded-lg"
      />
    </AddressAutofill>
    
  );
  console.log("MAPBOX TOKEN:", process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
}
