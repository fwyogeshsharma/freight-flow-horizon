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
import { ArrowLeft, Lock, Shield, Eye, EyeOff } from "lucide-react";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, otp } = location.state || {};
  const baseUrl = "https://35.244.19.78:8042";

  const handleResetPassword = async () => {
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const countryCode = phoneNumber.slice(0, 2); // e.g., "+91"
      const number = phoneNumber.slice(2); // e.g., "9876543210"

      const response = await fetch(`${baseUrl}/persons/forgot_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          pc: countryCode,
          pn: number,
          otp,
          password,
          source: "Truth Tracker",
        }),
      });

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Password Reset Successful",
          description:
            "Your password has been reset successfully. Please login with your new password.",
        });

        if (data.test_otp) {
          toast({
            title: "Test OTP",
            description: `Test OTP: ${data.test_otp}`,
          });
          console.log(`Reset Password OTP is :: ${data.test_otp}`);
        }

        navigate("/");
      } else {
        toast({
          title: "Error",
          description: data.statusText || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleResetPassword:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 dark:from-slate-950 dark:via-green-950 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
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
                onClick={() =>
                  navigate("/otp-verification", {
                    state: { phoneNumber, isPasswordReset: true },
                  })
                }
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
              {/* Spacer for centering */}
            </div>
            <CardTitle
                className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Set New Password
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Create a secure password for your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-base rounded-xl focus:ring-2 focus:ring-green-500/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-14 text-base rounded-xl focus:ring-2 focus:ring-green-500/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    password.length >= 6 ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={
                    password.length >= 6
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    password === confirmPassword && password.length > 0
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={
                    password === confirmPassword && password.length > 0
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>

            <Button
              onClick={handleResetPassword}
              disabled={
                isLoading || password.length < 6 || password !== confirmPassword
              }
              className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Resetting Password...
                </div>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Reset Password
                </>
              )}
            </Button>

            <div className="bg-muted/30 rounded-xl p-4 border border-muted">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Password Security
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose a strong password to keep your account secure
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

export default NewPassword;
