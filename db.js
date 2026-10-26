import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

const userTableQuery = `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE, password TEXT)`
await pool.query(userTableQuery)

const workspaceTableQuery = `CREATE TABLE IF NOT EXISTS workspaces(id SERIAL PRIMARY KEY, name TEXT, user_id INTEGER REFERENCES users(id))`
await pool.query(workspaceTableQuery)

const tasksTableQuery = `CREATE TABLE IF NOT EXISTS tasks(id SERIAL PRIMARY KEY, title TEXT, description TEXT, completed BOOLEAN, workspace_id INTEGER REFERENCES workspaces(id))`
await pool.query(tasksTableQuery)

export default pool