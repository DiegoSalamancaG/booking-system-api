const UserRepository = require("../repositories/userRepository");
const UserMapper = require('../mappers/userMapper');
const logger = require("../config/logger");

const { hashPassword } = require('../utils/auth/hashPassword');
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const { userCreateSchema, userUpdateSchema } = require('../schemas/userSchema');

class UserService {

    // Método privado para crear user
    async _createUserValidated(data, tx = null, createdBy = null) {
        const { email, password, fullName, role } = data;

        const existingUser = await UserRepository.getUserByEmail(email, tx);
        if (existingUser) {
            throw new ValidationError('Email already in use');
        }

        const hashedPassword = await hashPassword(password);

        return await UserRepository.createUser({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'CLIENT',
            createdBy
        }, tx);
    }

    // Método público
    async createUser(userData, user) {
        const userId = user?.id || null;

        const validation = userCreateSchema.safeParse(userData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const newUser = await this._createUserValidated(validation.data, null, userId);

        logger.info(`User created: id ${newUser.id} | name: ${newUser.fullName} | created by: ${userId}`)
        return UserMapper.toResponse(newUser);
    }

    // Método interno para usar dentro barberService
    async createUserInternal(userData, tx = null, user) {
        const userId = user?.id || null;

        const validation = userCreateSchema.safeParse(userData);

        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        return await this._createUserValidated(validation.data, tx, userId);
    }

    async getUserByEmail(email) {
        if (!email) {
            throw new ValidationError('Invalid email');
        }

        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return UserMapper.toResponse(user);
    }

    async getUserById(id) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const user = await UserRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return UserMapper.toResponse(user);
    }

    async getAllUsers(query) {
        const { page, limit, ...filters } = query;
        const users = await UserRepository.getAllUsers(filters, { page, limit });
        return { 
            data: UserMapper.toResponseList(users.data), 
            meta: users.meta
        };
    }

    async getAllActiveUsers() {
        const users = await UserRepository.getAllUsers({ status: "ACTIVE" });
        return UserMapper.toResponseList(users);
    }

    async updateUser(id, userData, user) {
        const userId = user?.id || null;

        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const validation = userUpdateSchema.safeParse(userData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const data = validation.data;

        if (Object.keys(data).length === 0) {
            throw new ValidationError('No valid fields to update');
        }

        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        const updatedUser = await UserRepository.updateUser(id, {
            ...data,
            updatedBy:userId
        });
        if (!updatedUser) {
            throw new NotFoundError('User not found');
        }

        logger.info(`User updated: id ${updatedUser.id} | name: ${updatedUser.fullName} | updated by: ${userId}`)
        return UserMapper.toResponse(updatedUser);
    }

    async deactivateUser(id) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const deactivatedUser = await UserRepository.deactivateUser(id);
        if (!deactivatedUser) {
            throw new NotFoundError('User not found');
        }
        
        logger.warn(`User deactivated: Id ${id} | name: ${deactivatedUser.fullName}`)
        return UserMapper.toResponse(deactivatedUser);
    }
}

module.exports = new UserService();