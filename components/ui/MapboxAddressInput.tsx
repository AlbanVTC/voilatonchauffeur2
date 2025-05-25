'use client';

import { useState, useEffect, useRef } from 'react';

interface MapboxFeature {
  place_name: string;
}

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export default function MapboxAddressInput({
  label,
  name,
  value,
  onChange,
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.length < 3) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${GEOCODING_URL}/${encodeURIComponent(inputValue)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=fr&limit=5`,
          { signal }
        );
        if (!signal.aborted) {
          const data = await res.json();
          setSuggestions(data.features || []);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [inputValue]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSelect = (feature: MapboxFeature) => {
    const full = feature.place_name;
    setInputValue(full);
    onChange(full);
    setSuggestions([]);
  };

  return (
    <div className="mb-4 relative" ref={containerRef}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Saisir une adresse"
        autoComplete="off"
        className="w-full border border-gray-300 p-2 rounded-lg"
      />
      {suggestions.length > 0 && (
        <ul className="absolute top-full z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow max-h-60 overflow-auto">
          {suggestions.map((feat, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(feat)}
            >
              {feat.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
