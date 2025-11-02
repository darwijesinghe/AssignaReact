import React from "react";
import Error from "./error";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("React Error Boundary Caught:", error, errorInfo);

        // Optional: send to error tracking service
        // if (process.env.NODE_ENV === "production") {
        //   fetch("/log-error", {
        //     method: "POST",
        //     body: JSON.stringify({ error, errorInfo }),
        //   });
        // }
    }

    render() {

        // In dev mode, show full error with stack trace
        if (this.state.hasError && process.env.NODE_ENV === "development") {
            return null;
        }

        // In production, show a clean fallback UI
        if (this.state.hasError) {
            return <Error />;
        }

        return this.props.children;
    }
};