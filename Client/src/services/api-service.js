import { useAuth } from "../context/auth-context";
import { endpoint } from "../settings/constant";

/**
 * Custom hook for API calls with automatic token handling.
 * 
 * @returns {object} - API methods for making authorized requests.
 */
export const useApi = () => {

    // Hooks
    const { accessTokenRef, refreshAccessToken } = useAuth();

    /**
     * Helper for making authorized HTTP requests.
     * Automatically attaches access token and retries once on 401 by refreshing the token.
     * 
     * @param {string} path    - The API endpoint path.
     * @param {object} options - Fetch options (method, headers, body, etc).
     * @param {boolean} retry  - Whether to retry once after a 401 response.
     * @returns {Promise<any>} - Parsed JSON response.
     * @throws Will throw an error for non-OK responses.
     */
    const requestWithAuth = async (path, options = {}, retry = true) => {

        // get the current token from ref
        let token = accessTokenRef.current;

        // make the request to the endpoint
        const response = await fetch(`${endpoint.baseUrl}${path}`,
        {
            ...options,                                                         // any existing fetch options (e.g. method, body, etc.)
            headers:                                                            // construct headers
            {
                ...options.headers,                                             // include any existing headers
                Authorization: token ? `Bearer ${token}` : undefined,           // attach bearer token if available
                Accept       : "application/json",                              // tell the server we expect a JSON response
            }
        });

        // check if response is not OK (e.g. 400, 500)
        if (response.status === 400 || response.status === 500) {
            let errorBody = {};
            try {
                errorBody = await response.json();
            } catch {
                throw new Error(`HTTP ${response.status}`);
            }

            // handle validation or known errors
            const errorMessage = errorBody.errors
                    ? Object.values(errorBody.errors).flat().join('\n')
                    : errorBody.message || errorBody.title || `HTTP ${response.status}: ${response.statusText}`;

            const error  = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        // if unauthorized and retry is allowed, attempt to refresh and retry once
        if (response.status === 401 && retry) {
            
            // get the new one directly
            const newToken = await refreshAccessToken();
            if (!newToken)
                throw new Error("Token refresh failed");

            // retry using the updated token
            return requestWithAuth(path, options, false);
        }

        // returns the parsed result
        return await response.json();
    };

    // Public API methods for making requests
    return { 
        /**
         * Sends a GET request to the specified endpoint.
         */
        apiGet: (path) => requestWithAuth(path, { method: "GET" }),

        /**
         * Sends a POST request with a JSON body.
         */
        apiPost: (path, body) =>
            requestWithAuth(path, {
                method : "POST",
                headers: { "Content-Type": "application/json" },
                body   : JSON.stringify(body)
            }),

        /**
        * Sends a PUT request with a JSON body.
        */
        apiPut: (path, body) =>
            requestWithAuth(path, {
                method : "PUT",
                headers: { "Content-Type": "application/json" },
                body   : JSON.stringify(body)
            }),

        /**
        * Sends a DELETE request to the specified endpoint.
        */
        apiDelete: (path) => requestWithAuth(path, { method: "DELETE" }),
     };
};