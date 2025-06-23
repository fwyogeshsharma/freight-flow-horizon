import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Users } from "lucide-react";

// Fix for default Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

// Interface for shipment data
interface Shipment {
  id: string;
  load: string;
  driver: string;
  vehicle: string;
  from: string;
  to: string;
  currentLocation: string;
  progress: number;
  eta: string;
  status: string;
  coordinates: { lat: number; lng: number };
}

// Component to handle map bounds
const MapController = ({ shipments }: { shipments: Shipment[] }) => {
  const map = useMap();

  useEffect(() => {
    if (shipments.length > 0) {
      const bounds = L.latLngBounds(
        shipments.map(shipment => [shipment.coordinates.lat, shipment.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [shipments, map]);

  return null;
};

const Tracking = () => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  const activeShipments: Shipment[] = [
    {
      id: "SH001",
      load: "LD001",
      driver: "Raj Kumar",
      vehicle: "TN01AB1234",
      from: "Mumbai",
      to: "Delhi",
      currentLocation: "Nashik",
      progress: 25,
      eta: "6 hours",
      status: "On Time",
      coordinates: { lat: 19.9975, lng: 73.7898 }, // Nashik
    },
    {
      id: "SH002",
      load: "LD002",
      driver: "Suresh Babu",
      vehicle: "KA02CD5678",
      from: "Chennai",
      to: "Bangalore",
      currentLocation: "Hosur",
      progress: 75,
      eta: "2 hours",
      status: "Delayed",
      coordinates: { lat: 12.7368, lng: 77.8380 }, // Hosur
    },
  ];

  // Default map center (India)
  const defaultPosition: [number, number] = [20.5937, 78.9629];

  // Handle map initialization issues
  useEffect(() => {
    // Force map resize after component mount to fix rendering issues
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    setTimeout(handleResize, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-gray-600">Real-time shipment monitoring</p>
        </div>

        {/* Interactive Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Map View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <MapContainer
                center={defaultPosition}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                whenCreated={(map) => {
                  // Fix map rendering
                  setTimeout(() => map.invalidateSize(), 0);
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MapController shipments={activeShipments} />
                
                {activeShipments.map((shipment) => (
                  <Marker
                    key={shipment.id}
                    position={[shipment.coordinates.lat, shipment.coordinates.lng]}
                    icon={createTruckIcon(selectedShipment === shipment.id) as L.DivIcon}
                    eventHandlers={{
                      click: () => setSelectedShipment(shipment.id),
                    }}
                  >
                    <Popup minWidth={200}>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg mb-2">{shipment.id}</h3>
                        <div className="space-y-1 text-sm">
                          <p><strong>Load:</strong> {shipment.load}</p>
                          <p><strong>Driver:</strong> {shipment.driver}</p>
                          <p><strong>Vehicle:</strong> {shipment.vehicle}</p>
                          <p><strong>Route:</strong> {shipment.from} → {shipment.to}</p>
                          <p><strong>Current:</strong> {shipment.currentLocation}</p>
                          <p><strong>ETA:</strong> {shipment.eta}</p>
                          <p><strong>Progress:</strong> {shipment.progress}%</p>
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                shipment.status === "On Time"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {shipment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Shipments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Shipments ({activeShipments.length})</h2>
          {activeShipments.map((shipment) => (
            <Card
              key={shipment.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${
                selectedShipment === shipment.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedShipment(shipment.id)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{shipment.id}</h3>
                    <p className="text-sm text-gray-600">{shipment.load}</p>
                  </div>
                  <Badge
                    className={
                      shipment.status === "On Time"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {shipment.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Driver
                    </p>
                    <p className="font-medium">{shipment.driver}</p>
                    <p className="text-xs text-gray-600">{shipment.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Route
                    </p>
                    <p className="font-medium">{shipment.from} → {shipment.to}</p>
                    <p className="text-xs text-gray-600">
                      Currently: {shipment.currentLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      ETA
                    </p>
                    <p className="font-medium">{shipment.eta}</p>
                    <p className="text-xs text-gray-600">
                      {shipment.progress}% Complete
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${shipment.progress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracking;