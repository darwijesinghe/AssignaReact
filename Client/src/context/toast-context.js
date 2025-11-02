import { createContext, useContext, useState } from "react";

// Create a context to store toast state and actions.
const ToastContext = createContext({});

/**
 * This component manages and provides toast state and functions to its children via React Context.
 * 
 * @param {JSX.Element} children - Child components.
 */
export const ToastProvider = ({ children }) => {

    // Hooks
    const [toast, setToast] = useState("");

    return (
        <ToastContext.Provider value={{ toast, setToast }}>
            {children}
        </ToastContext.Provider>
    );
};

/**
 * Custom hook to access the toast context.
 *
 * Provides:
 * - toast   : The current toast message.
 * - setToast: Function to update the toast message.
 *
 * Must be used within a component wrapped by <ToastProvider>.
 * 
 * @returns {{ toast: string, setToast: Function }} context helpers.
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("Must be used within a component wrapped in <ToastProvider>.");
    }
    return context;
};