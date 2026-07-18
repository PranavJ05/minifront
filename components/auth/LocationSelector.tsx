"use client";

import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <MapPin className="h-4 w-4 text-muted-foreground/60" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Location Details
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Country <span className="text-destructive">*</span>
        </label>
        <Select
          value={selectedCountryCode}
          onValueChange={(v) => v !== null && onCountryChange(v)}
          disabled={loading.countries}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue
              placeholder={
                loading.countries ? "Loading countries..." : "Select country"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.iso2} value={country.iso2}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-xs text-destructive">{errors.country}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          State <span className="text-destructive">*</span>
        </label>
        <Select
          value={selectedStateCode}
          onValueChange={(v) => v !== null && onStateChange(v)}
          disabled={!selectedCountryCode || loading.states}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue
              placeholder={
                !selectedCountryCode
                  ? "Select country first"
                  : loading.states
                    ? "Loading states..."
                    : "Select state"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.iso2} value={state.iso2}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && (
          <p className="text-xs text-destructive">{errors.state}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          City <span className="text-destructive">*</span>
        </label>
        <Select
          value={selectedCity}
          onValueChange={(v) => v !== null && onCityChange(v)}
          disabled={!selectedStateCode || loading.cities}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue
              placeholder={
                !selectedStateCode
                  ? "Select state first"
                  : loading.cities
                    ? "Loading cities..."
                    : "Select city"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.city && (
          <p className="text-xs text-destructive">{errors.city}</p>
        )}
      </div>

      {errors.location && (
        <Alert variant="destructive">
          <AlertDescription>{errors.location}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
