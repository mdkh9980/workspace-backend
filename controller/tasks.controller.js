import pool from "../db.js";

const createTask = async(req, res) => {
    const user = req.user
    const workSpaceId = req.headers['workspaceid'];
    const {title, description} = req.body
    if(!workSpaceId) {
        return res.status(400).json({message: "Workspace Id is missing"})
    }
    const workspaceCheck = `SELECT * FROM workspaces WHERE id='${Number(workSpaceId)} and user_id='${user.id}''`;
    if(workspaceCheck.rowCount == 0){
        return res.status(404).json({"message": "Workspace Not found"})
    }
    const query = `INSERT INTO tasks (title, description, completed, workspace_id) VALUES ('${title}', '${description}', '${false}', '${Number(workSpaceId)}')`;
    await pool.query(query)
    const tasksId = await pool.query(`SELECT id FROM tasks WHERE title='${title}' and description='${description}' and completed='${false}' and workspace_id='${Number(workSpaceId)}'`)
    return res.status(201).json({tasksId: tasksId.rows[0]});
}

const getTasks = async(req, res) => {
    const user = req.user
    const workSpaceId = req.headers['workspaceid']
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page-1) * limit;
    if(!workSpaceId) {
        return res.status(400).json({message: "Workspace Id is missing"})
    }
    const allWorkspaces = await pool.query(`SELECT id FROM workspaces WHERE user_id='${user.id}'`);
    const allTasks = await pool.query(`SELECT * FROM tasks WHERE workspace_id='${Number(workSpaceId)}' ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`)
    const totalItems = allTasks.rowCount;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return res.status(200).json({
        data: allTasks.rows,
        pagination: {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
            hasNextPage,
            hasPreviousPage
        }
    })
}

const markTaskComplete = async(req, res) => {
    const {completed} = req.body
    const params = req.params
    const user = req.user
    if(!completed){
        return res.status(400).json({"message": "Completed Data is missing"})
    }
    if(!Object.hasOwn(params, 'taskId')){
        return res.status(400).json({"message": "taskId is missing in params"})
    }
    const isTaskValid = await pool.query(`SELECT workspace_id FROM tasks WHERE id='${Number(params.taskId)}'`)
    const isWorkspaceValid = await pool.query(`SELECT user_id FROM workspaces WHERE id='${isTaskValid.rows[0].workspace_id}'`)
    if(isWorkspaceValid.rows[0].user_id != user.id){
        return res.status(403).json({"message": "Task does not belong to the user"})
    }
    const markAsComplete = await pool.query(`UPDATE tasks SET completed = '${completed}' WHERE id='${Number(params.taskId)}'`)
    return res.status(200).json({"message": "Task Updated"})
}

const deleteTask = async(req, res) => {
    const params = req.params
    const user = req.user
    if(!Object.hasOwn(params, 'taskId')){
        return res.status(400).json({"message": "taskId is missing in params"})
    }
    const isTaskValid = await pool.query(`SELECT workspace_id FROM tasks WHERE id='${Number(params.taskId)}'`)
    const isWorkspaceValid = await pool.query(`SELECT user_id FROM workspaces WHERE id='${isTaskValid.rows[0].workspace_id}'`)
    if(isWorkspaceValid.rows[0].user_id != user.id){
        return res.status(403).json({"message": "Task does not belong to the user"})
    }
    await pool.query(`DELETE FROM tasks WHERE id='${Number(params.taskId)}'`)
    return res.status(200).json({"message": "Task Deleted"})
}

export {
    createTask,
    getTasks,
    markTaskComplete,
    deleteTask
}