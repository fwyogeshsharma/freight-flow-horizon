import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Phone, User, Lock, Shield, Zap, CheckCircle } from "lucide-react";

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState<"phone" | "username">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const baseUrl = "https://35.244.19.78:8042";

  const validatePhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const handlePhoneLogin = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/persons/send_otp_while_joining`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            pc: "91",
            pn: phoneNumber,
            otp_type: "login",
            source: "Truth Tracker",
          }),
        }
      );

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Success",
          description: data.statusText || "OTP sent successfully",
        });

        if (data.test_otp) {
          toast({
            title: "Test OTP",
            description: `Test OTP: ${data.test_otp}`,
          });
          console.log(`Login OTP is :: ${data.test_otp}`);
        }

        navigate("/otp-verification", {
          state: { phoneNumber: "91" + phoneNumber },
          replace: true,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || data.statusText || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handlePhoneLogin:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUsernameLogin = async () => {
    try {
      const fullUsername = `91${username}`;
      const token = btoa(`${fullUsername}:${password}`);
      const response = await fetch(
        `${baseUrl}/persons/authenticate?source=Truth%20Tracker`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "currentCompanyId",
          data.user_record.current_company
        );
        localStorage.setItem(
          "currentLang",
          data.user_record.preferred_language
        );
        localStorage.setItem("currentUser", JSON.stringify(data.user_record));
        localStorage.setItem(
          "tokenDetails",
          JSON.stringify({
            access_token: data.user_record.token,
            access_token_expires_in: null,
            refresh_token: null,
          })
        );

        // Fetch company details using current_company ID
        const companyResponse = await fetch(
          `${baseUrl}/companies?embedded={"identities.photos.photo":1}&where={"_id":"${data.user_record.current_company}"}&projection={"name":1,"logo":1,"public_profile_url":1,"company_roles":1,"created_by":1}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${data.user_record.token}`,
            },
          }
        );

        const companyData = await companyResponse.json();

        if (
          companyResponse.status >= 200 &&
          companyResponse.status < 300 &&
          companyData._items &&
          companyData._items.length > 0
        ) {
          const company = companyData._items[0];
          localStorage.setItem("currentCompanyName", company.name);
          localStorage.setItem("currentCompanyRecord", JSON.stringify(company));
          localStorage.setItem(
            "currentCompanyLogo",
            company.logo || "undefined"
          );
        } else {
          console.error("Failed to fetch company data:", companyData);
          localStorage.setItem(
            "currentCompanyName",
            "RollingRadius Logistics Pvt. Ltd."
          ); // Fallback
          localStorage.setItem("currentCompanyLogo", "undefined"); // Fallback
          localStorage.setItem("currentCompanyRecord", JSON.stringify({})); // Fallback empty object
        }
        toast({
          title: "Success",
          description: "Login successful",
        });
        navigate("/dashboard", { replace: true });
      } else {
        toast({
          title: "Invalid Credentials",
          description: data.error || "Please check your username and password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleUsernameLogin:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    navigate("/reset-password", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 relative overflow-hidden">
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
        <div className="w-full max-w-md">
          {/* Main Card */}
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-700/80 backdrop-blur-xl">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="mx-auto w-48 h-20 mb-4 flex items-center justify-center">
                <Link to="/">
                  <img
                      src="/rr_logo.jpg"
                      alt="Rolling Radius"
                      className="w-full h-full object-contain cursor-pointer"
                  />
                </Link>
              </div>
              <CardTitle className="text-4xl font-bold text-gray-800 dark:text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                STREAMLINE YOUR LOGISTICS
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Login Method Toggle */}
              <div className="flex rounded-xl bg-gray-100 dark:bg-gray-600 p-1 backdrop-blur-sm">
                <button
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    loginMethod === "phone"
                      ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                  onClick={() => setLoginMethod("phone")}
                >
                  <Phone className="h-4 w-4" />
                  Phone Number
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    loginMethod === "username"
                      ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                  onClick={() => setLoginMethod("username")}
                >
                  <User className="h-4 w-4" />
                  Username
                </button>
              </div>

              {/* Phone Login Form */}
              {loginMethod === "phone" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        className="rounded-l-none border-l-0 focus:ring-2 focus:ring-blue-500/20 text-base"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <Button
  onClick={handlePhoneLogin}
  className="w-full h-14 bg-[#3997CD] hover:bg-[#2f7cb1] text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
>
  <Zap className="h-5 w-5 mr-2" />
  Send OTP
</Button>
                </div>
              )}

              {/* Username Login Form */}
              {loginMethod === "username" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="username"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-base"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-base"
                    />
                  </div>
                  <Button
  onClick={handleUsernameLogin}
  className="w-full h-12 bg-[#3997CD] hover:bg-[#2f7cb1] text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
>
  <Lock className="h-5 w-5 mr-2" />
  Login
</Button>
                </div>
              )}

              {/* Action Links */}
              <div className="flex flex-col space-y-3 text-center border-t border-gray-200 dark:border-gray-600 pt-4">
                <button
                  onClick={() => navigate("/signup", { replace: true })}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold text-base transition-all duration-200 hover:scale-105"
                >
                  Create New Account
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium text-sm transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;