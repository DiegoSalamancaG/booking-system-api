const ServicesRespository = require("../repositories/servicesRepository");
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const ServiceMapper = require("../mappers/serviceMapper");
const { serviceSchema, serviceUpdateSchema} = require("../validators/serviceValidators");

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

        return ServiceMapper.toResponse(newService);
    }

    async getAllServices() {
        const services = await ServicesRespository.getAllServices();
        return ServiceMapper.toResponseList(services);
    }

    async getAllActiveServices() {
        const services = await ServicesRespository.getAllActiveServices();
        return ServiceMapper.toResponseList(services);
    }

    async getServicesByid(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid Id");
        }
        const service = await ServicesRespository.getServiceById(id);
        if(!service){
            throw new NotFoundError("Service not found");
        }
        return ServiceMapper.toResponse(service);
    }

    async updateService(id, serviceData) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const validation = serviceUpdateSchema.safeParse(serviceData);
        if (!validation.success) {
            throw new ValidationError(validation.error.errors[0].message);
        }

        if (Object.keys(validation.data).length === 0) {
            throw new ValidationError('No valid data provided for update');
        }

        const updatedService = await ServicesRespository.updateService(id, validation.data);
        if (!updatedService) {
            throw new NotFoundError('Service not found');
        }

        return ServiceMapper.toResponse(updatedService);
    }
    async deactivateService(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid Id");
        }
        
        const deactivateService = await ServicesRespository.deactivateService(id);
        if(!deactivateService){
            throw new NotFoundError("Service not found")
        }

        return ServiceMapper.toResponse(deactivateService);
    }

}

module.exports = new CatalogServicesService();