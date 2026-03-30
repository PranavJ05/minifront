import { NextResponse } from "next/server";
import { getCountryOptions } from "@/lib/location-data";

export const runtime = "nodejs";

export async function GET() {
  try {
    const countries = await getCountryOptions();

    return NextResponse.json(
      countries
        .map((country) => ({
          name: country.name,
          iso2: country.iso2,
          latitude: country.latitude,
          longitude: country.longitude,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  } catch (error) {
    console.error("Failed to load countries:", error);
    return NextResponse.json(
      { message: "Failed to load countries" },
      { status: 500 },
    );
  }
}
