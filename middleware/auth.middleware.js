import jwt from 'jsonwebtoken'
import pool from '../db.js';
const jwtSecret = process.env.JSON_PRIVATE_KEY

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token is Missing' })
    }

    try {
        const token = authHeader.split(' ')[1]
        const verify = jwt.verify(token, jwtSecret)
        const result = await pool.query(`SELECT * FROM users WHERE id=${verify.id}`)
        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ message: 'Unauthorised' })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorised' })
    }
}

export default authMiddleware