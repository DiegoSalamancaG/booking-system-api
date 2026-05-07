const prisma = require("../config/prisma");
const { getPagination, buildPaginationMeta } = require("../utils/pagination")

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

    async getAllBarbers(filters= {}, query = {}, tx = null) {
        const db = tx || prisma;
        const { page, limit, skip, take } = getPagination(query);
        const where = {
            user: {}
        };

        if(filters.status){
            where.user.status = filters.status;
        }

        const [ data, total ] = await Promise.all([
            db.barber.findMany({
                where,
                include: { user: true },
                orderBy: { userId: 'desc' },
                skip,
                take: limit
            }),
            db.barber.count({where})
        ]);
        return {
            data,
            meta: buildPaginationMeta(total, page, limit)
        };
    }

    async updateBarber(id, barberData, tx = null) {
        const db = tx || prisma;

        const existing = await db.barber.findUnique({ where: { userId: id } });
        if (!existing) return null;

        const { fullName, email} = barberData;

        return await db.barber.update({
            where: { userId:id },
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