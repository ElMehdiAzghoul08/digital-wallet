const jwt = require('jsonwebtoken');

// decode token

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decodedToken.userId;
        next();
    } catch (error) {
        res.send ({
            success: false,
            message: error.message,
        })
    }
};