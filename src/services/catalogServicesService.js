const ServiceRepository = require("../repositories/servicesRepository");
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const ServiceMapper = require("../mappers/serviceMapper");
const { serviceSchema, serviceUpdateSchema } = require("../schemas/serviceSchema");
const { parseBoolean } = require("../utils/queryParse")

class CatalogServicesService {

    async createService(serviceData) {

        const validation = serviceSchema.safeParse(serviceData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const { name, description, durationMinutes, price } = validation.data;

        const newService = await ServiceRepository.createService({
            name,
            description,
            durationMinutes,
            price
        });

        return ServiceMapper.toResponse(newService);
    }

    async getAllServices(filters = {}) {
        const parsedFilters = {};
        if (filters.isActive !== undefined) {
            parsedFilters.isActive = parseBoolean(filters.isActive);
        }

        const services = await ServiceRepository.getAllServices(parsedFilters);
        return ServiceMapper.toResponseList(services);
    }

    async getServiceById(id) {

        const serviceId = Number(id);
        if (!serviceId || isNaN(serviceId)) {
            throw new ValidationError("Invalid Id");
        }

        const service = await ServiceRepository.getServiceById(serviceId);
        if (!service) {
            throw new NotFoundError("Service not found");
        }

        return ServiceMapper.toResponse(service);
    }

    async updateService(id, serviceData) {

        const serviceId = Number(id);
        if (!serviceId || isNaN(serviceId)) {
            throw new ValidationError('Invalid ID');
        }

        const validation = serviceUpdateSchema.safeParse(serviceData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const data = validation.data;
        if (Object.keys(data).length === 0) {
            throw new ValidationError('No valid data provided for update');
        }

        const updatedService = await ServiceRepository.updateService(serviceId, data);
        if (!updatedService) {
            throw new NotFoundError('Service not found');
        }

        return ServiceMapper.toResponse(updatedService);
    }

    async deactivateService(id) {

        const serviceId = Number(id);
        if (!serviceId || isNaN(serviceId)) {
            throw new ValidationError("Invalid Id");
        }

        const deactivatedService = await ServiceRepository.deactivateService(serviceId);
        if (!deactivatedService) {
            throw new NotFoundError("Service not found");
        }

        return ServiceMapper.toResponse(deactivatedService);
    }
}

module.exports = new CatalogServicesService();