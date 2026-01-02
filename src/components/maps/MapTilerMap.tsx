import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin, Loader2 } from 'lucide-react';

interface MapTilerMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markerTitle?: string;
  address?: string;
  className?: string;
  apiKey?: string;
}

const DEFAULT_LOCATION = {
  lat: 36.7468,
  lng: -119.7726,
  address: "123 Healing Paws Lane, Greenfield, CA 95000"
};

export const MapTilerMap = ({
  latitude = DEFAULT_LOCATION.lat,
  longitude = DEFAULT_LOCATION.lng,
  zoom = 14,
  markerTitle = "Woo-Fur Animal Sanctuary",
  address = DEFAULT_LOCATION.address,
  className = "",
  apiKey
}: MapTilerMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) {
      if (!apiKey) {
        setError("MapTiler API key is required");
        setIsLoading(false);
      }
      return;
    }

    try {
      maptilersdk.config.apiKey = apiKey;

      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [longitude, latitude],
        zoom: zoom,
      });

      map.current.on('load', () => {
        setIsLoading(false);

        // Add marker for the facility
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="4" r="2"/>
              <circle cx="18" cy="8" r="2"/>
              <circle cx="20" cy="16" r="2"/>
              <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
            </svg>
          </div>
        `;

        new maptilersdk.Marker({ element: markerElement })
          .setLngLat([longitude, latitude])
          .setPopup(
            new maptilersdk.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${markerTitle}</h3>
                <p class="text-xs text-gray-600 mt-1">${address}</p>
              </div>
            `)
          )
          .addTo(map.current!);

        // Add navigation controls
        map.current?.addControl(
          new maptilersdk.NavigationControl(),
          'top-right'
        );
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Failed to load map');
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [apiKey, latitude, longitude, zoom, markerTitle, address]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: userLat, longitude: userLng } = position.coords;
          setUserLocation({ lat: userLat, lng: userLng });
          
          // Calculate distance
          const dist = calculateDistance(userLat, userLng, latitude, longitude);
          setDistance(dist.toFixed(1));

          // Add user marker
          if (map.current) {
            new maptilersdk.Marker({ color: '#3B82F6' })
              .setLngLat([userLng, userLat])
              .setPopup(
                new maptilersdk.Popup({ offset: 25 }).setHTML('<p class="text-sm">Your Location</p>')
              )
              .addTo(map.current);

            // Fit bounds to show both markers
            const bounds = new maptilersdk.LngLatBounds()
              .extend([longitude, latitude])
              .extend([userLng, userLat]);
            
            map.current.fitBounds(bounds, { padding: 50 });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  const handleGetDirections = () => {
    const destination = encodeURIComponent(address);
    const origin = userLocation 
      ? `${userLocation.lat},${userLocation.lng}` 
      : '';
    
    const url = origin 
      ? `https://www.google.com/maps/dir/${origin}/${destination}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    
    window.open(url, '_blank');
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground/70 mt-2">{address}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        <Button
          onClick={handleGetLocation}
          variant="secondary"
          size="sm"
          className="shadow-lg gap-2"
        >
          <Navigation className="h-4 w-4" />
          {distance ? `${distance} mi away` : 'Find My Location'}
        </Button>
        
        <Button
          onClick={handleGetDirections}
          size="sm"
          className="shadow-lg gap-2"
        >
          <MapPin className="h-4 w-4" />
          Get Directions
        </Button>
      </div>

      {/* Info Card */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur rounded-lg shadow-lg p-3 max-w-[200px]">
        <h3 className="font-semibold text-sm">{markerTitle}</h3>
        <p className="text-xs text-muted-foreground mt-1">{address}</p>
      </div>
    </div>
  );
};

export default MapTilerMap;
