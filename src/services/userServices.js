const prisma = require("../config/prisma");
const UserRepository = require("../repositories/userRepository");
const UserMapper = require('../mappers/userMapper');
const { hashPassword } = require('../utils/auth/hashPassword');
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const { userSchema, userUpdateSchema } = require('../validators/userValidators');

class UserService {

    async createUser(userData) {
        const validation = userSchema.safeParse(userData);
        if (!validation.success) {
            throw new ValidationError(validation.error.errors[0].message);
        }

        const {  email, password } = validation.data;

        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) {
            throw new ValidationError('Email already in use');
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await UserRepository.createUser({
            ...validation.data,
            password: hashedPassword
        });

        return UserMapper.toResponse(newUser);
    }


    // Método interno para crear usuario (usado por BarberService)
    async createUserInternal(userData, tx = null) {
    const db = tx || prisma;

    const validation = userSchema.safeParse(userData);
    if (!validation.success) {
        throw new ValidationError(validation.error.errors[0].message);
    }

    const { email, password, fullName, role } = validation.data;

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

    async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        return UserMapper.toResponseList(users);
    }

    async getAllActiveUsers() {
        const users = await UserRepository.getAllActiveUsers();
        return UserMapper.toResponseList(users);
    }

    async updateUser(id, userData) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }
        
        const validation = userUpdateSchema.safeParse(userData);
        if (!validation.success) {
            throw new ValidationError(validation.error.errors[0].message);
        }
        
        const data = validation.data;
        if(Object.keys(data).length === 0){
            throw new ValidationError('No valid fields to update');
        }
        if(data.password) {
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