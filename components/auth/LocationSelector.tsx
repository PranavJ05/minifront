"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface LocationCountry {
  id: number;
  name: string;
  iso2?: string;
  latitude?: string;
  longitude?: string;
}

export interface LocationState {
  id: number;
  name: string;
  iso2?: string;
  latitude?: string;
  longitude?: string;
}

export interface LocationCity {
  id: number;
  name: string;
  latitude?: string;
  longitude?: string;
}

interface LocationSelectorProps {
  country: string;
  state: string;
  city: string;
  errors?: Record<string, string>;
  onCountryChange: (countryName: string, countryObj?: LocationCountry) => void;
  onStateChange: (stateName: string, stateObj?: LocationState) => void;
  onCityChange: (cityName: string, cityObj?: LocationCity) => void;
}

export default function LocationSelector({
  country,
  state,
  city,
  errors = {},
  onCountryChange,
  onStateChange,
  onCityChange,
}: LocationSelectorProps) {
  const [countriesList, setCountriesList] = useState<LocationCountry[]>([]);
  const [statesList, setStatesList] = useState<LocationState[]>([]);
  const [citiesList, setCitiesList] = useState<LocationCity[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    let mounted = true;
    GetCountries()
      .then((res: any[]) => {
        if (!mounted) return;
        const list: LocationCountry[] = (res || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          iso2: c.iso2,
          latitude: c.latitude,
          longitude: c.longitude,
        }));
        setCountriesList(list);
      })
      .catch((err: unknown) => console.error("Failed to load countries:", err))
      .finally(() => {
        if (mounted) setLoadingCountries(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!country) {
      setStatesList([]);
      setCitiesList([]);
      return;
    }

    const foundCountry = countriesList.find(
      (c) => c.name.toLowerCase() === country.toLowerCase(),
    );
    if (!foundCountry) return;

    setLoadingStates(true);
    GetState(foundCountry.id)
      .then((res: any[]) => {
        if (!mounted) return;
        const list: LocationState[] = (res || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          iso2: s.iso2,
          latitude: s.latitude,
          longitude: s.longitude,
        }));
        setStatesList(list);
      })
      .catch((err: unknown) => console.error("Failed to load states:", err))
      .finally(() => {
        if (mounted) setLoadingStates(false);
      });

    return () => {
      mounted = false;
    };
  }, [country, countriesList]);

  useEffect(() => {
    let mounted = true;
    if (!country || !state) {
      setCitiesList([]);
      return;
    }

    const foundCountry = countriesList.find(
      (c) => c.name.toLowerCase() === country.toLowerCase(),
    );
    const foundState = statesList.find(
      (s) => s.name.toLowerCase() === state.toLowerCase(),
    );

    if (!foundCountry || !foundState) return;

    setLoadingCities(true);
    GetCity(foundCountry.id, foundState.id)
      .then((res: any[]) => {
        if (!mounted) return;
        const list: LocationCity[] = (res || []).map((ct: any) => ({
          id: ct.id,
          name: ct.name,
          latitude: ct.latitude,
          longitude: ct.longitude,
        }));
        setCitiesList(list);
      })
      .catch((err: unknown) => console.error("Failed to load cities:", err))
      .finally(() => {
        if (mounted) setLoadingCities(false);
      });

    return () => {
      mounted = false;
    };
  }, [country, state, countriesList, statesList]);

  const handleCountrySelect = (name: string) => {
    const selectedObj = countriesList.find((c) => c.name === name);
    onCountryChange(name, selectedObj);
  };

  const handleStateSelect = (name: string) => {
    const selectedObj = statesList.find((s) => s.name === name);
    onStateChange(name, selectedObj);
  };

  const handleCitySelect = (name: string) => {
    const selectedObj = citiesList.find((c) => c.name === name);
    onCityChange(name, selectedObj);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-muted-foreground/60" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Location Details
        </h3>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Country <span className="text-destructive">*</span>
        </Label>
        <Select
          value={country}
          onValueChange={(v) => v && handleCountrySelect(v)}
          disabled={loadingCountries}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue
              placeholder={
                loadingCountries ? "Loading countries..." : "Select country"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {countriesList.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-xs text-destructive">{errors.country}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          State <span className="text-destructive">*</span>
        </Label>
        <Select
          value={state}
          onValueChange={(v) => v && handleStateSelect(v)}
          disabled={!country || loadingStates}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue
              placeholder={
                !country
                  ? "Select country first"
                  : loadingStates
                    ? "Loading states..."
                    : "Select state"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {statesList.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && (
          <p className="text-xs text-destructive">{errors.state}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          City <span className="text-destructive">*</span>
        </Label>
        <Select
          value={city}
          onValueChange={(v) => v && handleCitySelect(v)}
          disabled={!state || loadingCities}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-muted/30 border-border cursor-pointer">
            <SelectValue
              placeholder={
                !state
                  ? "Select state first"
                  : loadingCities
                    ? "Loading cities..."
                    : "Select city"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {citiesList.map((ct) => (
              <SelectItem key={ct.id} value={ct.name}>
                {ct.name}
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
