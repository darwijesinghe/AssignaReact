import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { useApi } from "../../services/api-service";
import { useLoading } from "../../context/loading-context";
import { endpoint } from "../../settings/constant";

/**
 * This component renders the password reset link sending form.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function SendResetLink() {

    // Hooks
    const { register, handleSubmit, reset, formState: { errors } } = useForm({});
    const { apiGet }                    = useApi();
    const [apiResponse, setApiResponse] = useState({ message: null, isError: false });
    const { setLoading }                = useLoading(true);

    // Form submit handle
    const onSubmit = async (data) => {
        try {
        
            debugger
            setLoading(true);
        
            // send data to backend API
            const response = await apiGet(endpoint.resetLink + `?email=${encodeURIComponent(data.email)}`);
            if (response.success) {

                setApiResponse({ message: "A password reset link has been sent to your email.", isError: false });

                // clear the form
                reset();
            }
            else {
                console.error("Failed to submit data:", response.message);
                setApiResponse({ message: response.message, isError: true });
            }
        }
        catch (error) {
            console.error("Error submitting data:", error);
            setApiResponse({ message: "An error occurred. Please try again.", isError: true });
        }
        finally {
            // any cleanup actions
            setLoading(false);
            setTimeout(() => {
                setApiResponse({ message: null, isError: false });
            }, 8000);
        }
    }

    return (
        <section className="send_rp_link fr_center container">
            <div className="sen_content">
                <h3 className="reset_tit">Recover your account</h3>
                <p className="reset_nt">Forgot your account’s password or having trouble logging into your account?
                    Enter your email address and we’ll send you a recovery link.</p>
                
                {/* Alert Message */}
                {apiResponse.message !== null && (
                    <div id="alert-message">
                        <div className={`alert ${apiResponse.isError ? "al_error" : "al_success"}`} role="alert">
                            <div className="al_content">
                                <p id="al_message">{apiResponse.message}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Recovery link form */}
                <form className="sen_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input_control">
                        <input type="text" id="email" role="textbox" placeholder="Email" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })} />
                        {errors.email && <span className="val_msg">{errors.email.message}</span>}
                    </div>
                    <button type="submit" className="button" role="button">Send Link</button>
                </form>
                <div className="help">
                    <span>
                        Go back to <Link to="/signin" role="link">Sign In</Link>
                    </span>
                </div>
            </div>
        </section>
    );
}