const prisma = require("../config/prisma");

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

    async getAllServices(filters = {}, tx = null) {
        const db = tx || prisma;

        const where = {};

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        return db.service.findMany({
            where,
            orderBy: { id: 'desc' }
        });
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