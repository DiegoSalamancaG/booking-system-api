const prisma = require("../config/prisma");

class ServicesRespository {

    async createService (serviceData){
        return prisma.service.create({
            data: serviceData
        })
    }

    async getServiceById(id){
        return prisma.service.findUnique({
            where: { id }
        })
    }

    async getAllServices(){
        return prisma.service.findMany();
    }

    async getAllActiveServices(){
        return prisma.service.findMany({
            where: { isActive: true }
        })
    }

    async updateService(id, serviceData){
        return prisma.service.update({
            where: { id },
            data: serviceData
        })
    }

    async deactivateService(id){
        return prisma.service.update({
            where: { id },
            data: { isActive: false }
        })
    }


}
module.exports = new ServicesRespository();