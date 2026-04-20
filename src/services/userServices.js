const UserRepository = require("../repositories/userRepository");
const UserMapper = require('../mappers/userMapper');
const { hashPassword } = require('../utils/auth/hashPassword');
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const { userSchema, userUpdateSchema } = require('../schemas/userSchema');

class UserService {

    // Método privado para crear user
    async _createUserValidated(data, tx = null) {

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
            role: role || 'CLIENT'
        }, tx);
    }

    // Método público
    async createUser(userData) {
        const validation = userSchema.safeParse(userData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const newUser = await this._createUserValidated(validation.data);

        return UserMapper.toResponse(newUser);
    }

    // Método interno para usar dentro barberService
    async createUserInternal(userData, tx = null) {
        const validation = userSchema.safeParse(userData);

        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        return await this._createUserValidated(validation.data, tx);
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

    async getAllUsers(filters = {}) {
        const users = await UserRepository.getAllUsers(filters);
        return UserMapper.toResponseList(users);
    }

    async getAllActiveUsers() {
        const users = await UserRepository.getAllUsers({ status: "ACTIVE" });
        return UserMapper.toResponseList(users);
    }

    async updateUser(id, userData) {
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

        const updatedUser = await UserRepository.updateUser(id, data);
        if (!updatedUser) {
            throw new NotFoundError('User not found');
        }

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

        return UserMapper.toResponse(deactivatedUser);
    }
}

module.exports = new UserService();