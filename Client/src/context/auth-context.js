import { createContext, useContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";

import { endpoint } from "../settings/constant";

// Create a context to store authentication state and actions.
const AuthContext = createContext({});

/**
 * This component manages and provides authentication state
 * and functions to its children via React Context.
 * 
 * @param {JSX.Element} children - Child components.
 */
export const AuthProvider = ({ children }) => {
    
    // Hooks
    const [accessToken, setAccessToken]   = useState(localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
    const [role, setRole]                 = useState(localStorage.getItem("role"));
    const [letter, setLetter]             = useState(localStorage.getItem("letter"));
    const accessTokenRef                  = useRef(accessToken);
    const queryClient                     = useQueryClient();

    // Sync ref with state
    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    // Sync auth state with localStorage
    useEffect(() => {
        const authState = { accessToken, refreshToken, role, letter };
        Object.entries(authState).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value);
            else localStorage.removeItem(key);
        });
    }, [accessToken, refreshToken, role, letter]);

    /**
     * A function to clear the tokens.
     */
    const logout = () => {
        [setAccessToken, setRefreshToken, setRole, setLetter].forEach(setter => setter(null));
        ["accessToken", "refreshToken", "role", "letter"].forEach(key => localStorage.removeItem(key));
        accessTokenRef.current = null;

        // clear all React Query cache (queries + mutations)
        queryClient.clear();
    };

    /**
     * A function to refresh the access token.
     * 
     * @returns {string} - Returns the new token string.
     */
    const refreshAccessToken = async () => {
        
        if (!refreshToken) return null;

        try {
            const response = await fetch(`${endpoint.baseUrl}${endpoint.refresh}`, {
                method : "POST",
                headers: { "Content-Type": "application/json" },
                body   : JSON.stringify({ "TokenRefresh": refreshToken }) 
            });

            if (!response.ok)
                throw new Error("Refresh failed.");

            // parse the response and decode the token
            const data    = await response.json();
            const decoded = jwtDecode(data.token);

            // update state and ref
            accessTokenRef.current = data.token;

            // sets new states
            setAccessToken(data.token);
            setRefreshToken(data.refreshToken);
            setRole(decoded.role);

            return data.token;

        } catch (error) {
            console.error("Refresh token failed:", error);
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, accessTokenRef, setAccessToken, setRefreshToken, role, setRole, refreshAccessToken, letter, setLetter , logout }}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Custom hook to access the authentication context.
 * 
 * Provides:
 * - accessToken       : The current access token for authenticated requests.
 * - accessTokenRef    : A ref to the current access token, useful for avoiding stale closures.
 * - setAccessToken    : Function to update the access token.
 * - setRefreshToken   : Function to update the refresh token.
 * - role              : The current user role.
 * - setRole           : Function to update the user role.
 * - refreshAccessToken: Function to refresh the access token using the refresh token.
 * - letter            : Username first letter, which shows on the top nav bar.
 * - setLetter         : Function to update the letter.
 * - logout            : Function to clear the authentication tokens.
 *
 * Must be used within a component wrapped by <AuthProvider>.
 * 
 * @returns {{  
 *   accessToken       : string | null,
 *   accessTokenRef    : React.MutableRefObject<string | null>,
 *   setAccessToken    : Function,
 *   setRefreshToken   : Function,
 *   role              : string | null,
 *   setRole           : Function,
 *   refreshAccessToken: Function,
 *   letter            : string | null,
 *   setLetter         : Function,
 *   logout            : Function 
 * }} context helpers.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Must be used within a component wrapped in <AuthProvider>.");
    }
    return context;
}