const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded; // Attach the decoded user information to req.user
        next(); // Proceed to the next middleware
    });
};

// Existing isAdmin middleware
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};