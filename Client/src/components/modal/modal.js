/**
 * Renders a modal dialog box with customizable data.
 *
 * @param {boolean} isOpen          - Whether the modal is visible.
 * @param {string} title            - The title displayed on the dialog.
 * @param {string|JSX.Element} body - The content/message shown inside the dialog.
 * @param {string} buttonText       - Label for the confirm action button.
 * @param {Function} onConfirm      - A callback fn to execute when the user confirms.
 * @param {string} formId           - The ID of the form.
 * @param {Function} onClose        - A callback fn to execute when the user cancels or closes the dialog.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Modal({ isOpen, title, body, buttonText, onConfirm, formId, onClose }) {

    if (!isOpen) return null;

    return (
        <div className="confirm">
            <div className="confirm_window">
                <div className="con_title">
                    <p className="con_topic">{title}</p>
                    <div className="con_close">
                        <span className="material-symbols-outlined icon" onClick={onClose}>close</span>
                    </div>
                </div>

                <div className="con_ask">{body}</div>
                
                {formId ? (
                    <div className="con_actions">
                        <button className="button con_yes" form={formId} type="submit">{buttonText}</button>
                        <button className="button con_no" type="button" onClick={onClose}>Cancel</button>
                    </div>
                ) : (
                    <div className="con_actions">
                        <button className="button con_yes" onClick={onConfirm}>{buttonText}</button>
                        <button className="button con_no" onClick={onClose}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    )
};