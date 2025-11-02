import { useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useLoading } from "../../context/loading-context";

/**
 * Synchronizes the global loading state with React Query's active fetches and mutations.
 *
 * @param {void} None - This component does not accept any props.
 * @returns {null}    - Returns nothing; used only for side effects.
 */
export default function GlobalLoadingSync() {
    const isFetching     = useIsFetching();     // counts active queries
    const isMutating     = useIsMutating();     // counts active mutations
    const { setLoading } = useLoading(true);

    useEffect(() => {
        // if any queries or mutations are active -> show overlay
        setLoading(isFetching > 0 || isMutating > 0);
    }, [isFetching, isMutating, setLoading]);

    return null;
}