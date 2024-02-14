const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors/index.js')

const authenticateStudent = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Not authorized to access this route' })
    }
    const token = authHeader.split(' ')[1]
    try {
        console.log("Incoming token:", token);
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded payload:", payload);
        //attach student to the req object
        req.student = { studentId: payload.userId, matricNumber: payload.name }
        console.log(req.student)
        next()
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
}

module.exports = authenticateStudent