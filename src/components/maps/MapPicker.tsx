
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    pincode: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  placeholder?: string;
}

const MapPicker: React.FC<MapPickerProps> = ({ 
  onLocationSelect, 
  initialLocation,
  placeholder = "Search for location..." 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    // For demo purposes, using a placeholder. In production, get from Supabase secrets
    const token = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNscXRlc3QifQ.demo-token';
    setMapboxToken(token);
    
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    const initialCoords = initialLocation || { latitude: 28.6139, longitude: 77.2090 }; // Delhi default
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialCoords.longitude, initialCoords.latitude],
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler to place marker
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }
      
      // Add new marker
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Reverse geocoding to get address details
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const context = feature.context || [];
          
          const city = context.find((c: any) => c.id.includes('place'))?.text || '';
          const state = context.find((c: any) => c.id.includes('region'))?.text || '';
          const pincode = context.find((c: any) => c.id.includes('postcode'))?.text || '';
          
          onLocationSelect({
            address: feature.place_name,
            latitude: lat,
            longitude: lng,
            city,
            state,
            pincode
          });
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, initialLocation, onLocationSelect]);

  const handleSearch = async () => {
    if (!searchQuery || !mapboxToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=IN`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 14
        });
        
        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }
        
        // Add new marker
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative">
        <div ref={mapContainer} className="h-64 w-full rounded-lg border" />
        <div className="absolute top-2 left-2 bg-white p-2 rounded shadow text-xs">
          <MapPin className="h-3 w-3 inline mr-1" />
          Click on map to select location
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
