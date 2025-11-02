/**
 * Error page.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Error() {
    return (
        <section className="error container">
            <div className="er-content">
                <h1>Error</h1>
                <p>An occurred while processing your request.</p>
                <p>The support team is notified, We are working on the fix.</p>
            </div>
        </section>
    );
};