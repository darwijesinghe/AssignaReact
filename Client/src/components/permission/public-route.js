import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

/**
 * A route guard that restricts access to public routes (e.g., SignIn, SignUp) for authenticated users.
 *
 * @param {React.ReactNode} props.children - Child components to render.
 * @returns {JSX.Element}                  - Rendered component or redirect.
 */
export default function PublicRoute({ children }){

    // Hooks
    const { accessToken } = useAuth();

    // Already logged in → go to main area
    if (accessToken) {
        return <Navigate to="/tasks" replace />;
    }

    // Not logged in → allow access
    return children;
};