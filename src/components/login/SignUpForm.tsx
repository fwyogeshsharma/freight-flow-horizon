import { useState } from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
// import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, User, Shield, Mail, Lock, Phone } from "lucide-react";

const SignUpForm = () => {
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber } = location.state || {};
  const baseUrl = "https://35.244.19.78:8042";

  const validateForm = () => {
    if (!/^\d{6}$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return false;
    }

    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return false;
    }

    if (password && password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password do not match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const countryCode = phoneNumber.slice(0, 2); // e.g., "+91"
      const number = phoneNumber.slice(2); // e.g., "9876543210"

      const response = await fetch(`${baseUrl}/persons/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control":
            "no-cache, no-store, must-revalidate, post-check=0, pre-check=0",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          name,
          otp,
          username,
          email,
          password: password || null,
          pc: countryCode,
          pn: number,
          referal_number: "",
          source: "Truth Tracker",
        }),
      });

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Account Created",
          description:
            "Your account has been created successfully. Please login.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description:
            data.error || data.statusText || "Failed to register user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleSignUp:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Theme Toggle */}
      {/*<div className="absolute top-6 right-6 z-10">*/}
      {/*  <ThemeToggle />*/}
      {/*</div>*/}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/signup")}
                className="p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 hover:scale-105 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="mx-auto w-48 h-20 mb-4 flex items-center justify-center">
                <Link to="/">
                  <img
                      src="/rr_logo.jpg"
                      alt="Rolling Radius"
                      className="w-full h-full object-contain cursor-pointer"
                  />
                </Link>
              </div>
              <div className="w-11"/>
            </div>
            <CardTitle
                className="text-3xl font-bold bg-[#2f7cb1] from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complete Sign Up
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Fill in your details to create your account for {phoneNumber}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="otp"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                OTP Code *
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                className="h-12 text-center text-xl font-mono tracking-widest rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="username"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <Button
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full h-14 bg-[#2f7cb1] from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>

            <div className="bg-muted/30 rounded-xl p-4 border border-muted mt-6">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Phone Verification
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your account will be linked to {phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpForm;
