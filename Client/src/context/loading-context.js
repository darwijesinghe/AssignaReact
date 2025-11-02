import { createContext, useContext, useState } from "react";
import Spinner from "../components/process/spinner";

// Create a context to store loading state and actions.
const LoadingContext = createContext({});

/**
 * This component manages and provides loading state and functions to its children via React Context.
 * 
 * @param {JSX.Element} children - Child components.
 */
export const LoadingProvider = ({ children }) => {

    // Hooks
    const [loading, setLoading] = useState(false);
    
    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading && <Spinner />}
            {children}
        </LoadingContext.Provider>
    );
};

/**
 * Custom hook to access the loading context.
 *
 * Provides:
 * - loading   : The current loading state.
 * - setLoading: Function to update the loading state.
 *
 * Must be used within a component wrapped by <LoadingProvider>.
 * 
 * @returns {{ loading: boolean, setLoading: Function }} context helpers.
 */
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("Must be used within a component wrapped in <LoadingProvider>.");
    }
    return context;
};