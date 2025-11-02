import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

/**
 * This component checks if the user is authenticated and has the required role.
 * If not, it redirects to an unauthorized page.
 *
 * @param {Array} roles   - Array of roles allowed to access the component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function ProtectedRoute ({ roles }){

    // Hooks
    const { accessToken, role } = useAuth();
    const location              = useLocation();

    // If the user is not authenticated, redirect to sign in
    if (!accessToken) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Checks the logged in user role
    return roles?.includes(role)
        ? <Outlet />
        : <Navigate to="/unauthorized" replace />;
};