import { useState } from "react";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Header from "./header";
import Navigation from "./navigation";
import GoBack from "./go-back";
import Toast from "../toast/app-toast";

import ErrorBoundary from "../error/error-boundary";

import { useAuth } from "../../context/auth-context";
import { TaskCountsProvider } from "../../context/task-counts";
import { ModalProvider } from "../../context/modal-context";

/**
 * Main layout component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Layout() {
    
    // Hooks
    const [showNavigation, setShowNavigation] = useState(false);
    const { accessToken }                     = useAuth();
    const email                               = accessToken ? jwtDecode(accessToken).email : "";

    // Nav toggle handle
    const handleToggle = () => {
        setShowNavigation(!showNavigation);
    };

    return (
        <div className="Home">
            <TaskCountsProvider email={email}>
                <ModalProvider>
                    <Header handleToggle={handleToggle} />
                    <Navigation show={showNavigation} />
                    <main className="body_space">
                        <GoBack />
                        <ErrorBoundary>
                            <Outlet />
                        </ErrorBoundary>
                        <Toast />
                    </main>
                </ModalProvider>
            </TaskCountsProvider>
        </div>
    );
};