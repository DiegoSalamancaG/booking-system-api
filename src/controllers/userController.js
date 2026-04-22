const UserService = require('../services/userServices');
const { sendResponse } = require('../utils/responseHandler');

class UserController {

    async createUser(req, res, next) {
        try {
            const user = await UserService.createUser(req.body, req.user);

            sendResponse(res, {
                statusCode: 201,
                message: 'User created successfully',
                data: user
            });

        } catch (error) {
            next(error);
        }
    }

    async getUserByEmail(req, res, next) {
        try {
            const user = await UserService.getUserByEmail(req.params.email);

            sendResponse(res, {
                message: 'User found',
                data: user
            });

        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const user = await UserService.getUserById(id);

            sendResponse(res, {
                message: 'User found',
                data: user
            });

        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers(req.query);
            sendResponse(res, {
                statusCode: 200,
                message: 'List of users',
                data: users.data,
                meta: users.meta
            });

        } catch (error) {
            next(error);
        }
    }


    async updateUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            const updatedUser = await UserService.updateUser(id, req.body, req.user);

            sendResponse(res, {
                message: 'User updated successfully',
                data: updatedUser
            });

        } catch (error) {
            next(error);
        }
    }

    async deactivateUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            const user = await UserService.deactivateUser(id);

            sendResponse(res, {
                statusCode: 204,
                message: 'User deactivated successfully',
                data: user
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();