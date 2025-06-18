
import Navigation from "@/components/Navigation";
import { useState } from "react";
import RealTimeTrackingMap from "@/components/maps/RealTimeTrackingMap";

const EnhancedTracking = () => {
  const [selectedTrip, setSelectedTrip] = useState<string>('');

  const sampleTrips = [
    {
      id: "T001",
      loadId: "LD001",
      truck: "TN01AB1234",
      driver: "Raj Kumar",
      origin: "Mumbai",
      destination: "Delhi",
      currentLocation: {
        latitude: 19.4969,
        longitude: 72.9508,
        address: "Nashik, Maharashtra"
      },
      status: "On Time",
      speed: 65,
      eta: "14:30 Tomorrow",
      progress: 25
    },
    {
      id: "T002",
      loadId: "LD002",
      truck: "KA02CD5678",
      driver: "Suresh Babu",
      origin: "Chennai",
      destination: "Bangalore",
      currentLocation: {
        latitude: 12.3375,
        longitude: 77.7100,
        address: "Hosur Border"
      },
      status: "Delayed",
      speed: 45,
      eta: "16:45 Today",
      progress: 85
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Live Tracking</h1>
          <p className="text-muted-foreground">Real-time shipment monitoring with interactive maps</p>
        </div>

        <RealTimeTrackingMap
          trips={sampleTrips}
          selectedTrip={selectedTrip}
          onTripSelect={setSelectedTrip}
        />
      </div>
    </div>
  );
};

export default EnhancedTracking;
