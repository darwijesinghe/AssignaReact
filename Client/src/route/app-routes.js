import { Routes, Route, Navigate } from "react-router-dom";

import { SignIn, SignUp } from "../pages/login";
import { SendResetLink, ResetPassword } from "../pages/reset";
import {
    AllTask,
    Pending,
    Complete,
    HighPriority,
    MediumPriority,
    LowPriority,
    ViewTask,
    UserNote,
    AddTask,
    EditTask
} from "../pages/task";
import { Unauthorized, NotFound  } from "../components/error";
import { ProtectedRoute, PublicRoute } from "../components/permission";
import Layout from "../components/layout/layout";

import { roles } from "../settings/constant";

/**
 * Route component.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function AppRoutes() {
    return (
        <Routes>

            {/* Redirect root to signin */}
            <Route path="/" element={
                <PublicRoute>
                    <Navigate to="/signin" replace />
                </PublicRoute>
            } />

            {/* Public routes */}
            <Route path="/signin" element={
                <PublicRoute>
                    <SignIn />
                </PublicRoute>
            } />
            <Route path="/signup" element={
                <PublicRoute>
                    <SignUp />
                </PublicRoute>
            } />

            <Route path="/reset-link" element={
                <PublicRoute>
                    <SendResetLink />
                </PublicRoute>
            } />

            <Route path="/reset-password" element={
                <PublicRoute>
                    <ResetPassword />
                </PublicRoute>
            } />

            {/* Protected routes for lead & member */}
            <Route element={<ProtectedRoute roles={[roles.lead, roles.member]} />}>
                <Route element={<Layout />}>
                    <Route path="/tasks" element={<AllTask />} />
                    <Route path="/pending" element={<Pending />} />
                    <Route path="/complete" element={<Complete />} />
                    <Route path="/high-priority" element={<HighPriority />} />
                    <Route path="/medium-priority" element={<MediumPriority />} />
                    <Route path="/low-priority" element={<LowPriority />} />
                    <Route path="/view-task" element={<ViewTask />} />

                    {/* Unauthorized component */}
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* 404 component */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>

            {/* Protected routes for member only */}
            <Route element={<ProtectedRoute roles={[roles.member]} />}>
                <Route element={<Layout />}>
                    <Route path="/user-note" element={<UserNote />} />
                </Route>
            </Route>

            {/* Protected routes for lead only */}
            <Route element={<ProtectedRoute roles={[roles.lead]} />}>
                <Route element={<Layout />}>
                    <Route path="/add-task" element={<AddTask />} />
                    <Route path="/edit-task" element={<EditTask />} />
                </Route>
            </Route>
        </Routes>
    );
};
