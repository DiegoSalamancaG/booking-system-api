const { comparePassword } = require("../utils/auth/comparePassword");
const { hashPassword } = require("../utils/auth/hashPassword");
const { generateToken } = require("../utils/auth/jwt");
const { ValidationError, 
    NotFoundError, 
    ConflictError,
    InternalServerError } = require('../errors/TypesError');
const UserRepository = require("../repositories/userRepository");
const UserMapper = require("../mappers/userMapper");
const dotenv = require("dotenv");
dotenv.config();

class authService {
    async registerService(userData){
        const { email, password, fullName } = userData;
        if (!email || !password || !fullName) {
            throw new ValidationError('Email, password, and full name are required');
        }
        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) {
            throw new ConflictError('Email is already in use');
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await UserRepository.createUser({
            fullName,
            email,
            password: hashedPassword,
        })

        if (!newUser || newUser.length === 0) {
            throw new InternalServerError('Failed to create user');
        }
        return UserMapper.toResponse(newUser);

    }

    async loginService(email, password){
        if (!email || !password) {
            throw new ValidationError('Email and password are required');
        }

        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            throw new NotFoundError('Invalid credentials');
        }

        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            throw new NotFoundError('Invalid credentials');
        }

        if (user.status !== 'ACTIVE') {
            throw new NotFoundError('User account is not active');
        }

        const token = generateToken({
            id: user.id,
            role: user.role
        });

        return{
            token,
            user: UserMapper.toResponse(user)
        }

    }
}

module.exports = new authService();