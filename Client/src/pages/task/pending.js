import { endpoint, roles } from "../../settings/constant";
import Task from "../../components/task/shared-task";
import { useAuth } from "../../context/auth-context";

/**
 * Pending tasks component.
 *  
 * @returns {JSX.Element} The rendered component.
 */
export default function Pending() {

    // Hooks
    const { role } = useAuth();
    
    return (
        <>
            <Task title="Pending Priority" path={(role === roles.lead ? endpoint.pending : endpoint.mePending)} />
        </>
    );
}