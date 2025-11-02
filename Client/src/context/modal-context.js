import { createContext, useContext, useState } from "react";

import Modal from "../components/modal/modal";

// Create a context to store generic modal state and actions.
const ModalContext = createContext({});

/**
 * This component manages and provides modal state and functions to its children via React Context.
 * 
 * @param {JSX.Element} children - Child components.
 */
export function ModalProvider({ children }) {
    
    // Hooks
    const [modal, setModal] = useState({
        isOpen    : false,
        title     : "",
        body      : null,
        buttonText: "",
        onConfirm : null,
        formId    : ""
    });

    /**
     * A function to open the confirm modal dialog.
     *
     * @param {string} title            - The title displayed at the top of the modal.
     * @param {string|JSX.Element} body - The modal body content (text or JSX).
     * @param {string} buttonText       - The text of the main action button.
     * @param {Function} onConfirm      - A callback fn to execute when the user confirms.
     */
    const openConfirmModal = ({ title, body, buttonText = "Ok", onConfirm }) => {
        setModal({ isOpen: true, title, body, buttonText, onConfirm });
    };

    /**
     * A function to open the form modal dialog.
     *
     * @param {string} title            - The title displayed at the top of the modal.
     * @param {string|JSX.Element} body - The modal body content (text or JSX).
     * @param {string} buttonText       - The text of the main action button.
     * @param {string} formId           - The ID of the form.
     */
    const openFormModal = ({ title, body, buttonText = "Save", formId }) => {
        setModal({ isOpen: true, title, body, buttonText, formId });
    };

    /**
     * A function to close the modal.
     */
    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider value={{ openConfirmModal, openFormModal, closeModal }}>
            {children}
            <Modal {...modal} onClose={closeModal}/>
        </ModalContext.Provider>
    );
}

/**
 * Custom hook to access the modal context.
 *
 * Provides:
 * - openConfirmModal: Function to open the confirm modal.
 * - openFormModal   : Function to open the form modal.
 * - closeModal      : Function to close the modal.
 *
 * Must be used within a component wrapped by <ModalProvider>.
 * 
 * @returns {{
 *   openConfirmModal: (title: string, body: JSX.Element, buttonText: string, onConfirm: Function) => void,
 *   openFormModal   : (title: string, body: JSX.Element, buttonText: string, formId: string) => void,
 *   closeModal      : Function 
 * }} context helpers.
 */
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("Must be used within a component wrapped in <ModalProvider>.");
    }
    return context;
};