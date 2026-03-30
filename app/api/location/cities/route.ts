import { NextRequest, NextResponse } from "next/server";
import { getCityOptions } from "@/lib/location-data";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get("countryCode");
  const stateCode = request.nextUrl.searchParams.get("stateCode");

  if (!countryCode || !stateCode) {
    return NextResponse.json(
      { message: "countryCode and stateCode are required" },
      { status: 400 },
    );
  }

  try {
    const cities = await getCityOptions(countryCode, stateCode);

    return NextResponse.json(
      cities
        .map((city) => ({
          name: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  } catch (error) {
    console.error("Failed to load cities:", error);
    return NextResponse.json(
      { message: "Failed to load cities" },
      { status: 500 },
    );
  }
}
