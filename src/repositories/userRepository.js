const prisma = require('../config/prisma');
const { getPagination, buildPaginationMeta } = require("../utils/pagination")

class UserRepository {
    
    async createUser(userData, tx = null) {
        const db = tx || prisma;
        return await db.user.create({ 
            data: userData });
    }

    async getAllActiveUsers(tx = null) {
        const db = tx || prisma;

        return db.user.findMany({
            where: { status: "ACTIVE" },
            orderBy: { id: 'desc' }
        });
    }

    async getAllUsers(filters = {}, query = {}, tx = null) {
        const db = tx || prisma;
        const { page, limit, skip, take } = getPagination(query)
        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.role) where.role = filters.role;

        const [data, total]= await Promise.all([
            db.user.findMany({
                where,
                orderBy: { id: 'desc' },
                skip,
                take: limit
            }),
            db.user.count({ where })
        ]);
        return {
            data,
            meta: buildPaginationMeta(total, page, limit)
        };
    }

    async getUserByEmail(email, tx = null) {
        const db = tx || prisma;
        return await db.user.findUnique({
            where: { email }
        });
    }

    async getUserById(id, tx = null) {
        const db = tx || prisma;
        return await db.user.findUnique({
            where: { id }
        });
    }

    async updateUser(id, userData, tx = null) {
        const db = tx || prisma;

        const existing = await db.user.findUnique({ where: { id } });
        if (!existing) return null;

        return await db.user.update({
            where: { id },
            data: userData
        });
    }

    async deactivateUser(id, tx = null) {
        const db = tx || prisma;

        const existing = await db.user.findUnique({ where: { id } });
        if (!existing) return null;
        
        return await db.user.update({
            where: { id },
            data: { status: "INACTIVE" }
        });
    }
}

module.exports = new UserRepository();