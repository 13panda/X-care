import jwt from 'jsonwebtoken'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Not Authorized, login again" });
        }

        const token = authHeader.split(" ")[1];

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Có thể kiểm tra thêm nếu là admin:
        if (token_decode && token_decode.isAdmin) {
            next();
        } else {
            return res.json({ success: false, message: "Access denied: Admin only" });
        }

    } catch (error) {
        console.error("authAdmin error:", error.message);
        res.json({ success: false, message: "Invalid or expired token" });
    }
}

export default authAdmin;
