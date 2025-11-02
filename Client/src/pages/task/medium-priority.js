import { endpoint, roles } from "../../settings/constant";
import Task from "../../components/task/shared-task";
import { useAuth } from "../../context/auth-context";

/**
 * Medium priority tasks component.
 *  
 * @returns {JSX.Element} The rendered component.
 */
export default function MediumPriority() {

    // Hooks
    const { role } = useAuth();
    
    return (
        <>
            <Task title="Medium Priority" path={(role === roles.lead ? endpoint.mediumPriority : endpoint.meMediumPriority)} />
        </>
    );
}