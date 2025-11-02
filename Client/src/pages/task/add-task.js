import { useMutation } from "@tanstack/react-query";

import { endpoint } from "../../settings/constant";
import { useApi } from "../../services/api-service";
import { useToast } from "../../context/toast-context";
import { useTaskCounts } from "../../context/task-counts";

import AddEdit from "../../components/task/add-edit";

/**
 * Add task component that allows team leads to create new tasks.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function AddTask() {

    // Hooks
    const { apiPost }       = useApi();
    const { setToast }      = useToast();
    const { refreshCounts } = useTaskCounts();

    // Adding task mutation
    const addMutation = useMutation({
        mutationFn: async (variables) => await apiPost(endpoint.addTask, variables.data),

        onSuccess: async (response, variables) => {
            if (response.success) {

                setToast("Task added successfully.");

                // reset the form
                variables.reset();

                // refresh task counts
                await refreshCounts();

            } else {
                console.error("Failed to submit data:", response.message);
                setToast(response.message);
            }
        },

        onError: (error) => {
            console.error("Error adding task:", error);
            setToast("An error occurred. Please try again.");
        },
    });

    // Handle form submission
    const onSubmit = (data, reset) => {
        addMutation.mutate({ data, reset });
    }

    return (
        <>
            <AddEdit onSubmit={onSubmit} />
        </>
    );
};