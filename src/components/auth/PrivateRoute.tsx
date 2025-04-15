
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const isAuthenticated = localStorage.getItem("dashboard-auth") === "authenticated";
  
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
