import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useApi } from "../../services/api-service";
import { useToast } from "../../context/toast-context";
import { cacheTime } from "../../settings/constant";

/**
 * Shared task component.
 * 
 * @param {string} title  - Title of the task section.
 * @param {Array} path    - API path to fetch the task data.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const Task = ({ title, path}) => {

    // Hooks
    const { apiGet }   = useApi();
    const { setToast } = useToast();

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            const response = await apiGet(path);
            if (response.success) {
                return response.data;
            }
            else {
                console.error(`Failed to load ${title} data:`, response.message);
                setToast("An error occurred. Please try again.");
                return null;
            }
        } catch (error) {
            console.error(`Error loading ${title} data:`, error);
            return null;
        }
    };

    // Using react query to handle the data
    const { data, error } = useQuery({
        queryKey : ["task-data", title],
        queryFn  : fetchTasks,
        staleTime: 0,
        retry    : 1
    });

    return (
        <section className="all_task section">
            <h3 className="section_tit">{title}</h3>
            <div className="task_content">

                {/* No task label */}
                {(!data || data.length === 0) && (<span className="no_task">No tasks available at this time</span>)}
                
                {/* Task list */}
                <div className="task_list">
                    {(data && data.length > 0) && data.map((task, index) => (
                        <div key={index} className="task_card">
                            <NavLink to={`/view-task?id=${task.taskId}`} className="t_header ellips" role="link">
                                {task.taskTitle}
                            </NavLink>
                            <div>
                                <p className="t_date">Due : {task.deadline.split("T")[0]}</p>
                                <p className="t_assign">
                                    <span>Assigned to <strong>{task.firstName}</strong></span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="new_t_link">
                <NavLink to="/add-task" className="icon_button" role="link">
                    <span className="material-symbols-outlined">add</span>
                    New Task
                </NavLink>
            </div>
        </section>
    );
}

export default Task;