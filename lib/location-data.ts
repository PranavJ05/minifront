import { readdir, readFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(
  process.cwd(),
  "node_modules",
  "@countrystatecity",
  "countries",
  "dist",
  "data",
);

type CountryRecord = {
  name: string;
  iso2: string;
  latitude: string;
  longitude: string;
};

type StateRecord = {
  name: string;
  iso2: string;
  latitude: string | null;
  longitude: string | null;
};

type CityRecord = {
  name: string;
  latitude: string | null;
  longitude: string | null;
};

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function findCountryDir(countryCode: string) {
  const entries = await readdir(DATA_DIR, { withFileTypes: true });
  const match = entries.find(
    (entry) =>
      entry.isDirectory() &&
      entry.name.toUpperCase().endsWith(`-${countryCode.toUpperCase()}`),
  );

  return match?.name || null;
}

async function findStateDir(countryDir: string, stateCode: string) {
  const countryPath = path.join(DATA_DIR, countryDir);
  const entries = await readdir(countryPath, { withFileTypes: true });
  const match = entries.find(
    (entry) =>
      entry.isDirectory() &&
      entry.name.toUpperCase().endsWith(`-${stateCode.toUpperCase()}`),
  );

  return match?.name || null;
}

export async function getCountryOptions() {
  return readJsonFile<CountryRecord[]>(path.join(DATA_DIR, "countries.json"));
}

export async function getStateOptions(countryCode: string) {
  const countryDir = await findCountryDir(countryCode);
  if (!countryDir) return [];

  return readJsonFile<StateRecord[]>(path.join(DATA_DIR, countryDir, "states.json"));
}

export async function getCityOptions(countryCode: string, stateCode: string) {
  const countryDir = await findCountryDir(countryCode);
  if (!countryDir) return [];

  const stateDir = await findStateDir(countryDir, stateCode);
  if (!stateDir) return [];

  return readJsonFile<CityRecord[]>(
    path.join(DATA_DIR, countryDir, stateDir, "cities.json"),
  );
}
