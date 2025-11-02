import { useEffect } from "react";
import { useToast } from "../../context/toast-context";

/**
 * Toast component.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function Toast() {

    // Hooks
    const { toast, setToast } = useToast();

    // Close toast handle
    const handleCloseToast = () => {
        setToast(null);
    }

    // Auto close
    useEffect(() => {
        let autoClose = setTimeout(() => {
            setToast(null);
        }, 5000);

        return () => {
            clearTimeout(autoClose);
        };
    }, [toast]);

    return (
        <div className={toast ? 'toast to_visible' : 'toast'} id="toast" role="alert">
            <div className="to_content">
                <span id="t-message">{toast}</span>
                <div className="ba_close" id="t-close" onClick={handleCloseToast}>
                    <span className="material-symbols-outlined icon">close</span>
                </div>
            </div>
        </div>
    )
};