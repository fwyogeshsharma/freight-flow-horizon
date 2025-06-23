import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Navigation, Clock } from "lucide-react";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

// Custom truck icon
const createTruckIcon = (isSelected: boolean = false) => {
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rotate-45"></div>
      </div>
    `,
    className: 'truck-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

// Component to handle map bounds and markers
const MapController: React.FC<{
  trips: TripData[];
  selectedTrip?: string;
  onTripSelect: (tripId: string) => void;
}> = ({ trips, selectedTrip, onTripSelect }) => {
  const map = useMap();

  useEffect(() => {
    if (trips.length > 0) {
      // Create bounds to fit all markers
      const group = new L.FeatureGroup();
      trips.forEach(trip => {
        const marker = L.marker([trip.currentLocation.latitude, trip.currentLocation.longitude]);
        group.addLayer(marker);
      });
      
      // Fit map to show all markers
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }, [trips, map]);

  return null;
};

const RealTimeTrackingMap: React.FC<RealTimeTrackingMapProps> = ({
  trips,
  selectedTrip,
  onTripSelect
}) => {
  const defaultPosition: [number, number] = [51.505, -0.09]; // London coordinates

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
            <div className="h-96 w-full rounded-lg overflow-hidden">
              <MapContainer 
                center={defaultPosition} 
                zoom={13} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Controller to handle bounds and updates */}
                <MapController 
                  trips={trips} 
                  selectedTrip={selectedTrip} 
                  onTripSelect={onTripSelect} 
                />
                
                {/* Render markers for each trip */}
                {trips.map(trip => (
                  <Marker
                    key={trip.id}
                    position={[trip.currentLocation.latitude, trip.currentLocation.longitude]}
                    icon={createTruckIcon(selectedTrip === trip.id)}
                    eventHandlers={{
                      click: () => onTripSelect(trip.id),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{trip.loadId}</h3>
                        <p className="text-sm">Driver: {trip.driver}</p>
                        <p className="text-sm">Truck: {trip.truck}</p>
                        <p className="text-xs text-gray-600">{trip.currentLocation.address}</p>
                        <p className="text-xs">Speed: {trip.speed} km/h</p>
                        <p className="text-xs">ETA: {trip.eta}</p>
                        <p className="text-xs">Status: {trip.status}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeTrackingMap;