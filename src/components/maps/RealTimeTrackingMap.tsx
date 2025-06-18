
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Navigation, Clock } from "lucide-react";

interface TripData {
  id: string;
  loadId: string;
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: string;
  speed: number;
  eta: string;
  progress: number;
}

interface RealTimeTrackingMapProps {
  trips: TripData[];
  selectedTrip?: string;
  onTripSelect: (tripId: string) => void;
}

const RealTimeTrackingMap: React.FC<RealTimeTrackingMapProps> = ({
  trips,
  selectedTrip,
  onTripSelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    // For demo purposes, using a placeholder. In production, get from Supabase secrets
    const token = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNscXRlc3QifQ.demo-token';
    setMapboxToken(token);
    
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.2090, 28.6139], // Delhi center
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !trips.length) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add markers for each trip
    trips.forEach(trip => {
      const el = document.createElement('div');
      el.className = 'truck-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg ${
            selectedTrip === trip.id ? 'ring-2 ring-blue-500' : ''
          }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
        </div>
      `;
      
      el.addEventListener('click', () => onTripSelect(trip.id));

      const marker = new mapboxgl.Marker(el)
        .setLngLat([trip.currentLocation.longitude, trip.currentLocation.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${trip.loadId}</h3>
                <p class="text-sm">${trip.driver}</p>
                <p class="text-sm">${trip.truck}</p>
                <p class="text-xs text-gray-600">${trip.currentLocation.address}</p>
                <p class="text-xs">Speed: ${trip.speed} km/h</p>
              </div>
            `)
        )
        .addTo(map.current!);

      markers.current[trip.id] = marker;
    });

    // Fit map to show all markers
    if (trips.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      trips.forEach(trip => {
        bounds.extend([trip.currentLocation.longitude, trip.currentLocation.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [trips, selectedTrip, onTripSelect]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on time': return 'bg-green-500';
      case 'delayed': return 'bg-red-500';
      case 'ahead': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trip List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Trips ({trips.length})</h3>
        {trips.map(trip => (
          <Card 
            key={trip.id} 
            className={`cursor-pointer transition-all ${
              selectedTrip === trip.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onTripSelect(trip.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm">{trip.loadId}</CardTitle>
                <Badge className={getStatusColor(trip.status)}>
                  {trip.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-xs">
                <Truck className="h-3 w-3 mr-1" />
                {trip.truck} - {trip.driver}
              </div>
              <div className="flex items-center text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {trip.origin} → {trip.destination}
              </div>
              <div className="flex items-center text-xs">
                <Navigation className="h-3 w-3 mr-1" />
                Speed: {trip.speed} km/h
              </div>
              <div className="flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                ETA: {trip.eta}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${trip.progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Live Tracking Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={mapContainer} className="h-96 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeTrackingMap;
