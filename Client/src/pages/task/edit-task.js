import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { endpoint} from "../../settings/constant";
import { useApi } from "../../services/api-service";
import { useToast } from "../../context/toast-context";
import { useTaskCounts } from "../../context/task-counts";

import AddEdit from "../../components/task/add-edit";

/**
 * Edit task component that allows team leads to edit a task.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function EditTask() {

    // Hooks
    const { apiPost }       = useApi();
    const { setToast }      = useToast();
    const { refreshCounts } = useTaskCounts();
    const query             = new URLSearchParams(useLocation().search);
    const queryClient       = useQueryClient();
    const navigate          = useNavigate();

    // Get the task ID from query params
    const id = query.get("id");

    // Get the cached data
    const cached = queryClient.getQueryData(["task-info", id]);

    useEffect(() => {
        if (!cached) {
            navigate("/tasks", { replace: true });
            setToast("No task data found to edit.");
            return;
        }
    }, [cached, navigate]);

    // Adding task mutation
    const addMutation = useMutation({
        mutationFn: async (data) => await apiPost(endpoint.editTask, data),

        onSuccess: async (response) => {
            if (response.success) {

                setToast("Task updated successfully.");

                // refresh task counts
                await refreshCounts();

                // navigate to all tasks
                navigate("/tasks", { replace: true });

                // mark cached data as stale
                queryClient.invalidateQueries({
                    queryKey   : ["task-info", id],
                    refetchType: "none"
                });

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
    const onSubmit = async (data) => {
        addMutation.mutate(data);
    }

    return (
        <>
            <AddEdit onSubmit={onSubmit} details={cached} />
        </>
    );
};