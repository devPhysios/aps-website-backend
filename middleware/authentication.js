const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticateStudent = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid - No token')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach student to the req object
        req.student = { studentId: payload.studentId, matricNumber: payload.matricNumber }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid - ')
    }
}

module.exports = authenticateStudent