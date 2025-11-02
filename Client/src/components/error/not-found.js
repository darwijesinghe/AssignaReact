import React from "react";

/**
 * URL not found (404) component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function NotFound() {
    return (
        <section className="error container">
            <div className="er-content">
                <h1>404</h1>
                <p>An occurred while processing your request.</p>
                <p>The page that your are requested is not found. Please check the link.</p>
            </div>
        </section>
    );
};