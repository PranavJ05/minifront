"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  RefreshCw,
  X,
  Briefcase,
  AlertCircle,
  Users,
  ChevronRight,
  Search,
  Maximize2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/fetcher";

interface AlumniMapPin {
  alumniId: number;
  name: string;
  profileImageUrl: string | null;
  email?: string | null;
  batchYear: number | null;
  department: string | null;
  courseName: string | null;
  profession: string | null;
  linkedinUrl: string | null;
  latitude: number;
  longitude: number;
  displayLocation: string | null;
  city: string | null;
  country: string | null;
}

const MAP_CENTER: [number, number] = [20.5937, 78.9629];
const MAP_ZOOM = 4;

const COMMON_CITY_COORDS: Record<string, [number, number]> = {
  kochi: [9.9312, 76.2673],
  ernakulam: [9.9816, 76.2999],
  trivandrum: [8.5241, 76.9366],
  thiruvananthapuram: [8.5241, 76.9366],
  calicut: [11.2588, 75.7804],
  kozhikode: [11.2588, 75.7804],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  mumbai: [19.076, 72.8777],
  delhi: [28.6139, 77.209],
  hyderabad: [17.385, 78.4867],
  pune: [18.5204, 73.8567],
  "san francisco": [37.7749, -122.4194],
  "new york": [40.7128, -74.006],
  london: [51.5074, -0.1278],
  singapore: [1.3521, 103.8198],
  dubai: [25.2048, 55.2708],
  kerala: [10.8505, 76.2711],
  india: [20.5937, 78.9629],
};

function resolveCoords(item: Record<string, unknown>): [number | null, number | null] {
  const rawLat = item.latitude;
  const rawLng = item.longitude;
  if (typeof rawLat === "number" && typeof rawLng === "number" && !isNaN(rawLat) && !isNaN(rawLng)) {
    return [rawLat, rawLng];
  }
  if (typeof rawLat === "string" && typeof rawLng === "string") {
    const parsedLat = parseFloat(rawLat);
    const parsedLng = parseFloat(rawLng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      return [parsedLat, parsedLng];
    }
  }

  const locStr = String(item.displayLocation || item.location || item.city || item.country || "").toLowerCase();
  for (const [key, coords] of Object.entries(COMMON_CITY_COORDS)) {
    if (locStr.includes(key)) {
      return coords;
    }
  }

  return [null, null];
}

export default function AlumniDirectoryMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const clusterGroup = useRef<any>(null);

  const [pins, setPins] = useState<AlumniMapPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AlumniMapPin | null>(null);
  const [clusterList, setClusterList] = useState<AlumniMapPin[] | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("all");

  const fetchPins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let rawData: Record<string, unknown>[] = [];
      try {
        rawData = await api("/api/alumni/map", { method: "GET" });
      } catch {
        rawData = [];
      }

      if (!rawData || rawData.length === 0) {
        rawData = await api("/api/alumni/search", { method: "GET" });
      }

      const mappedPins: AlumniMapPin[] = (rawData || [])
        .map((item) => {
          const [lat, lng] = resolveCoords(item);
          return {
            alumniId: (item.alumniId || item.id) as number,
            name: (item.name as string) || "Unknown",
            profileImageUrl: (item.profileImageUrl as string) || null,
            email: (item.email as string) || null,
            batchYear: item.batchYear ? Number(item.batchYear) : null,
            department: (item.department as string) || null,
            courseName: (item.courseName as string) || null,
            profession: (item.profession as string) || null,
            linkedinUrl: (item.linkedinUrl as string) || null,
            latitude: lat as number,
            longitude: lng as number,
            displayLocation:
              ((item.displayLocation || item.location || item.placeOfResidence) as string) ||
              "Location unavailable",
            city: (item.city as string) || null,
            country: (item.country as string) || null,
          };
        })
        .filter(
          (pin) =>
            typeof pin.latitude === "number" &&
            typeof pin.longitude === "number" &&
            !isNaN(pin.latitude) &&
            !isNaN(pin.longitude),
        );

      setPins(mappedPins);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load alumni locations";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    pins.forEach((p) => {
      if (p.country) set.add(p.country);
    });
    return Array.from(set).sort();
  }, [pins]);

  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      const matchesCountry =
        selectedCountryFilter === "all" ||
        (pin.country && pin.country.toLowerCase() === selectedCountryFilter.toLowerCase());

      if (!matchesCountry) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        pin.name.toLowerCase().includes(q) ||
        (pin.profession && pin.profession.toLowerCase().includes(q)) ||
        (pin.department && pin.department.toLowerCase().includes(q)) ||
        (pin.displayLocation && pin.displayLocation.toLowerCase().includes(q)) ||
        (pin.city && pin.city.toLowerCase().includes(q)) ||
        (pin.country && pin.country.toLowerCase().includes(q))
      );
    });
  }, [pins, searchQuery, selectedCountryFilter]);

  const fitAllBounds = useCallback(() => {
    if (!mapInstance.current || !filteredPins.length) return;
    const L = (window as any).L;
    if (!L) return;

    if (filteredPins.length === 1) {
      mapInstance.current.flyTo([filteredPins[0].latitude, filteredPins[0].longitude], 12, {
        animate: true,
        duration: 1,
      });
      return;
    }

    const bounds = L.latLngBounds(filteredPins.map((p) => [p.latitude, p.longitude]));
    mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [filteredPins]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current) return;
    if (mapInstance.current) return;

    let cancelled = false;

    (async () => {
      try {
        const leafletModule = await import("leaflet");
        const L = leafletModule.default || leafletModule;

        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const extensibleL = Object.create(L);
        (window as any).L = extensibleL;

        await import("leaflet.markercluster");

        if (cancelled) return;

        const map = L.map(mapContainer.current!, {
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          zoomControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        const markerClusterGroup = (extensibleL as any).markerClusterGroup;
        if (typeof markerClusterGroup === "function") {
          const cluster = markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
          });
          map.addLayer(cluster);
          clusterGroup.current = cluster;

          cluster.on("clusterclick", (a: any) => {
            const markers = a.layer.getAllChildMarkers();
            const pinList: AlumniMapPin[] = markers
              .map((m: any) => m.options.alumniPin)
              .filter(Boolean);
            setClusterList(pinList);
            setSelected(null);
          });
        }

        mapInstance.current = map;
        setMapReady(true);
      } catch (err: unknown) {
        console.error("Failed to load Leaflet:", err);
        setError("Failed to initialize map library.");
      }
    })();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        clusterGroup.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
    fetchPins();
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;

    const L = (window as any).L;
    if (!L) return;

    if (clusterGroup.current) {
      clusterGroup.current.clearLayers();
    }

    filteredPins.forEach((pin) => {
      const avatarHtml = pin.profileImageUrl
        ? `<img src="${pin.profileImageUrl}" class="w-8 h-8 rounded-full object-cover ring-2 ring-primary shadow-md" />`
        : `<div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-md border-2 border-background">${pin.name.charAt(0).toUpperCase()}</div>`;

      const customIcon = L.divIcon({
        className: "custom-alumni-marker",
        html: `
          <div class="relative group cursor-pointer transform transition-all duration-200 hover:scale-110 hover:-translate-y-1">
            ${avatarHtml}
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45 rounded-xs" />
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([pin.latitude, pin.longitude], {
        icon: customIcon,
        title: pin.name,
        alumniPin: pin,
      });

      marker.on("click", () => {
        setSelected(pin);
        setClusterList(null);
        if (mapInstance.current) {
          mapInstance.current.flyTo([pin.latitude, pin.longitude], 12, {
            animate: true,
            duration: 0.8,
          });
        }
      });

      if (clusterGroup.current) {
        clusterGroup.current.addLayer(marker);
      } else if (mapInstance.current) {
        marker.addTo(mapInstance.current);
      }
    });
  }, [mapReady, filteredPins]);

  const selectPinFromList = (pin: AlumniMapPin) => {
    setSelected(pin);
    setClusterList(null);
    if (mapInstance.current) {
      mapInstance.current.flyTo([pin.latitude, pin.longitude], 12, {
        animate: true,
        duration: 0.8,
      });
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border shadow-md bg-card flex flex-col">
      {/* ── Top Control Panel ───────────────────────────────────────────── */}
      <div className="z-10 p-3.5 sm:p-4 bg-card border-b border-border flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search input & Mapped count badge */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search alumni by name, city, or profession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs bg-background border-border font-medium focus-visible:ring-primary rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Badge variant="outline" className="h-9 px-3 rounded-xl border-border bg-background text-xs font-semibold flex items-center gap-1.5 shrink-0">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground">{filteredPins.length}</span>
              <span className="text-muted-foreground font-normal">Mapped</span>
            </Badge>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fitAllBounds}
              disabled={!filteredPins.length}
              className="h-9 text-xs cursor-pointer gap-1.5 font-semibold rounded-xl border-border"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Fit All
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchPins}
              disabled={loading}
              className="h-9 text-xs cursor-pointer gap-1.5 font-semibold rounded-xl border-border"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Country Quick Filter Chips */}
        {availableCountries.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none pt-1 border-t border-border/50">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Globe className="h-3 w-3 text-primary" /> Country:
            </span>
            <Badge
              variant={selectedCountryFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedCountryFilter("all")}
              className={`cursor-pointer text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                selectedCountryFilter === "all"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "bg-background text-foreground hover:bg-accent border-border"
              }`}
            >
              All Countries ({pins.length})
            </Badge>
            {availableCountries.map((c) => {
              const count = pins.filter((p) => p.country?.toLowerCase() === c.toLowerCase()).length;
              const isActive = selectedCountryFilter.toLowerCase() === c.toLowerCase();
              return (
                <Badge
                  key={c}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCountryFilter(c)}
                  className={`cursor-pointer text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "bg-background text-foreground hover:bg-accent border-border"
                  }`}
                >
                  {c} ({count})
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Map Canvas Container ────────────────────────────────────────── */}
      <div className="relative w-full h-[580px]">
        <div ref={mapContainer} className="w-full h-full z-0" />

      {/* ── Loading Overlay ───────────────────────────────────────────────── */}
      {loading && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-semibold text-foreground">Loading alumni map locations...</p>
        </div>
      )}

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="absolute bottom-4 left-4 z-30 max-w-sm">
          <Card className="border-destructive bg-destructive/10 text-destructive p-3 shadow-lg">
            <CardContent className="p-0 flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Selected Alumni Pin Detail Drawer ─────────────────────────────── */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-30 sm:w-84 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Card className="shadow-2xl border-border bg-card/95 backdrop-blur-xl p-4 space-y-3.5 rounded-2xl">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {selected.profileImageUrl ? (
                  <img
                    src={selected.profileImageUrl}
                    alt={selected.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate">{selected.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                    <MapPin className="h-3 w-3 shrink-0 text-primary" />
                    <span className="truncate">{selected.displayLocation}</span>
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelected(null)}
                className="h-7 w-7 rounded-full cursor-pointer hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {selected.batchYear && (
                <Badge variant="outline" className="font-normal text-xs rounded-md">
                  <GraduationCap className="h-3 w-3 mr-1 text-primary" />
                  Class of {selected.batchYear}
                </Badge>
              )}
              {selected.department && (
                <Badge variant="secondary" className="font-normal text-xs rounded-md">
                  {selected.department}
                </Badge>
              )}
              {selected.profession && (
                <Badge variant="outline" className="font-normal text-xs rounded-md">
                  <Briefcase className="h-3 w-3 mr-1 text-primary" />
                  {selected.profession}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              {selected.linkedinUrl && (
                <Button size="sm" variant="outline" asChild className="flex-1 cursor-pointer rounded-xl h-9 text-xs font-semibold">
                  <a href={selected.linkedinUrl} target="_blank" rel="noreferrer">
                    LinkedIn <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </Button>
              )}
              <Button size="sm" asChild className="flex-1 cursor-pointer rounded-xl h-9 text-xs font-semibold">
                <Link href={`/alumni/${selected.alumniId}`}>
                  View Profile <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Cluster Alumni List Drawer ────────────────────────────────────── */}
      {clusterList && !selected && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-30 sm:w-84 max-h-72 flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Card className="shadow-2xl border-border bg-card/95 backdrop-blur-xl p-4 space-y-3 overflow-hidden flex flex-col rounded-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Users className="h-4 w-4 text-primary" /> {clusterList.length} Alumni in this area
              </div>
              <Button variant="ghost" size="icon" onClick={() => setClusterList(null)} className="h-6 w-6 rounded-full cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="overflow-y-auto space-y-2 pr-1 max-h-48 divide-y divide-border/40">
              {clusterList.map((pin) => (
                <div key={pin.alumniId} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate">{pin.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{pin.profession || pin.department || "Alumni"}</p>
                  </div>
                  <Button size="xs" variant="secondary" onClick={() => selectPinFromList(pin)} className="cursor-pointer font-semibold rounded-lg shrink-0">
                    Inspect
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
    </div>
  );
}

