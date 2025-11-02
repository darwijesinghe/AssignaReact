import { endpoint, roles } from "../../settings/constant";
import Task from "../../components/task/shared-task";
import { useAuth } from "../../context/auth-context";

/**
 * All tasks component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function AllTask() {

    // Hooks
    const { role } = useAuth();

    //throw new Error("Test crash inside AllTask page!");

    return (
        <>
            <Task title="All Task" path={(role === roles.lead ? endpoint.allTask : endpoint.meAllTask)} />
        </>
    );
}