
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Shield, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const features = [{
    icon: MapPin,
    title: "Fleet Management",
    description: "Manage your entire fleet with real-time tracking and optimization"
  }, {
    icon: MapPin,
    title: "Live Tracking",
    description: "Track shipments in real-time with GPS-enabled monitoring"
  }, {
    icon: Users,
    title: "Multi-Role Access",
    description: "Role-based access for fleet owners, drivers, and factory owners"
  }, {
    icon: Shield,
    title: "Secure & Compliant",
    description: "KYC verification and document management for compliance"
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-100 logistics-pattern">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500/10 rounded-full">
              <img 
                src="/lovable-uploads/715bec04-0085-4de6-b65b-eff7a7bbbc5c.png" 
                alt="RollingRadius Logo" 
                className="h-16 w-auto"
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">RollingRadius</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Complete logistics management platform for seamless freight operations, 
            real-time tracking, and intelligent load matching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                Get Started
                <ArrowUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-blue-300 text-blue-600 hover:bg-blue-50">
              Learn More
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg w-fit">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role-Based Access Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Built for Every Stakeholder</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Super Admin", "Fleet Owner", "Factory Owner", "Transport Agent", "Driver", "Consignee"].map((role, index) => (
              <div key={index} className="p-4 bg-white/80 rounded-lg border hover:border-blue-300 transition-colors">
                <div className="text-sm font-medium text-blue-600">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
