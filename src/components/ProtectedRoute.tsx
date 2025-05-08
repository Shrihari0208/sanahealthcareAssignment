import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated } from "../store/authStore";

interface ProtectedRouteProps {
  // You can add any additional props you might need for the protected route here
  // For example, required roles/permissions if you extend the auth logic
}

export function ProtectedRoute({}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) {
    // User not authenticated, redirect to login page
    // You can also pass the current location to redirect back after login
    // e.g., <Navigate to="/login" state={{ from: location }} replace />
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
}
