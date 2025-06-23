import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for authentication status
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(isLoggedIn);

    // Handle browser back/forward navigation
    const handlePopState = () => {
      if (!localStorage.getItem("isLoggedIn")) {
        // Prevent access to protected routes
        window.history.pushState(null, "", "/login");
        window.location.replace("/login"); // Force redirect
      }
    };

    // Handle browser cache (bfcache) for Chrome/Safari
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || window.performance?.navigation.type === 2) {
        if (!localStorage.getItem("isLoggedIn")) {
          window.location.replace("/login");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
