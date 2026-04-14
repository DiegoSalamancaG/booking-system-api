const prisma = require('../config/prisma');

class UserRepository {
    async createUser(userData) {
        return await prisma.user.create({ data: userData });
    }

    async getAllActiveUsers() {
        return await prisma.user.findMany({
            where: { status: "ACTIVE" }
        });
    }
    async getAllUsers() {
        return await prisma.user.findMany();
    }

    async getUserByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    async updateUser(id, userData) {
        return await prisma.user.update({
            where: { id },
            data: userData
        });
    }

    async deactivateUser(id) {
        return await prisma.user.update({
            where: { id },
            data: { status: "INACTIVE" }
        });
    }
}

module.exports = new UserRepository();