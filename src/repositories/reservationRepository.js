const prisma = require('../config/prisma');

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

    async getAllReservations(filters = {}, tx = null) {
        const db = tx || prisma;

        const where = {};

        if (filters.status) where.status = filters.status;
        if (filters.barberId) where.barberId = filters.barberId;
        if (filters.clientId) where.clientId = filters.clientId;

        return db.reservation.findMany({
            where,
            include: {
                barber: { include: { user: true } },
                client: true,
                service: true
            },
            orderBy: { startTime: 'desc' }
        });
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