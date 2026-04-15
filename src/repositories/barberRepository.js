const prisma = require("../config/prisma");

class BarberRepository {
    async createBarber(barberData) {
        return prisma.barber.create({
            data: barberData
        });
    }

    async getBarberByEmail(email) {
        return prisma.barber.findUnique({
            where: { email },
            include : { user: true }
        });
    }

    async getBarberById(userId){
        return prisma.barber.findUnique({
            where: { userId },
            include : { user: true }
        })
    }

    async getAllBarbers() {
        return prisma.barber.findMany({
            where:{ user: { status: "ACTIVE" } },
            include: { user: true }
        });
    }

    async updateBarber(id, barberData) {
        return prisma.barber.update({
            where: { id },
            data: barberData
        });
    }

    async deactivateBarber(userId) {
        return prisma.user.update({
            where: { id:userId },
            data: { status: 'INACTIVE' }
        });
    }


}
module.exports = new BarberRepository();