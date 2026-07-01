import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export interface LocationCountry {
  name: string;
  iso2: string;
  latitude?: string | null;
  longitude?: string | null;
}

export interface LocationState {
  name: string;
  iso2: string;
  latitude?: string | null;
  longitude?: string | null;
}

export interface LocationCity {
  name: string;
  latitude?: string | null;
  longitude?: string | null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export function useCountriesQuery() {
  return useQuery({
    queryKey: queryKeys.location.countries,
    queryFn: () => fetchJson<LocationCountry[]>("/api/location/countries"),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useStatesQuery(countryCode: string) {
  return useQuery({
    queryKey: queryKeys.location.states(countryCode),
    queryFn: () =>
      fetchJson<LocationState[]>(`/api/location/states?countryCode=${countryCode}`),
    enabled: !!countryCode,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useCitiesQuery(countryCode: string, stateCode: string) {
  return useQuery({
    queryKey: queryKeys.location.cities(countryCode, stateCode),
    queryFn: () =>
      fetchJson<LocationCity[]>(
        `/api/location/cities?countryCode=${countryCode}&stateCode=${stateCode}`,
      ),
    enabled: !!countryCode && !!stateCode,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
