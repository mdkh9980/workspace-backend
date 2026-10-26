import z from "zod"
import pool from '../db.js'

const nameSchema = z.object({
    name: z.string().min(1)
});

const createWorkspace = async(req, res) => {
    const user = req.user
    const {name} = req.body
    const checkName = nameSchema.safeParse({name});
    if(!checkName.success){
        return res.status(429).json({error: "Validation error", message: "Workspace name must be at least 1 character"})
    }
    const query = `INSERT INTO workspaces (name, user_id) VALUES ('${name}', '${user.id}')`;
    const result = await pool.query(query)
    const getWorkspace = await pool.query(`SELECT id FROM workspaces WHERE name='${name}' and user_id=${user.id}`)
    return res.status(201).json({workspaceId: getWorkspace.rows[0]})
}

const getAllWorkspaces = async(req, res) => {
    const user = req.user
    const query = `SELECT * FROM workspaces WHERE user_id='${user.id}'`;
    const result = await pool.query(query)
    return res.status(200).json({data: result.rows})
}

const deleteWorkspace = async(req, res) => {
    const user = req.user;
    const params = req.params
    if(!Object.hasOwn(params, 'id')){
        return res.status(404).json({error: "Missing workspace Id"})
    }
    const query = `DELETE FROM workspaces WHERE id='${params.id}' and user_id='${user.id}'`
    await pool.query(query);
    return res.status(200).json({message: "Workspace Deleted"});
}

export {
    createWorkspace,
    getAllWorkspaces,
    deleteWorkspace
}