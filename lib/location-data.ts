import { getCountries, getStatesOfCountry, getCitiesOfState } from "@countrystatecity/countries";

export async function getCountryOptions() {
  const countries = await getCountries();
  return (countries || []).map((country) => ({
    name: country.name,
    iso2: country.iso2,
    latitude: country.latitude || null,
    longitude: country.longitude || null,
  }));
}

export async function getStateOptions(countryCode: string) {
  if (!countryCode) return [];
  const states = await getStatesOfCountry(countryCode.toUpperCase());
  return (states || []).map((state) => ({
    name: state.name,
    iso2: state.iso2,
    latitude: state.latitude || null,
    longitude: state.longitude || null,
  }));
}

export async function getCityOptions(countryCode: string, stateCode: string) {
  if (!countryCode || !stateCode) return [];
  const cities = await getCitiesOfState(countryCode.toUpperCase(), stateCode.toUpperCase());
  return (cities || []).map((city) => ({
    name: city.name,
    latitude: city.latitude || null,
    longitude: city.longitude || null,
  }));
}
