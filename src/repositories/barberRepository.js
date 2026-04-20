const { includes } = require("zod");
const prisma = require("../config/prisma");

class BarberRepository {
    async createBarber(barberData) {
        return await prisma.barber.create({
            data: barberData
        });
    }

    async getBarberByEmail(email) {
        return await prisma.barber.findUnique({
            where: { email },
            include : { user: true }
        });
    }

    async getBarberById(userId){
        return await prisma.barber.findUnique({
            where: { userId },
            include : { user: true }
        })
    }

    async getAllBarbers() {
        return await prisma.barber.findMany({
            where:{ user: { status: "ACTIVE" } },
            include: { user: true }
        });
    }

    async updateBarber(id, barberData) {
        return await prisma.barber.update({
            where: { id },
            data: barberData
        });
    }

    async deactivateBarber(userId) {
        return await prisma.barber.update({
            where: { userId },
            data: { user: { update: { status: 'INACTIVE' } } },
            include: { user: true }
        });
    }


}
module.exports = new BarberRepository();