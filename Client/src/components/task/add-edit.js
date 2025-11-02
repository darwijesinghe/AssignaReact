import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { endpoint, cacheTime } from "../../settings/constant";
import { useApi } from "../../services/api-service";

/**
 * Form component used for adding or editing a record.
 *
 * @param {Function} onSubmit   - Callback function triggered when the form is submitted.
 * @param {Object|null} details - Existing data to pre-fill the form when editing. `null` means create mode.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function AddEdit({ onSubmit, details = null }) {

    // Hooks
    const { apiGet } = useApi();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({});

    // Fetch task categories
    const fetchCategories = async () => {
        try {
            const response = await apiGet(endpoint.categories);
            if (response.success) {
                return response.data;
            }
            else {
                console.error("Failed to load category data:", response.message);
                return null;
            }
        } catch (error) {
            console.error("Error loading category data:", error);
            return null;
        }
    };

    // Fetch team members
    const fetchMembers = async () => {
        try {
            const response = await apiGet(endpoint.members);
            if (response.success) {
                return response.data;
            }
            else {
                console.error("Failed to load member data:", response.message);
                return null;
            }
        } catch (error) {
            console.error("Error loading member data:", error);
            return null;
        }
    };

    // Handle the category data
    const { data: categories } = useQuery({
        queryKey : ["task-categories"],
        queryFn  : fetchCategories,
        staleTime: cacheTime.FIVE_MINUTES,
        retry    : 1
    });

    // Handle the member data
    const { data: members } = useQuery({
        queryKey : ["task-members"],
        queryFn  : fetchMembers,
        staleTime: cacheTime.FIVE_MINUTES,
        retry    : 1
    });

    // Set the default values when edit mode
    useEffect(() => {
        if (details?.length > 0 && categories && members) {
            reset({
                taskId      : details[0].taskId,
                taskTitle   : details[0].taskTitle,
                taskCategory: details[0].catId,
                deadline    : details[0].deadline.split("T")[0],
                member      : details[0].userId,
                priority    : details[0].highPriority ? "High" : details[0].mediumPriority ? "Medium" : "Low",
                taskNote    : details[0].taskNote
            });
        }
        else {
            reset({ priority: "High" });
        }
    }, [details, categories, members, reset]);

    // Handle form submission
    const formSubmit = (data) => {
        onSubmit(data, reset);
    };

    return (
        <section className="new_task section">
            <h3 className="section_tit">New Task</h3>
            <div className="task_form">

                {/* Add task form */}
                <form noValidate onSubmit={handleSubmit(formSubmit)}>

                    <div className="input_control">
                        <input id="task-title" type="text" role="textbox" placeholder="Task Title" {...register("taskTitle", { required: "Task title is required" })} />
                        {errors.taskTitle && <span className="val_msg">{errors.taskTitle.message}</span>}
                    </div>

                    <div className="input_control">
                        <div className="select">
                            <select required role="combobox" title="&nbsp;" {...register("taskCategory", { required: "Task category is required", valueAsNumber: true })}>
                                <option value="" defaultValue>Select Task Category</option>
                                {categories?.map((category) => (
                                    <option key={category.catId} value={category.catId}>
                                        {category.catName}
                                    </option>
                                ))}
                            </select>
                            <div className="select-arrow"></div>
                        </div>
                        {errors.taskCategory && <span className="val_msg">{errors.taskCategory.message}</span>}
                    </div>

                    <div className="input_control">
                        <div className="date">
                            <small className="place_holder">Deadline</small>
                            <input type="date" required title="&nbsp;" max="9999-12-31" {...register("deadline", { required: "Task deadline is required" })} />
                        </div>
                        {errors.deadline && <span className="val_msg">{errors.deadline.message}</span>}
                    </div>

                    <div className="input_control">
                        <div className="select">
                            <select required role="combobox" title="&nbsp;" {...register("member", { required: "Task member is required", valueAsNumber: true })}>
                                <option value="" defaultValue>Assign To</option>
                                {members?.map((member) => (
                                    <option key={member.userId} value={member.userId}>
                                        {member.firstName}
                                    </option>
                                ))}
                            </select>
                            <div className="select-arrow"></div>
                        </div>
                        {errors.member && <span className="val_msg">{errors.member.message}</span>}
                    </div>

                    <div className="input_control pri_level">
                        <div>
                            <label className="radio">
                                <input type="radio" role="radio" value="High" {...register("priority")} />
                                High Priority
                            </label>
                        </div>
                        <div>
                            <label className="radio">
                                <input type="radio" role="radio" value="Medium" {...register("priority")} />
                                Medium Priority
                            </label>
                        </div>
                        <div>
                            <label className="radio">
                                <input type="radio" role="radio" value="Low" {...register("priority")} />
                                Low Priority
                            </label>
                        </div>
                    </div>

                    <div className="input_control task_note">
                        <textarea rows="5" role="textbox" placeholder="Task Note" {...register("taskNote", { required: "Task note is required" })}></textarea>
                        {errors.taskNote && <span className="val_msg">{errors.taskNote.message}</span>}
                    </div>

                    <div className="save-button">
                        <button className="button" role="button" type="submit">Save Now</button>
                    </div>
                </form>
            </div>
        </section>
    );
};