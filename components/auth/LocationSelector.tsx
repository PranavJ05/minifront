"use client";

import { MapPin } from "lucide-react";

interface LocationCountry {
  name: string;
  iso2: string;
  latitude?: string | null;
  longitude?: string | null;
}

interface LocationState {
  name: string;
  iso2: string;
  latitude?: string | null;
  longitude?: string | null;
}

interface LocationCity {
  name: string;
  latitude?: string | null;
  longitude?: string | null;
}

interface LocationSelectorProps {
  countries: LocationCountry[];
  states: LocationState[];
  cities: LocationCity[];
  selectedCountryCode: string;
  selectedStateCode: string;
  selectedCity: string;
  loading: {
    countries: boolean;
    states: boolean;
    cities: boolean;
  };
  errors: Record<string, string>;
  onCountryChange: (countryCode: string) => void;
  onStateChange: (stateCode: string) => void;
  onCityChange: (city: string) => void;
}

export default function LocationSelector({
  countries,
  states,
  cities,
  selectedCountryCode,
  selectedStateCode,
  selectedCity,
  loading,
  errors,
  onCountryChange,
  onStateChange,
  onCityChange,
}: LocationSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-navy-600" />
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
          Location Details
        </h3>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
          Country *
        </label>
        <select
          value={selectedCountryCode}
          onChange={(e) => onCountryChange(e.target.value)}
          className="input-field cursor-pointer"
          disabled={loading.countries}
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country.iso2} value={country.iso2}>
              {country.name}
            </option>
          ))}
        </select>
        {loading.countries && (
          <p className="mt-1 text-xs text-gray-500">Loading countries...</p>
        )}
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
          State *
        </label>
        <select
          value={selectedStateCode}
          onChange={(e) => onStateChange(e.target.value)}
          className="input-field cursor-pointer"
          disabled={!selectedCountryCode || loading.states}
        >
          <option value="">
            {!selectedCountryCode
              ? "Select country first"
              : loading.states
              ? "Loading states..."
              : "Select state"}
          </option>
          {states.map((state) => (
            <option key={state.iso2} value={state.iso2}>
              {state.name}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="mt-1 text-sm text-red-600">{errors.state}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">
          City *
        </label>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="input-field cursor-pointer"
          disabled={!selectedStateCode || loading.cities}
        >
          <option value="">
            {!selectedStateCode
              ? "Select state first"
              : loading.cities
              ? "Loading cities..."
              : "Select city"}
          </option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      {errors.location && (
        <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded text-sm">
          {errors.location}
        </div>
      )}
    </div>
  );
}
