import { endpoint, roles } from "../../settings/constant";
import Task from "../../components/task/shared-task";
import { useAuth } from "../../context/auth-context";

/**
 * Low priority tasks component.
 *  
 * @returns {JSX.Element} The rendered component.
 */
export default function LowPriority() {

    // Hooks
    const { role } = useAuth();
    
    return (
        <>
            <Task title="Low Priority" path={(role === roles.lead ? endpoint.lowPriority : endpoint.meLowPriority)} />
        </>
    );
}