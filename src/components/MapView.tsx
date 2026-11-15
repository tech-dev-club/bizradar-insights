import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  onMapboxTokenSet?: (token: string) => void;
}

const MapView = ({
  center = [78.9629, 20.5937],
  zoom = 4.5,
  onMapboxTokenSet,
}: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const tokenCallback = useRef(onMapboxTokenSet);

  const [tokenInput, setTokenInput] = useState("");
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenError, setTokenError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    tokenCallback.current = onMapboxTokenSet;
  }, [onMapboxTokenSet]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    let isActive = true;
    mapboxgl.accessToken = mapboxToken;

    try {
      const instance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom,
      });

      map.current = instance;
      marker.current = new mapboxgl.Marker({ color: "#06b6d4" })
        .setLngLat(center)
        .addTo(instance);

      instance.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right",
      );

      instance.once("load", () => {
        if (!isActive) return;
        setMapLoaded(true);
        setTokenError(false);
        tokenCallback.current?.(mapboxToken);
      });

      instance.on("error", () => {
        if (!isActive) return;
        setTokenError(true);
        setMapLoaded(false);
      });
    } catch (error) {
      console.error("Map initialization error:", error);
      setTokenError(true);
    }

    return () => {
      isActive = false;
      marker.current?.remove();
      marker.current = null;
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    map.current.flyTo({ center, zoom, duration: 800 });
    marker.current?.setLngLat(center);
  }, [center, zoom, mapLoaded]);

  const handleLoadMap = () => {
    const normalizedToken = tokenInput.trim();
    if (!normalizedToken.startsWith("pk.") || normalizedToken.length < 20) {
      setTokenError(true);
      return;
    }

    setTokenError(false);
    setMapLoaded(false);
    setMapboxToken(normalizedToken);
  };

  if (!mapboxToken || tokenError) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-warning" aria-hidden="true" />
          <h3 className="mb-2 text-lg font-semibold">Mapbox Token Required</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter a Mapbox public token to load the interactive map. You can create one at{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              aria-label="Mapbox public access token"
              placeholder="pk.eyJ1IjoiZXhhbXBsZS..."
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              className="min-w-0 font-mono text-xs"
              autoComplete="off"
            />
            <Button type="button" onClick={handleLoadMap}>
              Load Map
            </Button>
          </div>
          {tokenError && (
            <p className="mt-2 text-left text-xs text-destructive" role="alert">
              The map could not be loaded. Check that the token is a valid public token and try again.
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Use a public token with the minimum required Mapbox scopes. Do not enter a secret token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full" aria-label="Interactive map">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 text-sm text-muted-foreground" role="status">
          Loading map…
        </div>
      )}
    </div>
  );
};

export default MapView;
