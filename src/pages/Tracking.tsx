import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Truck, 
  Users, 
  Search,
  Filter,
  RefreshCw,
  Map,
  Clock,
  Route,
  AlertTriangle,
  CheckCircle,
  Phone,
  MessageSquare,
  Eye,
  Settings,
  Calendar,
  Activity
} from "lucide-react";

// Fix for default Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Enhanced truck icon with status colors
const createTruckIcon = (status: string, isSelected: boolean = false) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-green-500';
      case 'Delayed': return 'bg-red-500';
      case 'Early': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-10 h-10 ${getStatusColor(status)} rounded-full flex items-center justify-center text-white shadow-lg transform transition-all ${
          isSelected ? 'ring-4 ring-white ring-opacity-50 scale-110' : 'hover:scale-105'
        }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 ${getStatusColor(status)} opacity-70 rotate-45"></div>
        ${isSelected ? `
          <div class="absolute inset-0 rounded-full animate-ping ${getStatusColor(status)} opacity-75"></div>
        ` : ''}
      </div>
    `,
    className: 'truck-marker',
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
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
  driverPhone: string;
  lastUpdate: string;
  speed: string;
  distance: string;
}

// Component to handle map bounds
const MapController = ({ shipments }: { shipments: Shipment[] }) => {
  const map = useMap();

  useEffect(() => {
    if (shipments.length > 0) {
      const bounds = L.latLngBounds(
        shipments.map(shipment => [shipment.coordinates.lat, shipment.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [80, 80] });
    }
  }, [shipments, map]);

  return null;
};

const Tracking = () => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [lastRefresh, setLastRefresh] = useState(new Date());

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
      coordinates: { lat: 19.9975, lng: 73.7898 },
      driverPhone: "+91 98765 43210",
      lastUpdate: "2 mins ago",
      speed: "65 km/h",
      distance: "1,240 km"
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
      coordinates: { lat: 12.7368, lng: 77.8380 },
      driverPhone: "+91 87654 32109",
      lastUpdate: "5 mins ago",
      speed: "45 km/h",
      distance: "350 km"
    },
    {
      id: "SH003",
      load: "LD003",
      driver: "Amit Singh",
      vehicle: "MH03EF9012",
      from: "Pune",
      to: "Goa",
      currentLocation: "Kolhapur",
      progress: 60,
      eta: "3 hours",
      status: "Early",
      coordinates: { lat: 16.7050, lng: 74.2433 },
      driverPhone: "+91 76543 21098",
      lastUpdate: "1 min ago",
      speed: "70 km/h",
      distance: "180 km"
    },
  ];

  // Default map center (India)
  const defaultPosition: [number, number] = [20.5937, 78.9629];

  // Filter shipments based on search and status
  const filteredShipments = activeShipments.filter(shipment => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || shipment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: activeShipments.length,
    onTime: activeShipments.filter(s => s.status === "On Time").length,
    delayed: activeShipments.filter(s => s.status === "Delayed").length,
    early: activeShipments.filter(s => s.status === "Early").length,
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // Add refresh logic here
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time': return <CheckCircle className="h-4 w-4" />;
      case 'Delayed': return <AlertTriangle className="h-4 w-4" />;
      case 'Early': return <Activity className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-800 border-green-200';
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Early': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle map initialization issues
  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    setTimeout(handleResize, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Tracking</h1>
            <p className="text-gray-600">Real-time monitoring of fleet operations</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button variant="outline" onClick={handleRefresh} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Shipments</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">On Time</p>
                  <p className="text-3xl font-bold text-green-600">{stats.onTime}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delayed</p>
                  <p className="text-3xl font-bold text-red-600">{stats.delayed}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Early</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.early}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white shadow-lg border-0 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by shipment ID, driver, vehicle, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="On Time">On Time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Early">Early</option>
                </select>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>More Filters</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Map className="h-5 w-5 text-blue-600" />
                    <span>Live Map View</span>
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {filteredShipments.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-inner bg-gray-100">
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
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    <MapController shipments={filteredShipments} />
                    
                    {filteredShipments.map((shipment) => (
                      <Marker
                        key={shipment.id}
                        position={[shipment.coordinates.lat, shipment.coordinates.lng]}
                        icon={createTruckIcon(shipment.status, selectedShipment === shipment.id) as L.DivIcon}
                        eventHandlers={{
                          click: () => setSelectedShipment(shipment.id),
                        }}
                      >
                        <Popup minWidth={280} maxWidth={320}>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-bold text-lg text-gray-900">{shipment.id}</h3>
                              <Badge className={`${getStatusColor(shipment.status)} flex items-center space-x-1`}>
                                {getStatusIcon(shipment.status)}
                                <span>{shipment.status}</span>
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500 font-medium">Load ID</p>
                                <p className="text-gray-900">{shipment.load}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">Driver</p>
                                <p className="text-gray-900">{shipment.driver}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">Vehicle</p>
                                <p className="text-gray-900">{shipment.vehicle}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">Speed</p>
                                <p className="text-gray-900">{shipment.speed}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-gray-500 font-medium text-sm">Route</p>
                              <p className="text-gray-900 font-medium">{shipment.from} → {shipment.to}</p>
                              <p className="text-gray-600 text-sm">Currently: {shipment.currentLocation}</p>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm font-bold text-gray-900">{shipment.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${shipment.progress}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>ETA: {shipment.eta}</span>
                                <span>{shipment.lastUpdate}</span>
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
          </div>

          {/* Shipments List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Active Shipments</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {filteredShipments.length} of {activeShipments.length}
              </Badge>
            </div>
            
            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {filteredShipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                    selectedShipment === shipment.id 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedShipment(shipment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{shipment.id}</h3>
                        <p className="text-sm text-gray-600">{shipment.load}</p>
                      </div>
                      <Badge className={`${getStatusColor(shipment.status)} flex items-center space-x-1`}>
                        {getStatusIcon(shipment.status)}
                        <span className="text-xs font-medium">{shipment.status}</span>
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{shipment.driver}</p>
                          <p className="text-xs text-gray-500">{shipment.vehicle}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Route className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{shipment.from} → {shipment.to}</p>
                          <p className="text-xs text-gray-500">Currently: {shipment.currentLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">ETA: {shipment.eta}</p>
                          <p className="text-xs text-gray-500">Speed: {shipment.speed} • {shipment.lastUpdate}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-700">Progress</span>
                          <span className="text-xs font-bold text-gray-900">{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${shipment.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Map className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;