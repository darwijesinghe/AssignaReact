import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useApi } from "../../services/api-service";
import { useToast } from "../../context/toast-context";
import { endpoint, roles, cacheTime } from "../../settings/constant";
import { useAuth } from "../../context/auth-context";
import { useTaskCounts } from "../../context/task-counts";
import { useModal } from "../../context/modal-context";

import SendRemind from "../../components/task/send-remind";

/**
 * Task info component.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function ViewTask() {

    // Hooks
    const { role }                                        = useAuth();
    const { apiGet, apiPost }                             = useApi();
    const { setToast }                                    = useToast();
    const query                                           = new URLSearchParams(useLocation().search);
    const queryClient                                     = useQueryClient();
    const { refreshCounts }                               = useTaskCounts();
    const { openConfirmModal, openFormModal, closeModal } = useModal();
    const navigate                                        = useNavigate();
    
    // Get the task ID from query params
    const id = query.get("id");
    
    // Fetch tasks details
    const fetchTaskDetails = async () => {
        try {

            // path based on the logged in user role
            let path = role === roles.lead ? endpoint.taskInfo : endpoint.meTaskInfo;

            const response = await apiGet(path + `?taskId=${id}`);
            if (response.success) {
                return response.data;
            }
            else {
                console.error("Failed to load data:", response.message);
                setToast("An error occurred. Please try again.");
                return null;
            }
        } catch (error) {
            console.error("Error loading data:", error);
            return null
        }
    };

    // Using react query to handle the data
    const { data } = useQuery({
        queryKey : ["task-info", id],
        queryFn  : fetchTaskDetails,
        staleTime: cacheTime.FIVE_MINUTES,
        retry    : 1
    });

    // Mark task as done mutation
    const markAsDoneMutation = useMutation({
        mutationFn: async (data) => await apiPost(endpoint.meMarkDone, data),

        onSuccess: async (response) => {
            if (response.success) {

                setToast("Task completed successfully.");

                // refresh cached data
                queryClient.invalidateQueries(["task-info", id]);

                // refresh task counts
                await refreshCounts();

            } else {
                console.error("Failed to submit data:", response.message);
                setToast(response.message);
            }
        },

        onError: (error) => {
            console.error("Error submitting data:", error);
            setToast("An error occurred. Please try again.");
        },
    });

    // Handle mutation
    const onSubmit = () => {
        markAsDoneMutation.mutate({ taskId: id ? parseInt(id, 10) : 0 });
    };

    // Task delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (data) => await apiPost(endpoint.deleteTask, data),

        onSuccess: async (response) => {
            if (response.success) {

                closeModal();
                setToast("Task deleted successfully.");

                // refresh task counts
                await refreshCounts();

                // navigate to all tasks
                navigate("/tasks", { replace: true });
                
            } else {
                console.error("Failed to submit data:", response.message);
                setToast(response.message);
            }
        },

        onError: (error) => {
            console.error("Error submitting data:", error);
            setToast("An error occurred. Please try again.");
        },
    });

    // Handle delete event
    const handleDelete = () => {
        openConfirmModal({
            title     : "Delete",
            buttonText: "Yes",
            body      : <p className="con_question">Are you sure you want to delete this task?</p>,
            onConfirm : () => deleteMutation.mutate({ taskId: id ? parseInt(id, 10) : 0 })
        });
    };

    // Send remind mutation
    const remindMutation = useMutation({
        mutationFn: async (variables) => await apiPost(endpoint.sendRemind, variables.data),

        onSuccess: async (response, variables) => {
            if (response.success) {
                
                // reset the form
                variables.reset();

                closeModal();
                setToast("Remind sent successfully.");

            } else {
                console.error("Failed to submit data:", response.message);
                setToast(response.message);
            }
        },

        onError: (error) => {
            console.error("Error submitting data:", error);
            setToast("An error occurred. Please try again.");
        },
    });

    // Open remind sending dialog
    const handleRemind = () => {
        openFormModal({
            title     : "Remind",
            buttonText:"Send",
            formId    : "remind-form",
            body      : <SendRemind id={data[0].taskId} name={data[0].firstName} formId="remind-form"
                            onSubmit={(data, reset) => remindMutation.mutate({ data, reset })} />
        });
    };

    return (     
        <section className="view_task section">
            <h3 className="section_tit">Task Info</h3>
            <div className="view_content">

                {/* No task details label */}
                {(!data || data.length === 0) && (
                    <>
                        <span className="no_task">No tasks infomation available at this time</span>
                        <NavLink to="/tasks" role="link" className="back_tasks link_button">Back to Tasks</NavLink>
                    </>
                )}

                {/* Task details */}
                {(data && data.length > 0) && (
                    <table className="view_table">
                        <tbody>
                            <tr>
                                <td className="view_t_header">
                                    <span>Title</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].taskTitle}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>Category</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].catName}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>Deadline</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].deadline.split("T")[0]}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>Priority</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].highPriority ? "High Priority" : data[0].mediumPriority ? "Medium Priority" : "Low Priority"}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>Assigned To</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].firstName}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>Task Note</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].taskNote}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>Status</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].complete ? "Completed" : "Pending"}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>Note</span>
                                </td>
                                <td className="view_t_data">
                                    <p>{data[0].userNote ?? "User note is not available"}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {(data && data.length > 0) &&
                    <div className="view_actions">

                        {/* Team member actions */}
                        {(role === roles.member) && (
                            <>
                                <NavLink to={`/user-note?id=${id}`} className="link_button" role="link" disabled={data[0].complete}>
                                    Add Note
                                </NavLink>
                                <button id="task-done" className="button" role="button" disabled={data[0].complete} onClick={onSubmit}>Task Done</button>
                            </>
                        )}

                        {/* Team lead actions */}
                        {(role === roles.lead) && (
                            <>
                                <NavLink to={`/edit-task?id=${id}`} className="link_button" role="link" disabled={data[0].complete}>Edit</NavLink>
                                <button id="send-remind" className="outline_button send_remind" role="button" onClick={handleRemind}>Remind</button>
                                <button id="task-delete" className="button" role="button" onClick={handleDelete}>Delete</button>
                            </>
                        )}

                    </div>
                }
            </div>
        </section>
    );
};