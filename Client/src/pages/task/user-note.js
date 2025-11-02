import { useLocation, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useApi } from "../../services/api-service";
import { useToast } from "../../context/toast-context";
import { endpoint, roles, cacheTime } from "../../settings/constant";
import { useAuth } from "../../context/auth-context";

/**
 * A component to add a note.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function UserNote() {

    // Hooks
    const { role }            = useAuth();
    const { apiGet, apiPost } = useApi();
    const { setToast }        = useToast();
    const query               = new URLSearchParams(useLocation().search);
    const queryClient         = useQueryClient();

    // Get the task ID from query params
    const id = query.get("id");

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            taskId: id ? parseInt(id, 10) : 0,
        }
    });

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
                setToast("Failed to load task details.");
                console.error("Failed to load task details:", response.message);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch task details:", error);
            return null
        }
    };

    // Using react query to handle the data
    const { data, error } = useQuery({
        queryKey : ["task-info", id],
        queryFn  : fetchTaskDetails,
        staleTime: cacheTime.FIVE_MINUTES,
        retry    : 1
    });

    // Adding user note mutation
    const noteMutation = useMutation({
        mutationFn: async (data) => await apiPost(endpoint.meWriteNote, data),

        onSuccess: (response) => {
            if (response.success) {

                setToast("Note added successfully.");

                // refresh cached data
                queryClient.invalidateQueries(["task-info", id]);

                // clear the form
                reset();

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
    const onSubmit = (data) => {
        noteMutation.mutate(data);
    };

    return (
        <section className="user_note section">
            <h3 className="section_tit">Add Task Note</h3>
            <div className="note_content">

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
                                    <span>Deadline</span>
                                </td>
                                <td className="view_t_data col_padding">
                                    <p>{data[0].deadline.split("T")[0]}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="view_t_header">
                                    <span>My Note</span>
                                </td>
                                <td className="view_t_data">
                                    <p>{data[0].userNote ?? "User note is not available"}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {/* User note form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input_control task_note">
                        <textarea id="user-note" rows="5" role="textbox"
                            placeholder="Write Task Note" {...register("userNote", { required: "Note is required" })}></textarea>
                        {errors.userNote && <span className="val_msg">{errors.userNote.message}</span>}
                    </div>
                    <div className="save-button">
                        <button className="button" role="button" type="submit">Add Note</button>
                    </div>
                </form>
            </div>
        </section>
    );
};