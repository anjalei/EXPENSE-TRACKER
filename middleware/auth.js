const jwt = require("jsonwebtoken");
const User = require("../model/user"); 

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log("🔐 authHeader:", authHeader);

        if (!authHeader) {
            console.log("❌ No token provided.");
            return res.status(401).json({ error: 'No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        console.log("🔑 token:", token);

        const decoded = jwt.verify(token, 'my-secret-keyyy');
        console.log("✅ Decoded token in middleware:", decoded);

        const user = await User.findOne({ where: { id: decoded.userId } });
        console.log("🔎 Fetched user:", user);

        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(401).json({ error: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Token verification error:", error.message);
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = authenticateUser;
