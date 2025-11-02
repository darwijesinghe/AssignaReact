/**
 * Unauthorized page.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Unauthorized() {
    return (
        <section className="error container">
            <div className="er-content">
                <h1>Unauthorized</h1>
                <p>An occurred while processing your request.</p>
                <p>Unauthorized to view this page. Please contact admin.</p>
            </div>
        </section>
    );
};