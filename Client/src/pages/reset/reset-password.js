import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useApi } from "../../services/api-service";
import { useLoading } from "../../context/loading-context";
import { endpoint } from "../../settings/constant";
import { useState } from "react";

/**
 * This component renders the password reset form.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function ResetPassword() {

    // Hooks
    const query = new URLSearchParams(useLocation().search);
    const token = query.get("token");
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            token: token
        }
    });
    const { apiPost }                   = useApi();
    const [apiResponse, setApiResponse] = useState({ message: null, isError: false });
    const { setLoading }                = useLoading(true);

    // Form submit handle
    const onSubmit = async (data) => {
        try {
                
            debugger
            setLoading(true);
                
            // send data to backend API
            const response = await apiPost(endpoint.reset, data);
            if (response.success) {
        
                setApiResponse({ message: "Your password reset successfully.", isError: false });
        
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
            setApiResponse({ message: "An error occurred. Please try again later.", isError: true });
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
        <section className="reset_pw fr_center container">
            <div className="res_content">
                <h3 className="reset_tit">Password reset</h3>
                <p className="pw_instruct">Passwords must contain at least five characters, including at least 1 letter and 1 number.</p>

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
                
                {/* Password reset form */}
                <form className="res_form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input_control">
                        <input type="text" id="password" role="textbox" placeholder="Password" {...register("password", { required: "Password is required" })} />
                        {errors.password && <span className="val_msg">{errors.password.message}</span>}
                    </div>
                    <div className="input_control">
                        <input type="text" id="con-password" role="textbox" placeholder="Confirm Password" {...register("conPassword", { required: "Confirm Password is required" })} />
                        {errors.conPassword && <span className="val_msg">{errors.conPassword.message}</span>}
                    </div>
                    <input type="hidden" id="token" {...register("resetToken")} value={token} />
                    <button type="submit" className="button" role="button">Reset Now</button>
                </form>
                <div className="help">
                    <span>Go back to <Link to="/" role="link">Sign In</Link></span>
                </div>
            </div>
        </section>
    );
}
