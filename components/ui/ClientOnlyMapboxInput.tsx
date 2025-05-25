'use client';

import { AddressAutofill } from '@mapbox/search-js-react';
import { useRef } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <AddressAutofill
      accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
      onRetrieve={(e) => {
        const full = inputRef.current?.value;
        if (full) onChange(full); // met à jour React après sélection suggestion
      }}
    >
      <input
        ref={inputRef}
        name={name}
        defaultValue={value} // ⚠️ non contrôlé → permet Mapbox d'écrire
        onChange={(e) => onChange(e.target.value)}
        autoComplete="street-address"
        placeholder={placeholder}
        className="w-full border border-gray-300 p-2 rounded-lg"
      />
    </AddressAutofill>
  );
}
