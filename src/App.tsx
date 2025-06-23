import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Fleet from "./pages/Fleet";
import Loads from "./pages/Loads";
import Tracking from "./pages/Tracking";
import Profile from "./pages/Profile";
import DriverApp from "./pages/DriverApp";
import Wallet from "./pages/Wallet";
import Invoices from "./pages/Invoices";
import Commissions from "./pages/Commissions";
import BankAccounts from "./pages/BankAccounts";
import PaymentGateway from "./pages/PaymentGateway";
import NotFound from "./pages/NotFound";
import EnhancedLoads from "./pages/EnhancedLoads";
import EnhancedTracking from "./pages/EnhancedTracking";
import LoginPage from "@/components/login/LoginPage.tsx";
import OTPVerification from "@/components/login/OTPVerification.tsx";
import SignUp from "@/components/login/SignUp.tsx";
import SignUpForm from "@/components/login/SignUpForm.tsx";
import ResetPassword from "@/components/login/ResetPassword.tsx";
import NewPassword from "@/components/login/NewPassword.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup-form" element={<SignUpForm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fleet"
              element={
                <ProtectedRoute>
                  <Fleet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loads"
              element={
                <ProtectedRoute>
                  <Loads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loads-enhanced"
              element={
                <ProtectedRoute>
                  <EnhancedLoads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <Tracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking-enhanced"
              element={
                <ProtectedRoute>
                  <EnhancedTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/commissions"
              element={
                <ProtectedRoute>
                  <Commissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank-accounts"
              element={
                <ProtectedRoute>
                  <BankAccounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentGateway />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute>
                  <DriverApp />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
