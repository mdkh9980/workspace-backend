import pool from "../db.js";

const getDashboardData = async (req, res) => {
    const user = req.user;

    const workspaces = await pool.query(`SELECT id FROM workspaces WHERE user_id='${user.id}'`);
    const workspaceRows = workspaces.rows;
    let totalTask = 0;
    let totalCompletedTask = 0;
    for(let i=0; i<workspaces.rowCount; i++){
        const workspaceId = workspaceRows[i].id;
        const workspaceTasks = await pool.query(`SELECT * FROM tasks WHERE workspace_id='${workspaceId}'`);
        const workspaceCompletedTasks = await pool.query(`SELECT * FROM tasks WHERE workspace_id='${workspaceId}' and completed='${true}'`);
        totalCompletedTask += workspaceCompletedTasks.rowCount;
        totalTask += workspaceTasks.rowCount;
    }
    res.status(200).json({
        data: {
            "totalWorkspaces": workspaces.rowCount,
            "totalTasks": totalTask,
            "completedTasks": totalCompletedTask,
            "pendingTasks": totalTask - totalCompletedTask
        }
    })
}

export {
    getDashboardData
}