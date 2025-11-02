/**
 * API endpoints 
 */
export const endpoint = {
    // Base path
    baseUrl         : process.env.REACT_APP_API_URL,
    
    // Core paths
    register        : "/user/register",
    login           : "/user/login",
    forgot          : "/user/forgot-password",
    resetLink       : "/user/send-reset-link",
    reset           : "/user/reset-password",
    refresh         : "/user/refresh-token",
    external        : "/user/external-login",
    taskCount       : "/user/task-count",
    categories      : "/category/categories",
    members         : "/user/members",
    
    // Lead paths
    addTask         : "/leadtasks/add-task",
    allTask         : "/leadtasks/tasks",
    pending         : "/leadtasks/pendings",
    complete        : "/leadtasks/completes",
    highPriority    : "/leadtasks/high-priority",
    mediumPriority  : "/leadtasks/medium-priority",
    lowPriority     : "/leadtasks/low-priority",
    taskInfo        : "/leadtasks/task-info",
    editTask        : "/leadtasks/edit-task",
    deleteTask      : "/leadtasks/delete-task",
    sendRemind      : "/leadtasks/send-remind",
    
    // Member paths
    meAllTask       : "/membertasks/tasks",
    mePending       : "/membertasks/pendings",
    meComplete      : "/membertasks/completes",
    meHighPriority  : "/membertasks/high-priority",
    meMediumPriority: "/membertasks/medium-priority",
    meLowPriority   : "/membertasks/low-priority",
    meTaskInfo      : "/membertasks/task-info",
    meWriteNote     : "/membertasks/write-note",
    meMarkDone      : "/membertasks/mark-done"
};

/**
 * Test accounts
 */
export const teamLead = {
    UserName: "test@lead",
    Password: "lead@123"
}

export const teamMember = {
    UserName: "test@member",
    Password: "member@123"
}

/**
 * App roles
 */
export const roles = {
    member : "team-member",
    lead   : "team-lead",
    default: "user"
}

/**
 * External sign-in providers
 */
export const providers = {
    google: "Google"
}

/**
 * Cache time
 */
export const cacheTime = {
    FIVE_MINUTES: 5 * 60 * 1000,
    TEN_MINUTES : 10 * 60 * 1000
}