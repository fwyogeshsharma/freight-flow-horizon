import { useState, useEffect } from "react";
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
import { ArrowLeft, Shield, Smartphone } from "lucide-react";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, isPasswordReset } = location.state || {};
  const baseUrl = "https://35.244.19.78:8042";

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const validateOTP = (otpValue: string) => {
    return /^\d{6}$/.test(otpValue);
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const countryCode = phoneNumber.slice(0, 2); // e.g., "+91"
      const number = phoneNumber.slice(2); // e.g., "9876543210"

      if (isPasswordReset) {
        navigate("/new-password", { state: { phoneNumber, otp } });
      } else {
        const response = await fetch(`${baseUrl}/persons/login_with_otp/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            pc: countryCode,
            pn: number,
            otp,
            source: "Truth Tracker",
          }),
        });

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
            localStorage.setItem(
              "currentCompanyRecord",
              JSON.stringify(company)
            );
            localStorage.setItem(
              "currentCompanyLogo",
              company.logo || "undefined"
            );
          } else {
            console.error("Failed to fetch company data:", companyData);
            localStorage.setItem(
              "currentCompanyName",
              null
            ); // Fallback
            localStorage.setItem("currentCompanyLogo", null); // Fallback
            localStorage.setItem("currentCompanyRecord", JSON.stringify({})); // Fallback empty object
          }

          toast({
            title: "Success",
            description: "Login successful",
          });
          navigate("/dashboard", { replace: true });
        } else {
          toast({
            title: "Invalid OTP",
            description: data.statusText || "The OTP you entered is incorrect",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error in handleVerifyOTP:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setCountdown(30);

    try {
      const countryCode = phoneNumber.slice(0, 2);
      const number = phoneNumber.slice(2);

      const response = await fetch(
        `${baseUrl}/persons/${
          isPasswordReset ? "forgot_password_otp" : "send_otp_while_joining"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            pc: countryCode,
            pn: number,
            ...(isPasswordReset ? {} : { otp_type: "login" }),
            source: "Truth Tracker",
          }),
        }
      );

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "OTP Sent",
          description: "A new OTP has been sent to your phone number",
        });

        if (data.test_otp) {
          toast({
            title: "Test OTP",
            description: `Test OTP: ${data.test_otp}`,
          });
          console.log(`Resend OTP is :: ${data.test_otp}`);
        }
      } else {
        toast({
          title: "Error",
          description: data.statusText || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleResendOTP:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    if (isPasswordReset) {
      navigate("/reset-password");
    } else {
      navigate("/login");
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
                onClick={handleGoBack}
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
              <div className="w-11" />
            </div>
            <CardTitle className="text-3xl font-bold bg-[#3997CD] from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verify OTP
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Enter the 6-digit code sent to {phoneNumber}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="otp"
                className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                OTP Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-14 text-center text-2xl font-mono tracking-widest rounded-xl focus:ring-2 focus:ring-blue-500/20"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6}
              className="w-full h-14 bg-[#3997CD] from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Verify OTP
                </>
              )}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  className="text-primary hover:text-primary/80 font-semibold transition-all duration-200 hover:scale-105"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-muted-foreground text-sm">
                  Resend OTP in {countdown} seconds
                </span>
              )}
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-muted">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Secure Verification
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    OTP expires in 10 minutes for your security
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

export default OTPVerification;
