const prisma = require("../config/prisma");

class ServicesRespository {

    async createService (serviceData){
        return await prisma.service.create({
            data: serviceData
        })
    }

    async getServiceById(id){
        return await prisma.service.findUnique({
            where: { id }
        })
    }

    async getAllServices(){
        return await prisma.service.findMany();
    }

    async getAllActiveServices(){
        return prisma.service.findMany({
            where: { isActive: true }
        })
    }

    async updateService(id, serviceData){
        return await prisma.service.update({
            where: { id },
            data: serviceData
        })
    }

    async deactivateService(id){
        return await prisma.service.update({
            where: { id },
            data: { isActive: false }
        })
    }


}
module.exports = new ServicesRespository();