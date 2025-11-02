import { createContext, useState, useEffect, useContext, useRef } from "react";

import { endpoint } from "../settings/constant";
import { useApi } from "../services/api-service";

// Create a context to store task counts state and actions.
const TaskCountsContext = createContext({});

/**
 * This component manages and provides task counts state and functions to its children via React Context.
 * 
 * @param {string} email         - User email to fetch task counts for.
 * @param {JSX.Element} children - Child components.
 */
export const TaskCountsProvider = ({ email, children }) => {

    // Hooks
    const { apiGet }          = useApi();
    const effectRan           = useRef(false);
    const [counts, setCounts] = useState({
        allTask       : 0,
        pending       : 0,
        complete      : 0,
        highPriority  : 0,
        mediumPriority: 0,
        lowPriority   : 0,
    });

    // Refresh task counts
    const refreshCounts = async () => { 
        if (!email) return;
        try {
            const data = await apiGet(`${endpoint.taskCount}?email=${email}`);
            setCounts(data);
        } catch (error) {
            console.error("Failed to fetch task counts:", error);
        }
    };

    useEffect(() => {
        if (!effectRan.current) {
            effectRan.current = true;
            refreshCounts();
        }
    }, [email]);

    return (
        <TaskCountsContext.Provider value={{ counts, refreshCounts }}>
            {children}
        </TaskCountsContext.Provider>
    );
}

/**
 * Custom hook to access the task counts context.
 * 
 * Provides:
 * - counts       : Current task counts.
 * - refreshCounts: Function to refresh the counts.
 * 
 * Must be used within a component wrapped by <TaskCountsProvider>.
 * 
 * @returns {{ counts: object, refreshCounts: Function }} context helpers.
 */
export const useTaskCounts = () => {
    const context = useContext(TaskCountsContext);
    if (!context) {
        throw new Error("Must be used within a component wrapped in <TaskCountsProvider>.");
    }
    return context;
}