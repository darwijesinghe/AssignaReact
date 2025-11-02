import { endpoint, roles } from "../../settings/constant";
import Task from "../../components/task/shared-task";
import { useAuth } from "../../context/auth-context";

/**
 * Complete tasks component.
 *  
 * @returns {JSX.Element} The rendered component.
 */
export default function Complete() {

    // Hooks
    const { role } = useAuth();

    return (
        <>
            <Task title="Complete" path={(role === roles.lead ? endpoint.complete : endpoint.meComplete)} />
        </>
    );
}