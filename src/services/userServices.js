const UserRepository = require("../repositories/userRepository");
const userMapper = require('../mappers/userMapper');
const { hashPassword } = require('../utils/auth/hashPassword');
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const prisma = require("../config/prisma");

class UserService {

    async createUser(userData) {
        const { fullName, email, password, role, status } = userData;

        if (!fullName || !email || !password) {
            throw new ValidationError('Missing required fields');
        }

        const existingUser = await UserRepository.getUserByEmail(email);

        if (existingUser) {
            throw new ValidationError('Email already in use');
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await UserRepository.createUser({
            fullName,
            email,
            password: hashedPassword,
            role: role,
            status: status
        });

        return userMapper.toResponse(newUser);
    }


    // Método interno para crear usuario (usado por BarberService)
    async createUserInternal(userData, tx = null) {
    const db = tx || prisma;

    const { fullName, email, password, role } = userData;
    if (!fullName || !email || !password) {
        throw new ValidationError('Missing required fields');
    }

    // Verificar email usando db, no repository
    const existingUser = await db.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new ValidationError('Email already in use');
    }

    const hashedPassword = await hashPassword(password);

    // Crear usuario dentro de la transacción
    const newUser = await db.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
            role: role || 'CLIENT'
        }
    });
    return newUser;
}


    async getUserByEmail(email) {
        if (!email) {
            throw new ValidationError('Invalid email');
        }

        const user = await UserRepository.getUserByEmail(email);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return userMapper.toResponse(user);
    }

    async getUserById(id) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const user = await UserRepository.getUserById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return userMapper.toResponse(user);
    }

    async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        if (!users || users.length === 0) {
            throw new NotFoundError('No users found');
        }
        return userMapper.toResponseList(users);
    }

    async getAllActiveUsers() {
        const users = await UserRepository.getAllActiveUsers();
        if (!users || users.length === 0) {
            throw new NotFoundError('No users found');
        }
        return userMapper.toResponseList(users);
    }

    async updateUser(id, userData) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        if (!userData || Object.keys(userData).length === 0) {
            throw new ValidationError('No data provided for update');
        }

        // Opcional: validar campos permitidos
        const allowedFields = ['fullName', 'email', 'password'];
        const invalidFields = Object.keys(userData).filter(
            key => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            throw new ValidationError('Invalid fields provided');
        }

        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }

        const updatedUser = await UserRepository.updateUser(id, userData);

        if (!updatedUser) {
            throw new NotFoundError('User not found');
        }

        return userMapper.toResponse(updatedUser);
    }

    async deactivateUser(id) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const deactivatedUser = await UserRepository.deactivateUser(id);

        if (!deactivatedUser) {
            throw new NotFoundError('User not found');
        }

        return userMapper.toResponse(deactivatedUser);
    }
}

module.exports = new UserService();