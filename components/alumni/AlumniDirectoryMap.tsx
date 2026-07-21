"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
const MAP_ZOOM = 5;

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

  const fetchPins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rawData: Record<string, unknown>[] = await api("/api/alumni/search", {
        method: "GET",
      });

      const mappedPins: AlumniMapPin[] = (rawData || [])
        .map((item) => ({
          alumniId: (item.id || item.alumniId) as number,
          name: (item.name as string) || "Unknown",
          profileImageUrl: (item.profileImageUrl as string) || null,
          email: (item.email as string) || null,
          batchYear: (item.batchYear as number) || null,
          department: (item.department as string) || null,
          courseName: (item.courseName as string) || null,
          profession: (item.profession as string) || null,
          linkedinUrl: (item.linkedinUrl as string) || null,
          latitude: item.latitude as number,
          longitude: item.longitude as number,
          displayLocation: ((item.location || item.placeOfResidence) as string) || "Location unavailable",
          city: (item.city as string) || null,
          country: (item.country as string) || null,
        }))
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
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        const markerClusterGroup = (extensibleL as any).markerClusterGroup;
        if (typeof markerClusterGroup === "function") {
          const cluster = markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 60,
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
    if (!mapReady || !mapInstance.current || !pins.length) return;

    const leaflet = (window as any).L;
    if (!leaflet) return;

    if (clusterGroup.current) {
      clusterGroup.current.clearLayers();
    }

    pins.forEach((pin) => {
      const marker = leaflet.marker([pin.latitude, pin.longitude], {
        title: pin.name,
        alumniPin: pin,
      });

      marker.on("click", () => {
        setSelected(pin);
        setClusterList(null);
      });

      if (clusterGroup.current) {
        clusterGroup.current.addLayer(marker);
      } else if (mapInstance.current) {
        marker.addTo(mapInstance.current);
      }
    });
  }, [mapReady, pins]);

  return (
    <div className="relative w-full h-[650px] rounded-xl overflow-hidden border border-border shadow-sm bg-card">
      <div ref={mapContainer} className="w-full h-full z-0" />

      {/* Top Bar Controls */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <Badge variant="secondary" className="shadow-md bg-background/90 backdrop-blur-md text-xs py-1 px-3">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
          {loading ? "Loading..." : `${pins.length} Alumni Mapped`}
        </Badge>
        <Button
          variant="outline"
          size="xs"
          onClick={fetchPins}
          disabled={loading}
          className="shadow-md bg-background/90 backdrop-blur-md cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading alumni map...</p>
        </div>
      )}

      {error && (
        <div className="absolute top-3 right-3 z-20 max-w-sm">
          <Card className="border-destructive bg-destructive/10 text-destructive p-3">
            <CardContent className="p-0 flex items-center gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Alumni Pin Drawer */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-20 sm:w-80">
          <Card className="shadow-xl border-border bg-card/95 backdrop-blur-md p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selected.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {selected.displayLocation}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelected(null)}
                className="h-6 w-6 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {selected.batchYear && (
                <Badge variant="outline" className="font-normal text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Class of {selected.batchYear}
                </Badge>
              )}
              {selected.department && (
                <Badge variant="secondary" className="font-normal text-xs">
                  {selected.department}
                </Badge>
              )}
              {selected.profession && (
                <Badge variant="outline" className="font-normal text-xs">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {selected.profession}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              {selected.linkedinUrl && (
                <Button size="xs" variant="outline" asChild className="flex-1 cursor-pointer">
                  <a href={selected.linkedinUrl} target="_blank" rel="noreferrer">
                    LinkedIn <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              <Button size="xs" asChild className="flex-1 cursor-pointer">
                <Link href={`/alumni/${selected.alumniId}`}>
                  View Profile <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Cluster Alumni List Drawer */}
      {clusterList && !selected && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-20 sm:w-80 max-h-72 flex flex-col">
          <Card className="shadow-xl border-border bg-card/95 backdrop-blur-md p-4 space-y-3 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Users className="h-4 w-4 text-primary" /> {clusterList.length} Alumni in this area
              </div>
              <Button variant="ghost" size="icon" onClick={() => setClusterList(null)} className="h-6 w-6 cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="overflow-y-auto space-y-2 pr-1 max-h-48 divide-y divide-border/40">
              {clusterList.map((pin) => (
                <div key={pin.alumniId} className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{pin.name}</p>
                    <p className="text-[11px] text-muted-foreground">{pin.profession || pin.department || "Alumni"}</p>
                  </div>
                  <Button size="xs" variant="ghost" onClick={() => setSelected(pin)} className="cursor-pointer text-primary">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
