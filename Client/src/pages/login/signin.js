import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Google from "../../icons/icon-google";
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from '@react-oauth/google';

import { useAuth } from "../../context/auth-context";
import { useApi } from "../../services/api-service";
import { useLoading } from "../../context/loading-context";
import { endpoint, providers, roles } from "../../settings/constant";

/**
 * Login component renders the sign-in page and handles user authentication.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function SignIn() {

    // Hooks
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            userName: "wije@singhe",
            password: "admin@123"
        }
    });
    const { apiPost }                            = useApi();
    const [apiResponse, setApiResponse]          = useState({ message: null, isError: false });
    const { setLoading }                         = useLoading(true);
    const navigate                               = useNavigate();
    const location                               = useLocation();
    const { accessToken, setAccessToken, setRefreshToken, setRole, setLetter } = useAuth();

    // Return url
    const from = location.state?.from?.pathname || "/tasks";

    // Redirect user when the access token is set
    useEffect(() => {
        if (accessToken) {
            navigate(from, { replace: true });
        }
    }, [accessToken]);

    // Form submit handle
    const onSubmit = async (data) => {
        try {

            setLoading(true);

            // send data to backend API
            const response = await apiPost(endpoint.login, data);
            if (response.success) {

                // sets the auth tokens and user role in context
                setAccessToken(response.token);
                setRefreshToken(response.refreshToken);

                // decode jwt token
                const decode = jwtDecode(response.token);
                setRole(decode.role);

                // extract the first letter and convert to upper case
                const userLetter = decode.name[0].toUpperCase();
                setLetter(userLetter);

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
    };

    // Google signin
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
                    role       : roles.default
                };

                // send data to backend API
                const response = await apiPost(endpoint.external, data);
                if (response.success) {

                    // sets the auth tokens and user role in context
                    setAccessToken(response.token);
                    setRefreshToken(response.refreshToken);

                    // decode jwt token
                    const decode = jwtDecode(response.token);
                    setRole(decode.role);

                    // extract the first letter and convert to upper case
                    const userLetter = decode.name[0].toUpperCase();
                    setLetter(userLetter);
                }
                else {
                    console.error("Failed to submit data:", response.message);
                    setApiResponse({ message: response.message, isError: true });
                    return false;
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
        <section className="signin container fr_center">
            <div className="sig_content">
                <h3 className="section_tit" id="section_tit">Assigna</h3>
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

                    {/* External signin options */}
                    <div className="ex_signup">
                        <button className="icon_button" role="button" onClick={() => login()}>
                            <Google />
                            Sign in with Google
                        </button>
                    </div>

                    <span className="separate">
                        <p>OR</p>
                    </span>

                    {/* Local signin Form */}
                    <div className="loc_signup">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="input_control">
                                <input type="text" id="user-name" role="textbox" placeholder="Username" {...register("userName", { required: "Username is required" })} />
                                {errors.userName && <span className="val_msg">{errors.userName.message}</span>}
                            </div>
                            <div className="password">
                                <Link to="/reset-link" role="link">Forgot password?</Link>
                                <div className="input_control">
                                    <input type="text" id="password" role="textbox" placeholder="Password" {...register("password", { required: "Password is required" })} />
                                    {errors.password && <span className="val_msg">{errors.password.message}</span>}
                                </div>
                            </div>
                            <button type="submit" className="button" role="button">Sign In</button>
                        </form>
                    </div>
                </div>
                {/* <div className="test_signin">
                    <p className="ts_title">Try a demo user</p>
                    <div className="ts_users">
                        <button className="button small_button outline_button team_lead" onClick={() => console.log("Team Lead Login")}>Team Lead</button>
                        <button className="button small_button outline_button" onClick={() => console.log("Team Member Login")}>Team Member</button>
                    </div>
                </div> */}
                <div className="help">
                    <span>
                        Create <Link to="/signup?type=team-member" role="link"> Team Member </Link> or <Link to="/signup?type=team-lead" role="link"> Team Lead </Link> account
                    </span>
                </div>
            </div>
        </section>
    );
};