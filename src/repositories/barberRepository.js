const { fi } = require("zod/locales");
const prisma = require("../config/prisma");

class BarberRepository {
    
    async createBarber(barberData, tx = null) {
        const db = tx || prisma;

        return await db.barber.create({
            data: barberData,
            include:{ user: true }
        });
    }

    async getBarberById(userId, tx = null) {
        const db = tx || prisma;

        return await db.barber.findUnique({
            where: { userId },
            include : { user: true }
        })
    }

    async getAllBarbers(filters= {}, tx = null) {
        const db = tx || prisma;
        const where = {
            user: {}
        };

        if(filters.status){
            where.user.status = filters.status;
        }

        return await db.barber.findMany({
            where,
            include: { user: true },
            orderBy: { userId: 'desc' }
        });
    }

    async updateBarber(id, barberData, tx = null) {
        const db = tx || prisma;

        const existing = await db.barber.findUnique({ where: { userId: id } });
        if (!existing) return null;

        return await db.barber.update({
            where: { id },
            data: barberData,
            include: { user: true }
        });
    }

    async deactivateBarber(userId, tx = null) {
        const db = tx || prisma;
        const existing = await db.barber.findUnique({ where: { userId }});
        if (!existing) return null;
        
        return await db.barber.update({
            where: { userId },
            data: { user: { update: { status: 'INACTIVE' } } },
            include: { user: true }
        });
    }


}
module.exports = new BarberRepository();