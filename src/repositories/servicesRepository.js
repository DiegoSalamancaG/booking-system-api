const prisma = require("../config/prisma");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

class ServiceRepository {

    async createService(serviceData, tx = null) {
        const db = tx || prisma;

        return db.service.create({
            data: serviceData
        });
    }

    async getServiceById(id, tx = null) {
        const db = tx || prisma;

        return db.service.findUnique({
            where: { id }
        });
    }

    async getAllServices(filters = {}, query = {}, tx = null) {
        const db = tx || prisma;
        const { page, limit, skip, take } = getPagination(query);
        const where = {};

        if(filters.name) where.name = filters.name;
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        const [data, total] = await Promise.all([
            db.service.findMany({
                where,
                orderBy: { id: 'desc' },
                skip,
                take: limit
            }),
            db.service.count({where})
        ]);
        return {
            data,
            meta: buildPaginationMeta(total, page, limit)
        }
    }

    async getAllActiveServices(tx = null) {
        const db = tx || prisma;

        return db.service.findMany({
            where: { isActive: true },
            orderBy: { id: 'desc' }
        });
    }

    async updateService(id, serviceData, tx = null) {
        const db = tx || prisma;

        const existing = await db.service.findUnique({ where: { id } });
        if (!existing) return null;

        return db.service.update({
            where: { id },
            data: serviceData
        });
    }

    async deactivateService(id, tx = null) {
        const db = tx || prisma;

        const existing = await db.service.findUnique({ where: { id }});
        if (!existing) return null;

        return db.service.update({
            where: { id },
            data: { isActive: false }
        });
    }

}

module.exports = new ServiceRepository();