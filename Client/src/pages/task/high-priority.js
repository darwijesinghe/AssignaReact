import { endpoint, roles } from "../../settings/constant";
import Task from "../../components/task/shared-task";
import { useAuth } from "../../context/auth-context";

/**
 * High priority tasks component.
 *  
 * @returns {JSX.Element} The rendered component.
 */
export default function HighPriority() {

    // Hooks
    const { role } = useAuth();
    
    return (
        <>
            <Task title="High Priority" path={(role === roles.lead ? endpoint.highPriority : endpoint.meHighPriority)} />
        </>
    );
}