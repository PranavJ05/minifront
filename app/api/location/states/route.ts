import { NextRequest, NextResponse } from "next/server";
import { getStateOptions } from "@/lib/location-data";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get("countryCode");

  if (!countryCode) {
    return NextResponse.json(
      { message: "countryCode is required" },
      { status: 400 },
    );
  }

  try {
    const states = await getStateOptions(countryCode);

    return NextResponse.json(
      states
        .map((state) => ({
          name: state.name,
          iso2: state.iso2,
          latitude: state.latitude,
          longitude: state.longitude,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  } catch (error) {
    console.error("Failed to load states:", error);
    return NextResponse.json(
      { message: "Failed to load states" },
      { status: 500 },
    );
  }
}
