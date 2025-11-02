import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Google from "../../icons/icon-google";

import { useApi } from "../../services/api-service";
import { useLoading } from "../../context/loading-context";
import { endpoint, providers } from "../../settings/constant";
import { useAuth } from "../../context/auth-context";

/**
 * Registration component renders the sign-up page and handles user registration.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function SignUp() {

    // Hooks
    const { apiPost } = useApi();
    const location    = useLocation();
    const query       = new URLSearchParams(useLocation().search);
    const type        = query.get("type");
    const {register, handleSubmit, reset, formState: { errors }} = useForm({
        defaultValues:{
            role: type
        }
    });
    const [apiResponse, setApiResponse]          = useState({ message: null, isError: false });
    const { loading, setLoading }                = useLoading(true);
    const { setAccessToken, setRole, setLetter } = useAuth();
    const navigate                               = useNavigate();
    
    // Return url
    const from = location.state?.from?.pathname || "/tasks";

    // Local signup form submit handle
    const onSubmit = async (data) => {
        try {

            setLoading(true);

            // send data to backend API
            const response = await apiPost(endpoint.register, data);
            if(response.success){

                setApiResponse({ message: "Registration successful. Please log in.", isError: false });
                
                // clear the form
                reset();
            }
            else{
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
    };

    // Google signup
    const login = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            try {

                setLoading(true);

                // payload
                const data = {
                    provider   : providers.google,
                    accessToken: credentialResponse.access_token,
                    tokenType  : credentialResponse.token_type,
                    expiresIn  : credentialResponse.expires_in,
                    scope      : credentialResponse.scope,
                    authUser   : credentialResponse.authuser,
                    role       : type
                };

                // send data to backend API
                const response = await apiPost(endpoint.external, data);
                if (response.success) {

                    // sets the auth tokens and user role in context
                    setAccessToken(response.token);
    
                    // decode jwt token
                    const decode = jwtDecode(response.token);
                    setRole(decode.role);
    
                    // extract the first letter and convert to upper case
                    const userLetter = decode.name[0].toUpperCase();
                    setLetter(userLetter);
    
                    // navigate return url
                    navigate(from, { replace: true });
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
        },
        onError: () => {
            console.log("Google login failed.")
        }
    });
    
    return (
        <section className="signup fr_center container">
            <div className="sig_content">
                <h3 className="section_tit">Assigna</h3>
                <div className="sig_types">

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

                    {/* External signup options */}
                    <div className="ex_signup">
                        <button className="icon_button" role="button" onClick={() => login()}>
                            <Google />
                            Sign up with Google
                        </button>
                    </div>

                    <span className="separate">
                        <p>OR</p>
                    </span>

                    {/* Local signup Form */}
                    <div className="loc_signup">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="input_control">
                                <input type="hidden" id="user-role" {...register("role")} value={type} />
                                <input type="text" id="first-name" role="textbox" placeholder="First Name" {...register("firstName", { required: "First name is required" })} />
                                {errors.firstName && <span className="val_msg">{errors.firstName.message}</span>}
                            </div>
                            <div className="input_control">
                                <input type="text" id="user-name" role="textbox" placeholder="Username" {...register("userName", { required: "Username is required" })} />
                                {errors.userName && <span className="val_msg">{errors.userName.message}</span>}
                            </div>
                            <div className="input_control">
                                <input type="text" id="email" role="textbox" placeholder="Email" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })} />
                                {errors.email && <span className="val_msg">{errors.email.message}</span>}
                            </div>
                            <div className="password">
                                <div className="input_control">
                                    <input type="text" id="password" role="textbox" placeholder="Password" {...register("password", { required: "Password is required" })} />
                                    {errors.password && <span className="val_msg">{errors.password.message}</span>}
                                </div>
                                <small className="pw_instruct">Passwords must contain at least five characters, including at least 1 letter and 1 number.</small>
                            </div>
                            <button type="submit" className="button" role="button">Sign Up</button>
                        </form>
                    </div>
                </div>
                <div className="help">
                    <span>Already have an account? <Link to="/" role="link">Sign In</Link></span>
                </div>
            </div>
        </section>
    );
};