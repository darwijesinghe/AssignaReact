import { useForm } from "react-hook-form";

/**
 * Form component used for sending a reminder for a specific record.
 *
 * @param {number} id         - The unique identifier of the record.
 * @param {string} name       - The name associated with the record (used for display or messaging).
 * @param {string} formId     - The ID of the form.
 * @param {Function} onSubmit - A callback fn to execute when the form submits.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function SendRemind({ id, name, formId, onSubmit }) {

    // Hooks
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues:
        {
            taskId: id ? parseInt(id, 10) : 0
        }
    });

    // Handle the submit event
    const submitForm = (data) => {
        onSubmit(data, reset);
    };

    return (
        <form id={formId} onSubmit={handleSubmit(submitForm)}>
            <div className="remind_to">
                <span className="rem_to">To</span>
                <span className="rem_name">{name}</span>
            </div>

            <div className="input_control">
                <textarea
                    rows="4"
                    placeholder="Write message"
                    {...register("message", { required: "Message is required" })}
                />
                {errors.message && <span className="val_msg">{errors.message.message}</span>}
            </div>
        </form>
    );
};