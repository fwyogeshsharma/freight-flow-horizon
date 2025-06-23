import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, Truck, MapPin, Package, Users, Shield, Clock, Star, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pickupCity, setPickupCity] = useState('');
  const [dropCity, setDropCity] = useState('');
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
    'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal'
  ];

  const stats = [
    { number: '15K+', label: 'Trucks' },
    { number: '50K+', label: 'Deliveries' },
    { number: '5K+', label: 'Clients' },
    { number: '24/7', label: 'Support' }
  ];

  const vehicleTypes = [
    { name: 'Mini Truck', capacity: '1-2 tons', image: '🚚' },
    { name: 'Medium Truck', capacity: '3-7 tons', image: '🚛' },
    { name: 'Large Truck', capacity: '8-15 tons', image: '🚚' },
    { name: 'Trailer', capacity: '16-30 tons', image: '🚛' }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      company: 'ABC Electronics',
      rating: 5,
      text: 'RollingRadius has transformed our logistics operations. The real-time tracking and reliable service have significantly improved our supply chain efficiency.'
    },
    {
      name: 'Priya Sharma',
      company: 'Fashion Forward',
      rating: 5,
      text: 'Excellent service and competitive pricing. The booking process is so simple, and the drivers are always professional and punctual.'
    },
    {
      name: 'Amit Patel',
      company: 'Steel Industries',
      rating: 5,
      text: 'We have been using RollingRadius for over a year now. Their technology platform and customer service are outstanding.'
    },
    {
      name: 'Sunita Mehta',
      company: 'Fresh Foods Co.',
      rating: 5,
      text: 'Perfect for our perishable goods delivery. Temperature-controlled trucks and timely delivery ensure our products reach customers fresh.'
    },
    {
      name: 'Vikram Singh',
      company: 'Construction Plus',
      rating: 5,
      text: 'Heavy equipment transportation made easy. Their large trucks and experienced drivers handle our machinery with utmost care.'
    },
    {
      name: 'Neha Gupta',
      company: 'E-commerce Hub',
      rating: 5,
      text: 'Seamless integration with our systems. The API connectivity and real-time updates help us serve our customers better.'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredPickupCities = cities.filter(city => 
    city.toLowerCase().includes(pickupCity.toLowerCase())
  );

  const filteredDropCities = cities.filter(city => 
    city.toLowerCase().includes(dropCity.toLowerCase())
  );

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between items-center">
            <img src="public\lovable-uploads\rr_full_transp-removebg-preview.png" alt="RollingRadius Logo" className="h-10" />
            
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-primary-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-primary-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-primary-600 transition-colors">Services</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-primary-600 transition-colors">Testimonials</button>
            </nav>

            <div className="hidden md:flex items-center">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="border-primary-500 text-primary-600 hover:bg-primary-50">
                  Login
                </Button>
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-3 border-t border-gray-100">
              <div className="flex flex-col space-y-2 pt-3">
                <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-primary-600">Home</button>
                <button onClick={() => scrollToSection('features')} className="text-left text-gray-700 hover:text-primary-600">Features</button>
                <button onClick={() => scrollToSection('services')} className="text-left text-gray-700 hover:text-primary-600">Services</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-left text-gray-700 hover:text-primary-600">Testimonials</button>
                <div className="pt-2">
                  <Button variant="outline" size="sm">Login</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home">
        <div
          className="relative bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center"
          style={{
            backgroundImage: `url('public/lovable-uploads/truck2.png')`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-sm" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div
              className={`flex justify-center mb-6 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <div className="p-3 bg-white/30 rounded-full shadow-xl backdrop-blur-lg">
                <Truck className="h-12 w-12 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="p-3 bg-white/30 rounded-full shadow-xl backdrop-blur-lg">
              <img 
                src="public\lovable-uploads\rr_full_transp-removebg-preview.png" 
                alt="RollingRadius" 
                className="h-12 w-auto"
              />
            </div>
            <p
              className={`text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 transform transition-all duration-1000 delay-400 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              Streamline your logistics with real-time tracking, intelligent load
              matching, and seamless operations.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-3 justify-center transform transition-all duration-1000 delay-600 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <Button
                size="lg"
                className="text-base px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full"
                onClick={() => scrollToSection('booking')}
              >
                Book Your Truck
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-3 border-cyan-300 text-cyan-300 hover:bg-cyan-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full backdrop-blur-sm"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>
            <div
              className={`mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto transform transition-all duration-1000 delay-800 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-white/30 backdrop-blur-lg rounded-xl p-3 border border-cyan-300/30 shadow-lg transition-all duration-500 ${
                    currentStat === index ? "scale-105 opacity-100" : "opacity-80"
                  }`}
                >
                  <div className="text-xl font-bold text-cyan-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Book Your Transportation</h2>
              <p className="text-gray-600">
                Get instant quotes and book reliable transportation for your goods. Our platform connects you with verified drivers and ensures safe, timely delivery.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Shield className="text-primary-600" size={18} />
                  </div>
                  <span className="text-gray-700 text-sm">Verified & Insured Drivers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Clock className="text-primary-600" size={18} />
                  </div>
                  <span className="text-gray-700 text-sm">Real-time Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <MapPin className="text-primary-600" size={18} />
                  </div>
                  <span className="text-gray-700 text-sm">Pan-India Coverage</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 max-w-sm mx-auto w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Quick Booking</h3>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        step <= bookingStep ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="pickup" className="text-sm">Pickup Location</Label>
                    <div className="relative">
                      <Input
                        id="pickup"
                        placeholder="Enter pickup city"
                        value={pickupCity}
                        onChange={(e) => {
                          setPickupCity(e.target.value);
                          setShowPickupSuggestions(true);
                        }}
                        onFocus={() => setShowPickupSuggestions(true)}
                        className="h-9 text-sm"
                      />
                      {showPickupSuggestions && pickupCity && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-28 overflow-y-auto">
                          {filteredPickupCities.map((city) => (
                            <button
                              key={city}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 transition-colors"
                              onClick={() => {
                                setPickupCity(city);
                                setShowPickupSuggestions(false);
                              }}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="drop" className="text-sm">Drop Location</Label>
                    <div className="relative">
                      <Input
                        id="drop"
                        placeholder="Enter drop city"
                        value={dropCity}
                        onChange={(e) => {
                          setDropCity(e.target.value);
                          setShowDropSuggestions(true);
                        }}
                        onFocus={() => setShowDropSuggestions(true)}
                        className="h-9 text-sm"
                      />
                      {showDropSuggestions && dropCity && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-28 overflow-y-auto">
                          {filteredDropCities.map((city) => (
                            <button
                              key={city}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 transition-colors"
                              onClick={() => {
                                setDropCity(city);
                                setShowDropSuggestions(false);
                              }}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-3 h-9" 
                    onClick={() => setBookingStep(2)}
                    disabled={!pickupCity || !dropCity}
                  >
                    Next
                  </Button>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm">Select Vehicle Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {vehicleTypes.map((vehicle) => (
                        <div key={vehicle.name} className="border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:border-primary-500 transition-colors text-center">
                          <div className="text-lg mb-1">{vehicle.image}</div>
                          <div className="font-medium text-xs">{vehicle.name}</div>
                          <div className="text-xs text-gray-500">{vehicle.capacity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="weight" className="text-sm">Weight (in tons)</Label>
                    <Input id="weight" type="number" placeholder="Enter weight" max="30" className="h-9 text-sm" />
                    <p className="text-xs text-gray-500">Maximum 30 tons allowed</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setBookingStep(1)} className="flex-1 h-9">Back</Button>
                    <Button className="flex-1 h-9" onClick={() => setBookingStep(3)}>Next</Button>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm">Customer Type</Label>
                    <Select>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm">Name/Company Name</Label>
                    <Input id="name" placeholder="Enter your name or company name" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mobile" className="text-sm">Mobile Number</Label>
                    <Input id="mobile" type="tel" placeholder="Enter your mobile number" className="h-9 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setBookingStep(2)} className="flex-1 h-9">Back</Button>
                    <Button className="flex-1 h-9" onClick={() => setBookingStep(4)}>Next</Button>
                  </div>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="text-center space-y-3">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="text-lg font-semibold text-green-600">Booking Confirmed!</h3>
                  <p className="text-gray-600 text-sm">
                    Your booking request has been submitted. Our team will contact you shortly with the best quotes from verified drivers.
                  </p>
                  <Button 
                    className="w-full h-9" 
                    onClick={() => {
                      setBookingStep(1);
                      setPickupCity('');
                      setDropCity('');
                    }}
                  >
                    Book Another Trip
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Why Choose RollingRadius?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of logistics with our cutting-edge technology and comprehensive solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center space-y-3 p-4">
              <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <MapPin className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Real-time Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track your shipments in real-time with GPS monitoring and instant updates throughout the journey.
              </p>
            </div>

            <div className="text-center space-y-3 p-4">
              <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Shield className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Secure & Insured</h3>
              <p className="text-gray-600 text-sm">
                All shipments are fully insured with verified drivers and secure handling protocols.
              </p>
            </div>

            <div className="text-center space-y-3 p-4">
              <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Clock className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Round-the-clock customer support to assist you at every step of your logistics journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Services</h2>
            <p className="text-gray-600">Comprehensive logistics solutions for all your transportation needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { title: 'Full Truck Load', desc: 'Complete truck capacity for large shipments', icon: '🚛' },
              { title: 'Part Load', desc: 'Cost-effective shipping for smaller loads', icon: '📦' },
              { title: 'Express Delivery', desc: 'Fast and urgent delivery services', icon: '⚡' },
              { title: 'Warehousing', desc: 'Storage and inventory management', icon: '🏭' }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="text-2xl mb-2">{service.icon}</div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">What Our Clients Say</h2>
            <p className="text-gray-600">Trusted by thousands of businesses across India</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-100 max-w-2xl mx-auto">
                      <div className="flex items-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-current" size={16} />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                      <div>
                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>

            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <img src="public\lovable-uploads\715bec04-0085-4de6-b65b-eff7a7bbbc5c.png" alt="RollingRadius Logo" className="h-10 mb-3" />
              <p className="text-gray-400 mb-3 text-sm">
                Revolutionizing logistics with technology-driven solutions for seamless transportation.
              </p>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <span className="text-white text-xs font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Full Truck Load</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Part Load</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Express Delivery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Warehousing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Contact Info</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>📞 +91 98765 43210</p>
                <p>✉️ info@rollingradius.com</p>
                <p>📍 Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-400 text-sm">
            <p>© 2024 RollingRadius. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full shadow-lg transition-colors z-50"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
};

export default HeroSection;