const prisma = require('../config/prisma');
const { getPagination, buildPaginationMeta } = require("../utils/pagination")

class ReservationRepository {

    async createReservation(data, tx = null) {
        const db = tx || prisma;

        return db.reservation.create({
            data,
            include: {
                barber: { include: { user: true } },
                client: true,
                service: true
            }
        });
    }

    async getAllReservations(filters = {}, query = {}, tx = null) {
        const db = tx || prisma;
        const { page, limit, skip, take } = getPagination(query);
        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.barberId) where.barberId = Number(filters.barberId);
        if (filters.clientId) where.clientId = Number(filters.clientId);

        if(filters.from || filters.to){
            where.startTime = {};
            if(filters.from) where.startTime.gte = new Date(filters.from);
            if(filters.to) where.startTime.lte = new Date(filters.to);
        }

        const [data, total] = await Promise.all([
            db.reservation.findMany({
                where,
                include: {
                    barber: {include: { user: true}},
                    client: true,
                    service: true
                },
                orderBy: { startTime: 'desc' },
                skip,
                take: limit
            }),
            db.reservation.count({ where })
        ]);
        return {
            data,
            meta: buildPaginationMeta(total, page, limit)
        };
    }

    async getReservationById(id, tx = null) {
        const db = tx || prisma;

        return db.reservation.findUnique({
            where: { id },
            include: {
                barber: { include: { user: true } },
                client: true,
                service: true
            }
        });
    }

    async updateReservation(id, data, tx = null) {
        const db = tx || prisma;

        const existing = await db.reservation.findUnique({ where: { id } });
        if (!existing) return null;

        return db.reservation.update({
            where: { id },
            data,
            include: {
                barber: { include: { user: true } },
                client: true,
                service: true
            }
        });
    }

    async cancelReservation(id, tx = null) {
        const db = tx || prisma;

        return db.reservation.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });
    }

    async completeReservation(id, tx = null) {
        const db = tx || prisma;
         return db.reservation.update({
            where: { id },
            data: { status: 'COMPLETED' }
         })
    }

    async markAsNoShow(id, tx = null) {
        const db = tx || prisma;

        return db.reservation.update({
            where: { id },
            data: { status: 'NO_SHOW' }
        });
    }

    async findOverlapping(barberId, start, end, tx = null) {
        const db = tx || prisma;

        return db.reservation.findFirst({
            where: {
                barberId,
                status: 'SCHEDULED',
                AND: [
                    { startTime: { lt: end } },
                    { endTime: { gt: start } }
                ]
            }
        });
    }
}

module.exports = new ReservationRepository();