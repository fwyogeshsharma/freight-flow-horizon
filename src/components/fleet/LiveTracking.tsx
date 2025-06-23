import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Users, Clock, AlertTriangle } from "lucide-react";

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

// Interface for trip data
interface Trip {
  id: string;
  loadId: string;
  truck: string;
  driver: string;
  route: string;
  currentLocation: string;
  progress: number;
  speed: string;
  eta: string;
  status: string;
  lastUpdate: string;
  alerts: string[];
  coordinates: { lat: number; lng: number };
}

// Component to handle map bounds
const MapController = ({ trips }: { trips: Trip[] }) => {
  const map = useMap();

  useEffect(() => {
    if (trips.length > 0) {
      const bounds = L.latLngBounds(
        trips.map(trip => [trip.coordinates.lat, trip.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [trips, map]);

  return null;
};

const LiveTracking = () => {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const activeTrips: Trip[] = [
    {
      id: "T001",
      loadId: "LD001",
      truck: "TN01AB1234",
      driver: "Raj Kumar",
      route: "Mumbai → Delhi",
      currentLocation: "Nashik, Maharashtra",
      progress: 25,
      speed: "65 km/h",
      eta: "14:30 Tomorrow",
      status: "On Time",
      lastUpdate: "2 mins ago",
      alerts: [],
      coordinates: { lat: 19.9975, lng: 73.7898 }, // Nashik
    },
    {
      id: "T002",
      loadId: "LD002",
      truck: "KA02CD5678",
      driver: "Suresh Babu",
      route: "Chennai → Bangalore",
      currentLocation: "Hosur Border",
      progress: 85,
      speed: "45 km/h",
      eta: "16:45 Today",
      status: "Delayed",
      lastUpdate: "5 mins ago",
      alerts: ["Long idle time detected"],
      coordinates: { lat: 12.7368, lng: 77.8380 }, // Hosur
    },
    {
      id: "T003",
      loadId: "LD003",
      truck: "MH03EF9012",
      driver: "Amit Singh",
      route: "Pune → Hyderabad",
      currentLocation: "Solapur, Maharashtra",
      progress: 45,
      speed: "72 km/h",
      eta: "09:15 Tomorrow",
      status: "On Time",
      lastUpdate: "1 min ago",
      alerts: ["Overspeeding alert"],
      coordinates: { lat: 17.6599, lng: 75.9064 }, // Solapur
    },
  ];

  // Default map center (India)
  const defaultPosition: [number, number] = [20.5937, 78.9629];

  // Fix map rendering
  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    setTimeout(handleResize, 100);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Live Fleet Tracking</h2>
        <Badge className="bg-gray-200 text-gray-800">{activeTrips.length} Active Trips</Badge>
      </div>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={defaultPosition}
              zoom={6}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              whenCreated={(map) => {
                setTimeout(() => map.invalidateSize(), 0);
              }}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController trips={activeTrips} />
              {activeTrips.map((trip) => (
                <Marker
                  key={trip.id}
                  position={[trip.coordinates.lat, trip.coordinates.lng]}
                  icon={createTruckIcon(selectedTrip === trip.id)}
                  eventHandlers={{
                    click: () => setSelectedTrip(trip.id),
                  }}
                >
                  <Popup minWidth={200}>
                    <div className="p-2">
                      <h3 className="font-semibold text-lg mb-2">{trip.id}</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Load:</strong> {trip.loadId}</p>
                        <p><strong>Driver:</strong> {trip.driver}</p>
                        <p><strong>Vehicle:</strong> {trip.truck}</p>
                        <p><strong>Route:</strong> {trip.route}</p>
                        <p><strong>Current:</strong> {trip.currentLocation}</p>
                        <p><strong>Speed:</strong> {trip.speed}</p>
                        <p><strong>ETA:</strong> {trip.eta}</p>
                        <p><strong>Progress:</strong> {trip.progress}%</p>
                        {trip.alerts.length > 0 && (
                          <p><strong>Alert:</strong> {trip.alerts[0]}</p>
                        )}
                        <div className="mt-2">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              trip.status === "On Time"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {trip.status}
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

      {/* Active Trips */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Shipments</h3>
        {activeTrips.map((trip) => (
          <Card
            key={trip.id}
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              selectedTrip === trip.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTrip(trip.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold flex items-center space-x-2">
                    <span>{trip.id}</span>
                    <Badge className="bg-gray-100 text-gray-800">{trip.loadId}</Badge>
                  </h4>
                  <p className="text-sm text-gray-600">{trip.route}</p>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      trip.status === "On Time"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {trip.status}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">{trip.lastUpdate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">{trip.truck}</p>
                    <p className="text-xs text-gray-600">Vehicle</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">{trip.driver}</p>
                    <p className="text-xs text-gray-600">Driver</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">{trip.currentLocation}</p>
                    <p className="text-xs text-gray-600">Current Location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">{trip.eta}</p>
                    <p className="text-xs text-gray-600">ETA</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{trip.progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trip.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-600">Current Speed: </span>
                  <span className="font-medium">{trip.speed}</span>
                </div>
                {trip.alerts.length > 0 && (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.alerts[0]}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveTracking;