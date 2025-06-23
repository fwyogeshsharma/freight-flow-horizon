import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Truck, AlertTriangle, MessageSquare, Navigation, Phone, Settings, Calendar, BarChart3, Map, Shield } from "lucide-react";

// Mock data for demonstration
const mockTrips = [
  {
    id: "1",
    load_id: "LD-2024-001",
    truck_id: "TRK-456",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    status: "started",
    started_at: "2025-06-23T08:00:00Z",
    created_at: "2025-06-23T07:30:00Z",
    progress: 65,
    estimatedArrival: "14:30",
    distance: "372 miles"
  },
  {
    id: "2",
    load_id: "LD-2024-002",
    truck_id: "TRK-456",
    origin: "Phoenix, AZ",
    destination: "Denver, CO",
    status: "assigned",
    started_at: null,
    created_at: "2025-06-22T15:00:00Z"
  },
  {
    id: "3",
    load_id: "LD-2024-003",
    truck_id: "TRK-456",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    status: "completed",
    started_at: "2025-06-21T09:00:00Z",
    created_at: "2025-06-21T08:30:00Z"
  }
];

const DriverDashboard = () => {
  const [trips, setTrips] = useState(mockTrips);
  const [activeTrip, setActiveTrip] = useState(mockTrips[0]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-sky-400 hover:bg-sky-500';
      case 'started': return 'bg-cyan-500 hover:bg-cyan-600';
      case 'paused': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-400 hover:bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned': return <Clock className="h-3 w-3" />;
      case 'started': return <Navigation className="h-3 w-3" />;
      case 'paused': return <AlertTriangle className="h-3 w-3" />;
      case 'completed': return <Shield className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Driver Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Active Trip Card - Enhanced */}
        {activeTrip && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-sky-400 to-cyan-500 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xl font-bold">Active Trip</span>
                    <p className="text-sky-100 text-sm font-normal">Load ID: {activeTrip.load_id}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Navigation className="h-3 w-3 mr-1" />
                  IN PROGRESS
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{activeTrip.origin}</p>
                    <p className="text-sky-100 text-sm">Origin</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{activeTrip.destination}</p>
                    <p className="text-sky-100 text-sm">Destination</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{activeTrip.truck_id}</p>
                    <p className="text-sky-100 text-sm">Vehicle</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{activeTrip.estimatedArrival || 'TBD'}</p>
                    <p className="text-sky-100 text-sm">ETA</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              {activeTrip.progress && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Trip Progress</span>
                    <span className="text-sm">{activeTrip.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                      style={{ width: `${activeTrip.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  className="bg-white text-sky-600 hover:bg-gray-50 font-medium"
                >
                  <Map className="h-4 w-4 mr-2" />
                  View Route
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Dispatcher
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions - Enhanced Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Clock className="h-8 w-8" />,
              title: "Trip Management",
              description: "Start, pause, or end trips",
              color: "from-sky-400 to-sky-500",
              iconBg: "bg-sky-100 text-sky-600"
            },
            {
              icon: <AlertTriangle className="h-8 w-8" />,
              title: "Emergency Alert",
              description: "Send panic button alert",
              color: "from-red-500 to-red-600",
              iconBg: "bg-red-100 text-red-600"
            },
            {
              icon: <MessageSquare className="h-8 w-8" />,
              title: "Messages",
              description: "Chat with dispatchers",
              color: "from-cyan-500 to-cyan-600",
              iconBg: "bg-cyan-100 text-cyan-600"
            },
            {
              icon: <Truck className="h-8 w-8" />,
              title: "Vehicle Inspection",
              description: "Log inspection reports",
              color: "from-orange-500 to-orange-600",
              iconBg: "bg-orange-100 text-orange-600"
            }
          ].map((action, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className={`${action.iconBg} p-3 rounded-xl mx-auto mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{action.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-50 to-sky-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-600 text-sm font-medium uppercase tracking-wide">This Week</p>
                  <p className="text-3xl font-bold text-slate-900">1,247</p>
                  <p className="text-slate-600 text-sm">Miles Driven</p>
                </div>
                <div className="p-3 bg-sky-200 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-600 text-sm font-medium uppercase tracking-wide">This Month</p>
                  <p className="text-3xl font-bold text-slate-900">12</p>
                  <p className="text-slate-600 text-sm">Trips Completed</p>
                </div>
                <div className="p-3 bg-cyan-200 rounded-xl">
                  <Calendar className="h-8 w-8 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium uppercase tracking-wide">Safety Score</p>
                  <p className="text-3xl font-bold text-slate-900">98.5%</p>
                  <p className="text-slate-600 text-sm">Excellent Rating</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-xl">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips - Enhanced */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Truck className="h-5 w-5 text-slate-600" />
                </div>
                Recent Trips
              </div>
              <Button variant="outline" size="sm" className="bg-white/80">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trips.map((trip, index) => (
                <div 
                  key={trip.id} 
                  className="group flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-white/60 hover:bg-white/80"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <Truck className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{trip.load_id}</p>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {trip.origin} → {trip.destination}
                      </p>
                      {trip.distance && (
                        <p className="text-xs text-slate-500 mt-1">{trip.distance}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {trip.progress && (
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-slate-900">{trip.progress}%</p>
                        <div className="w-16 bg-slate-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${trip.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <Badge className={`${getStatusColor(trip.status)} text-white border-0 flex items-center gap-1`}>
                      {getStatusIcon(trip.status)}
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              {trips.length === 0 && (
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg font-medium">No trips assigned yet</p>
                  <p className="text-slate-400 text-sm">New assignments will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;