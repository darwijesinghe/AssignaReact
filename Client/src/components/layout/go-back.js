import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

/**
 * GoBack component provides a button to navigate to the previous page.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function GoBack() {

    // Hooks
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    // Handle back event
    const handleBack = () => {
        navigate(-1);
    }

    return (
        <div className="go_back section">
            <button className="icon_button" role="button" id="go_back" onClick={() => handleBack()}>
                <span className="material-symbols-outlined">
                    arrow_back
                </span>
                Go Back
            </button>
        </div>
    );
};