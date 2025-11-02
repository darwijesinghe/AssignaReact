/**
 * Spinner component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Spinner() {
    return (
        <div className="loading show-loader">
            <div className="loading-spinner">
                <svg className="spinner" viewBox="0 0 50 50" style={{ height: '50px', width: '50px' }}>
                    <circle className="path" cx="25" cy="25" r="20"></circle>
                </svg>
            </div>
        </div>
    )
};