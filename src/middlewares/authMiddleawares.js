const { verifyToken } = require('../utils/auth/jwt');
const { UnauthorizedError, ForbiddenError } = require("../errors/TypesError");

const authenticate = (req ,res, next) => {
    try {
        const authorization = req.headers.authorization || "";
        if (!authorization.startsWith("Bearer ")) {
            throw new UnauthorizedError("Unauthorized");
        }
        const token = authorization.startsWith("Bearer ") 
            ? authorization.split(" ")[1] 
            : null;

        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next()
    } catch (error) {
        next(error);
    }
}

const restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ForbiddenError("Forbidden"));
        }
        next();
    };
};


module.exports = { authenticate, restrictTo }