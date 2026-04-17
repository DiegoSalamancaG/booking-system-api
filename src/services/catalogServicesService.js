const ServicesRespository = require("../repositories/servicesRepository");
const { ServicesMapper } = require("../mappers/serviceMapper")
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const serviceMapper = require("../mappers/serviceMapper");

class CatalogServicesService {

    async createService(serviceData) {
        const { name, description, durationMinutes, price}= serviceData;
        if(!name || !description || !price){
            throw new ValidationError("Missing required fields")
        }
        if(durationMinutes<=0){
            throw new ValidationError("Duration must be greater than 0")
        }
        if(price<=0){
            throw new ValidationError("Price must be greater than 0")
        }

        const newService = await ServicesRespository.createService({
            name,
            description,
            price,
            durationMinutes
        })

        return serviceMapper.toResponse(newService);
    }

    async getAllServices() {

        const services = await ServiceRepository.getAllServices();
        if (!services.length===0) {
            throw new NotFoundError('No services found');
        }
        return serviceMapper.toResponseList(services);
    }

    async getAllActiveServices() {
        const services = await ServiceRepository.getAllActiveServicess();
        if (!services.length===0) {
            throw new NotFoundError('No active services found');
        }
    return serviceMapper.toResponseList(services);
    }

    async updateService(id, serviceData) {
        if (!id || isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }
        if (!serviceData || Object.keys(serviceData).length === 0) {
            throw new ValidationError('No data provided for update');
        }
        if (serviceData.durationMinutes !== undefined && serviceData.durationMinutes <= 0) {
            throw new ValidationError('Duration must be greater than 0');
        }
        if (serviceData.price !== undefined && serviceData.price <= 0) {
            throw new ValidationError('Price must be greater than 0');
        }

        // Validar campos permitidos
        const allowedFields = ["name", "description","durationMinutes","price"];
        const invalidFields = Object.keys(serviceData).filter(
            key => !allowedFields.includes(key)
        )
        if(invalidFields.length > 0){
            throw new ValidationError("Invalid field provided");
        }

        const updatedService = await ServiceRepository.updateService(id, serviceData);
        if (!updatedService) {
            throw new NotFoundError('Service not found');
        }

        return ServicesMapper.toResponse(updatedService);
    }

    async deactivateService(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid Id");
        }
        
        const deactivateService = await ServicesRespository.deactivateService(id);
        if(!deactivateService){
            throw new NotFoundError("Service not found")
        }

        return ServicesMapper.toResponse(deactivateService);
    }

}

module.exports = new CatalogServicesService();