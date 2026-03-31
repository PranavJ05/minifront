"use client";

/**
 * AlumniDirectoryMap.tsx
 *
 * Alumni directory map view using React Leaflet + Leaflet.markercluster.
 */

import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlumniMapPin {
  alumniId: number;
  name: string;
  profileImageUrl: string | null;
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

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:8080";
const MAP_CENTER: [number, number] = [20.5937, 78.9629]; // India centre
const MAP_ZOOM = 5;
const LOG = (...a: unknown[]) => console.log("[AlumniDirectoryMap]", ...a);
const ERR = (...a: unknown[]) => console.error("[AlumniDirectoryMap]", ...a);

// ─── Component ────────────────────────────────────────────────────────────────

export default function AlumniDirectoryMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null); // L.Map
  const clusterGroup = useRef<any>(null); // L.MarkerClusterGroup

  const [pins, setPins] = useState<AlumniMapPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AlumniMapPin | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // ── Fetch pins from backend ─────────────────────────────────────────────

  async function fetchPins() {
    LOG("fetchPins() called");
    setLoading(true);
    setError(null);

    try {
      // Public endpoint — no auth header needed
      const res = await fetch(`${API_BASE}/api/alumni/map`);
      LOG("Response status:", res.status);

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data: AlumniMapPin[] = await res.json();
      LOG(`Loaded ${data.length} pins`);
      setPins(data);
    } catch (err: any) {
      ERR("fetchPins error:", err);
      setError(err.message || "Failed to load alumni locations");
    } finally {
      setLoading(false);
    }
  }

  // ── Init Leaflet (client-only) ──────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current) return;
    if (mapInstance.current) return; // Already initialised

    let cancelled = false;

    // Dynamic import keeps Leaflet out of the SSR bundle
    // Must load leaflet FIRST, then markercluster (which depends on global L)
    import("leaflet")
      .then((L) => {
        if (cancelled) return;

        // Set L globally for markercluster
        (window as any).L = L;

        // Fix broken default icon paths in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Now load markercluster (depends on global L, modifies it)
        return import("leaflet.markercluster");
      })
      .then(() => {
        if (cancelled) return;

        LOG("Leaflet loaded, initialising map");

        const L = (window as any).L;

        // Create map
        const map = L.map(mapContainer.current!, {
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          zoomControl: true,
        });

        // Tile layer — OpenStreetMap (free, no API key)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        // Marker cluster group - use global L
        const cluster = L.markerClusterGroup({
          chunkedLoading: true,
          maxClusterRadius: 60,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
        });

        map.addLayer(cluster);

        mapInstance.current = map;
        clusterGroup.current = cluster;

        setMapReady(true);
        LOG("Map initialised");
      })
      .catch((err) => {
        if (!cancelled) {
          ERR("Failed to load Leaflet:", err);
          setError("Failed to load map");
        }
      });

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        clusterGroup.current = null;
      }
    };
  }, []);

  // ── Load pins from API ──────────────────────────────────────────────────

  useEffect(() => {
    fetchPins();
  }, []);

  // ── Add markers whenever pins or map change ─────────────────────────────

  useEffect(() => {
    if (!mapReady || !clusterGroup.current || pins.length === 0) return;

    const L = (window as any).L;
    const cluster = clusterGroup.current;
    cluster.clearLayers();

    LOG(`Adding ${pins.length} markers to cluster`);

    pins.forEach((pin) => {
      const marker = L.marker([pin.latitude, pin.longitude]);

      // Bind a minimal tooltip (shown on hover)
      marker.bindTooltip(
        `<strong>${pin.name}</strong><br>${pin.displayLocation ?? ""}`,
        { direction: "top", offset: [0, -10] },
      );

      // On click: show the side panel
      marker.on("click", () => {
        LOG("Marker clicked:", pin.alumniId, pin.name);
        setSelected(pin);
      });

      cluster.addLayer(marker);
    });
  }, [mapReady, pins]);

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
      {/* Map canvas */}
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: 600 }}
      />

      {/* ── Loading overlay ── */}
      {loading && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-[#1a2744]" />
            <p className="text-sm font-medium text-[#1a2744]">
              Loading alumni locations…
            </p>
          </div>
        </div>
      )}

      {/* ── Error overlay ── */}
      {error && !loading && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-sm w-full shadow-lg mx-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1a2744]">Could not load map</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
                <button
                  onClick={fetchPins}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2744] text-white text-sm font-medium hover:bg-[#243460] transition-colors"
                >
                  <RefreshCw className="h-4 w-4" /> Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats badge (top-left) ── */}
      {!loading && pins.length > 0 && (
        <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
          <Users className="h-4 w-4 text-[#1a2744]" />
          <span className="text-sm font-semibold text-[#1a2744]">
            {pins.length} alumni on map
          </span>
        </div>
      )}

      {/* ── Refresh button (top-right) ── */}
      <button
        onClick={fetchPins}
        disabled={loading}
        className="
          absolute top-4 right-4 z-[400]
          w-9 h-9 flex items-center justify-center
          bg-white/90 backdrop-blur-sm rounded-xl
          border border-gray-200 shadow-sm
          text-[#1a2744] hover:bg-white
          disabled:opacity-40 transition-all
        "
        title="Refresh"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      </button>

      {/* ── Selected alumni card (bottom panel) ── */}
      {selected && (
        <div
          className="
            absolute bottom-4 left-4 right-4 z-[400]
            bg-white rounded-2xl shadow-xl border border-gray-200
            p-4 flex items-start gap-4
            sm:left-auto sm:right-4 sm:w-80
          "
          style={{ animation: "slideUp 0.2s ease-out" }}
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] border border-[#1a2744]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {selected.profileImageUrl ? (
              <img
                src={selected.profileImageUrl}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#1a2744] font-bold text-lg">
                {selected.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1a2744] truncate">{selected.name}</p>

            {selected.profession && (
              <p className="text-xs text-[#c8a84b] font-medium mt-0.5 flex items-center gap-1 truncate">
                <Briefcase className="h-3 w-3 flex-shrink-0" />
                {selected.profession}
              </p>
            )}

            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {selected.department && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {selected.department}
                  {selected.batchYear && ` · ${selected.batchYear}`}
                </span>
              )}
              {(selected.displayLocation || selected.city) && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selected.city ?? selected.displayLocation}
                </span>
              )}
            </div>

            {selected.linkedinUrl && (
              <a
                href={selected.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-[#1a2744] font-semibold hover:text-[#c8a84b] transition-colors"
              >
                <ExternalLink className="h-3 w-3" /> LinkedIn
              </a>
            )}
          </div>

          {/* Close */}
          <button
            onClick={() => setSelected(null)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1a2744] hover:bg-gray-100 flex-shrink-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
