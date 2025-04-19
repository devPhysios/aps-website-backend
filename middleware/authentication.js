const jwt = require('jsonwebtoken')

const authenticateStudent = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Not authorized to access this route' })
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach student to the req object
        req.student = { studentId: payload.studentId, matricNumber: payload.matricNumber }
        next()
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
}

module.exports = authenticateStudent