import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
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
import { ArrowLeft, Phone, Shield, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState<"phone" | "otp-sent">("phone");
  const navigate = useNavigate();
  const baseUrl = "https://35.244.19.78:8042";

  const validatePhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSendOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/persons/forgot_password_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          pc: "91",
          pn: phoneNumber,
          source: "Truth Tracker",
        }),
      });

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        setStep("otp-sent");
        toast({
          title: "OTP Sent",
          description: "A 6-digit OTP has been sent to your phone number",
        });

        if (data.test_otp) {
          toast({
            title: "Test OTP",
            description: `Test OTP: ${data.test_otp}`,
          });
          console.log(`Forgot Password OTP is :: ${data.test_otp}`);
        }
      } else {
        toast({
          title: "Error",
          description: data.statusText || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleSendOTP:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    navigate("/otp-verification", {
      state: {
        phoneNumber: "91" + phoneNumber,
        isPasswordReset: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
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
                onClick={() => navigate("/login")}
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
                className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              {step === "phone"
                ? "Enter your phone number to reset password"
                : "OTP has been sent to your phone number"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {step === "phone" && (
              <>
                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-foreground/80 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-input bg-muted/50 text-muted-foreground text-sm font-medium">
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
                      className="rounded-l-none border-l-0 h-14 text-base focus:ring-2 focus:ring-emerald-500/20"
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  className="w-full h-14 bg-[#2f7cb1] from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Send OTP
                </Button>
              </>
            )}

            {step === "otp-sent" && (
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                    <div>
                      <p className="font-medium text-emerald-800 dark:text-emerald-200">
                        OTP Sent Successfully
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                        OTP has been sent to +91{phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Continue to OTP Verification
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setStep("phone")}
                    className="text-primary hover:text-primary/80 font-semibold transition-all duration-200 hover:scale-105"
                  >
                    Change Phone Number
                  </button>
                </div>
              </div>
            )}

            <div className="bg-muted/30 rounded-xl p-4 border border-muted">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Secure Password Reset
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your phone number will be verified via OTP for security
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

export default ResetPassword;
