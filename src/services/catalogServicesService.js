const ServicesRespository = require("../repositories/servicesRepository");
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const serviceMapper = require("../mappers/serviceMapper");
const { serviceSchema } = require("../validators/serviceValidators");

class CatalogServicesService {

    async createService(serviceData) {
        const validationResult = serviceSchema.safeParse(serviceData)
        if(!validationResult.success){
            throw new ValidationError(validationResult.error.errors[0].message);
        }
        const { name, description, durationMinutes, price}= serviceData;
        const newService = await ServicesRespository.createService({
            name,
            description,
            price,
            durationMinutes
        })

        return serviceMapper.toResponse(newService);
    }

    async getAllServices() {
        const services = await ServicesRespository.getAllServices();
        return serviceMapper.toResponseList(services);
    }

    async getAllActiveServices() {
        const services = await ServicesRespository.getAllActiveServices();
        return serviceMapper.toResponseList(services);
    }

    async getServicesByid(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid Id");
        }
        const service = await ServicesRespository.getServiceById(id);
        if(!service){
            throw new NotFoundError("Service not found");
        }
        return serviceMapper.toResponse(service);
    }

    async updateService(id, serviceData) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        // Validar campos permitidos
        const allowedFields = ["name", "description","durationMinutes","price"];
        const invalidFields = Object.keys(serviceData).filter(
            key => !allowedFields.includes(key)
        )
        if(invalidFields.length > 0){
            throw new ValidationError("Invalid field provided");
        }

        const updatedService = await ServicesRespository.updateService(id, serviceData);
        if (!updatedService) {
            throw new NotFoundError('Service not found');
        }

        return serviceMapper.toResponse(updatedService);
    }
    async deactivateService(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid Id");
        }
        
        const deactivateService = await ServicesRespository.deactivateService(id);
        if(!deactivateService){
            throw new NotFoundError("Service not found")
        }

        return serviceMapper.toResponse(deactivateService);
    }

}

module.exports = new CatalogServicesService();