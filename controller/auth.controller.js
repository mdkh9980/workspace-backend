import pool from "../db.js"
import jwt from 'jsonwebtoken'
import z from 'zod'

const usernameSchema = z.object({
    username: z.string().min(2)
});

const passwordSchema = z.object({
    password: z.string().min(6)
});

const jwtSecret = process.env.JSON_PRIVATE_KEY

const signup = async (req, res) => {
    const {username, password} = req.body
    const checkUsername = usernameSchema.safeParse({username})
    if(!checkUsername.success){
        return res.status(429).json({error: "validation error", message: "username must be at least 2 characters"})
    }
    const checkPassword = passwordSchema.safeParse({password})
    if(!checkPassword.success){
        return res.status(429).json({error: "validation error", message: "password must be at least 6 characters"});
    }
    const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
    await pool.query(query)
    return res.status(200).json({message: "User created Successfully"})
}

const signin = async (req, res) => {
    const {username, password} = req.body
    const checkUsername = usernameSchema.safeParse({username})
    if(!checkUsername.success){
        return res.status(429).json({error: "validation error", message: "username must be at least 2 characters"})
    }
    const checkPassword = passwordSchema.safeParse({password})
    if(!checkPassword.success){
        return res.status(429).json({error: "validation error", message: "password must be at least 6 characters"});
    }
    const query = `SELECT * FROM users WHERE username='${username}' and password='${password}'`;
    const result = await pool.query(query)
    if(result.rows.length == 0){
        return res.status(404).json({error: "Not Found"})
    }
    const jsonToken = jwt.sign(result.rows[0], jwtSecret, {expiresIn: '1d'})
    res.setHeader('Authorization', `Bearer ${jsonToken}`)
    return res.status(200).json({
        message: 'Logged In successfully',
        token: jsonToken
    });
}

export {
    signin,
    signup
}