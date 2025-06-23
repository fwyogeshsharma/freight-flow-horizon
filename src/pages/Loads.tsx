import React, { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  MapPin, 
  Truck, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Weight,
  Package,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Star,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Route,
  Timer,
  Phone,
  Mail,
  Building,
  Navigation2
} from "lucide-react";

// Remove the custom Navigation component since we're importing the original

// PostNewLoad Component
const PostNewLoad = () => {
  const [formData, setFormData] = useState({
    loadType: '',
    weight: '',
    from: '',
    to: '',
    pickupDate: '',
    deliveryDate: '',
    priority: 'Medium',
    specialRequirements: '',
    budget: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Load</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="loadType">Load Type</Label>
            <Select value={formData.loadType} onValueChange={(value) => setFormData({...formData, loadType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select load type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="chemicals">Chemicals</SelectItem>
                <SelectItem value="steel">Steel Coils</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="food">Food Products</SelectItem>
                <SelectItem value="machinery">Machinery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="weight">Weight (tons)</Label>
            <Input 
              id="weight"
              type="number" 
              placeholder="Enter weight"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="from">Origin</Label>
            <Input 
              id="from"
              placeholder="From city"
              value={formData.from}
              onChange={(e) => setFormData({...formData, from: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="to">Destination</Label>
            <Input 
              id="to"
              placeholder="To city"
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <Input 
              id="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input 
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input 
              id="budget"
              type="number"
              placeholder="Enter budget"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="specialRequirements">Special Requirements</Label>
          <Textarea 
            id="specialRequirements"
            placeholder="Any special handling requirements..."
            value={formData.specialRequirements}
            onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
            rows={4}
          />
        </div>

        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Send className="h-4 w-4 mr-2" />
          Post Load
        </Button>
      </form>
    </div>
  );
};

// CarrierResponses Component
const CarrierResponses = ({ selectedLoad }) => {
  const responses = [
    {
      id: 1,
      carrierName: "Swift Logistics",
      rating: 4.8,
      price: "₹2,45,000",
      eta: "48 hours",
      contact: "+91 98765 43210",
      email: "contact@swiftlogistics.com",
      experience: "15 years",
      vehicles: "25 trucks"
    },
    {
      id: 2,
      carrierName: "Express Transport",
      rating: 4.6,
      price: "₹2,38,000",
      eta: "52 hours",
      contact: "+91 87654 32109",
      email: "info@expresstransport.com",
      experience: "12 years",
      vehicles: "18 trucks"
    },
    {
      id: 3,
      carrierName: "Prime Movers",
      rating: 4.9,
      price: "₹2,52,000",
      eta: "45 hours",
      contact: "+91 76543 21098",
      email: "hello@primemovers.com",
      experience: "20 years",
      vehicles: "40 trucks"
    }
  ];

  if (!selectedLoad) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <FileText className="h-12 w-12 mx-auto text-gray-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">No Load Selected</h2>
        <p className="text-gray-600">Select a load from the dashboard to view carrier responses</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrier Responses for {selectedLoad}</h2>
        <p className="text-gray-600">{responses.length} carriers have submitted quotes</p>
      </div>

      <div className="space-y-4">
        {responses.map((response) => (
          <Card key={response.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{response.carrierName}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{response.rating} rating</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{response.price}</p>
                  <p className="text-sm text-gray-600">ETA: {response.eta}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-medium">{response.contact}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{response.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium">{response.experience}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Fleet Size</p>
                    <p className="text-sm font-medium">{response.vehicles}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Accept Quote
                </Button>
                <Button variant="outline">
                  View Profile
                </Button>
                <Button variant="outline">
                  Message Carrier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// LoadMatchingDashboard Component
const LoadMatchingDashboard = () => {
  const matchedLoads = [
    {
      id: "LD005",
      type: "Pharmaceuticals",
      weight: "5 tons",
      from: "Mumbai",
      to: "Ahmedabad",
      matchScore: 95,
      suggestedCarriers: 8
    },
    {
      id: "LD006",
      type: "Auto Parts",
      weight: "12 tons",
      from: "Chennai",
      to: "Coimbatore",
      matchScore: 87,
      suggestedCarriers: 5
    },
    {
      id: "LD007",
      type: "Food Products",
      weight: "18 tons",
      from: "Delhi",
      to: "Jaipur",
      matchScore: 78,
      suggestedCarriers: 12
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Load Matching</h2>
        <p className="text-gray-600">Intelligent matching based on route optimization, carrier preferences, and historical data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold text-green-600">86%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Carriers</p>
                <p className="text-2xl font-bold text-purple-600">156</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {matchedLoads.map((load) => (
          <Card key={load.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{load.id}</h3>
                  <p className="text-gray-600">{load.type} • {load.weight}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Route className="h-3 w-3 mr-1" />
                    {load.from} → {load.to}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{width: `${load.matchScore}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{load.matchScore}%</span>
                  </div>
                  <p className="text-sm text-gray-600">{load.suggestedCarriers} carriers matched</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  View Matches
                </Button>
                <Button variant="outline">
                  Auto-Assign Best Match
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// BiddingInterface Component
const BiddingInterface = () => {
  const activeBids = [
    {
      id: "BID001",
      loadId: "LD008",
      type: "Machinery",
      highestBid: "₹3,25,000",
      totalBids: 12,
      timeLeft: "2h 45m",
      status: "Active"
    },
    {
      id: "BID002", 
      loadId: "LD009",
      type: "Chemicals",
      highestBid: "₹2,88,000",
      totalBids: 8,
      timeLeft: "5h 20m",
      status: "Active"
    },
    {
      id: "BID003",
      loadId: "LD010", 
      type: "Electronics",
      highestBid: "₹1,95,000",
      totalBids: 15,
      timeLeft: "Ended",
      status: "Closed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Bidding System</h2>
        <p className="text-gray-600">Real-time competitive bidding for optimal carrier selection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Auctions</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <Timer className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bids</p>
                <p className="text-2xl font-bold text-blue-600">247</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Savings</p>
                <p className="text-2xl font-bold text-green-600">18%</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bidding Carriers</p>
                <p className="text-2xl font-bold text-purple-600">89</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {activeBids.map((bid) => (
          <Card key={bid.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bid.loadId}</h3>
                  <p className="text-gray-600">{bid.type}</p>
                  <Badge className={bid.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {bid.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{bid.highestBid}</p>
                  <p className="text-sm text-gray-600">Highest Bid</p>
                  <p className="text-sm text-gray-500">{bid.totalBids} total bids</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {bid.status === 'Active' ? `Time left: ${bid.timeLeft}` : 'Auction ended'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {bid.status === 'Active' ? (
                  <>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View Live Bids
                    </Button>
                    <Button variant="outline">
                      Set Reserve Price
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                      End Auction
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Select Winner
                    </Button>
                    <Button variant="outline">
                      View Results
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ShipmentTracking Component
const ShipmentTracking = () => {
  const trackingData = [
    {
      id: "LD002",
      type: "Electronics", 
      from: "Chennai",
      to: "Bangalore",
      status: "In Transit",
      currentLocation: "Hosur",
      progress: 75,
      estimatedArrival: "2024-01-18 14:30",
      carrier: "Express Transport",
      driverContact: "+91 87654 32109"
    },
    {
      id: "LD003",
      type: "Chemicals",
      from: "Pune", 
      to: "Hyderabad",
      status: "In Transit",
      currentLocation: "Solapur",
      progress: 45,
      estimatedArrival: "2024-01-19 10:15",
      carrier: "Swift Logistics",
      driverContact: "+91 98765 43210"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Shipment Tracking</h2>
        <p className="text-gray-600">Monitor your loads in real-time with GPS tracking and status updates</p>
      </div>

      {trackingData.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Navigation2 className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Active Shipments</h3>
          <p className="text-gray-600">Assigned loads will appear here for tracking</p>
        </div>
      ) : (
        <div className="space-y-6">
          {trackingData.map((shipment) => (
            <Card key={shipment.id} className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{shipment.id}</h3>
                    <p className="text-gray-600">{shipment.type}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Route className="h-3 w-3 mr-1" />
                      {shipment.from} → {shipment.to}
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {shipment.status}
                  </Badge>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
                      style={{width: `${shipment.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Current Location</p>
                      <p className="font-semibold text-gray-900">{shipment.currentLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Est. Arrival</p>
                      <p className="font-semibold text-gray-900">{shipment.estimatedArrival}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Carrier</p>
                      <p className="font-semibold text-gray-900">{shipment.carrier}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Navigation2 className="h-4 w-4 mr-2" />
                    Live Map
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Driver
                  </Button>
                  <Button variant="outline">
                    View Timeline
                  </Button>
                  <Button variant="outline">
                    Download POD
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const Loads = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loads = [
    {
      id: "LD001",
      type: "Steel Coils",
      weight: "20 tons",
      from: "Mumbai",
      to: "Delhi", 
      pickupDate: "2024-01-15",
      deliveryDate: "2024-01-17",
      status: "Open",
      quotes: 3,
      priority: "High",
      value: "₹2,50,000"
    },
    {
      id: "LD002",
      type: "Electronics",
      weight: "8 tons",
      from: "Chennai",
      to: "Bangalore",
      pickupDate: "2024-01-16",
      deliveryDate: "2024-01-18", 
      status: "Assigned",
      quotes: 5,
      priority: "Medium",
      value: "₹1,80,000"
    },
    {
      id: "LD003",
      type: "Chemicals",
      weight: "15 tons",
      from: "Pune",
      to: "Hyderabad",
      pickupDate: "2024-01-17",
      deliveryDate: "2024-01-19",
      status: "In Transit", 
      quotes: 2,
      priority: "Low",
      value: "₹3,20,000"
    },
    {
      id: "LD004",
      type: "Textiles",
      weight: "12 tons",
      from: "Surat",
      to: "Jaipur",
      pickupDate: "2024-01-18",
      deliveryDate: "2024-01-20",
      status: "Delivered",
      quotes: 4,
      priority: "Medium",
      value: "₹1,95,000"
    }
  ];

  const filteredLoads = useMemo(() => {
    return loads.filter(load => {
      const matchesSearch = searchTerm === "" || 
        load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.to.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        load.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <AlertCircle className="h-4 w-4" />;
      case "Assigned": return <Clock className="h-4 w-4" />;
      case "In Transit": return <Truck className="h-4 w-4" />;
      case "Delivered": return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Assigned": return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Transit": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewQuotes = (loadId) => {
    setSelectedLoad(loadId);
    setActiveTab("responses");
  };

  const stats = {
    total: loads.length,
    open: loads.filter(l => l.status === "Open").length,
    assigned: loads.filter(l => l.status === "Assigned").length,
    inTransit: loads.filter(l => l.status === "In Transit").length,
    delivered: loads.filter(l => l.status === "Delivered").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Load Management</h1>
              <p className="text-gray-600 mt-1">Manage and track your freight loads efficiently</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              onClick={() => setActiveTab("post-load")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Load
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="post-load" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Post Load
            </TabsTrigger>
            <TabsTrigger value="responses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Responses
            </TabsTrigger>
            <TabsTrigger value="matching" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Matching
            </TabsTrigger>
            <TabsTrigger value="bidding" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Bidding
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Loads</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Open</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.open}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Assigned</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">In Transit</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
                    </div>
                    <Truck className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search loads by ID, type, origin, or destination..."
                  className="pl-10 bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-white shadow-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Load Cards */}
            <div className="space-y-4">
              {filteredLoads.map((load) => (
                <Card key={load.id} className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-900">{load.id}</CardTitle>
                        <p className="text-gray-600 flex items-center mt-1">
                          <Package className="h-4 w-4 mr-1" />
                          {load.type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${getPriorityColor(load.priority)} border`}>
                          {load.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(load.status)} border flex items-center gap-1`}>
                          {getStatusIcon(load.status)}
                          {load.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                      <div className="flex items-center">
                        <Weight className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Weight</p>
                          <p className="font-semibold text-gray-900">{load.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Route</p>
                          <p className="font-semibold text-gray-900 text-sm">{load.from} → {load.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="font-semibold text-gray-900 text-sm">{load.pickupDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Delivery</p>
                          <p className="font-semibold text-gray-900 text-sm">{load.deliveryDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Quotes</p>
                          <p className="font-semibold text-gray-900">{load.quotes} received</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Value</p>
                          <p className="font-semibold text-gray-900">{load.value}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="hover:bg-gray-50">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewQuotes(load.id)}
                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      >
                        <Truck className="h-3 w-3 mr-1" />
                        View Quotes ({load.quotes})
                      </Button>
                      {load.status === "Open" && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        >
                          Assign Carrier
                        </Button>
                      )}
                      {load.status === "In Transit" && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                        >
                          Track Shipment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLoads.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Package className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No loads found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  variant="outline" 
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="post-load">
            <PostNewLoad />
          </TabsContent>

          <TabsContent value="responses">
            <CarrierResponses selectedLoad={selectedLoad} />
          </TabsContent>

          <TabsContent value="matching">
            <LoadMatchingDashboard />
          </TabsContent>

          <TabsContent value="bidding">
            <BiddingInterface />
          </TabsContent>

          <TabsContent value="tracking">
            <ShipmentTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Loads;