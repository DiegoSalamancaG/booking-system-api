const { comparePassword } = require("../utils/auth/comparePassword");
const { generateToken } = require("../utils/auth/jwt");

const { ValidationError, ConflictError } = require('../errors/TypesError');

const UserRepository = require("../repositories/userRepository");
const UserService = require("../services/userServices");
const UserMapper = require("../mappers/userMapper");

const { registerSchema, loginSchema } = require("../schemas/authSchema");

class AuthService {

    async registerService(userData) {

        const validation = registerSchema.safeParse(userData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const newUser = await UserService.createUser(validation.data);
        const token = generateToken({
            id: newUser.id,
            role: newUser.role
        });

        return {
            token,
            user: newUser //el userService ya mapea el usuario
        };
    }

    async loginService(credentials) {

        const validation = loginSchema.safeParse(credentials);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const { email, password } = validation.data;
        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            throw new ValidationError('Invalid credentials');
        }

        if (user.status !== 'ACTIVE') {
            throw new ValidationError('User account is not active');
        }

        const isPasswordMatch = await comparePassword(password, user.password);

        if (!isPasswordMatch) {
            throw new ValidationError('Invalid credentials');
        }

        const token = generateToken({
            id: user.id,
            role: user.role
        });

        return {
            token,
            user: UserMapper.toResponse(user)
        };
    }
}

module.exports = new AuthService();