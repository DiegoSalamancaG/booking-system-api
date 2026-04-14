const AuthService = require("../services/authServices");
const { sendResponse } = require("../utils/responseHandler");

class authController {
    async loginController(req, res, next){
        try {
            const { email, password } = req.body;
            const result = await AuthService.loginService(email, password)

            sendResponse(res,{
                message: 'Login successful',
                data: result
            })

        } catch (error) {
            next(error);
        }
    }

    async registerController(req, res, next){
        try {
            const userData = req.body;
            const result = await AuthService.registerService(userData);

            sendResponse(res,{
                statusCode: 201,
                message:'Registration successful',
                data: result
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new authController();