const ServiceRepository = require("../repositories/servicesRepository");
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const ServiceMapper = require("../mappers/serviceMapper");
const { serviceSchema, serviceUpdateSchema } = require("../schemas/serviceSchema");
const { parseBoolean } = require("../utils/queryParse");
const prisma = require("../config/prisma");

class CatalogServicesService {

    async createService(serviceData, user) {
        const userId= user?.id || null;

        const validation = serviceSchema.safeParse(serviceData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const { name, description, durationMinutes, price } = validation.data;

        const newService = await ServiceRepository.createService({
            name,
            description,
            durationMinutes,
            price,
            createdBy:userId
        });

        return ServiceMapper.toResponse(newService);
    }

    async getAllServices(query) {
        const { page, limit, ...filters } = query;
        if(filters.isActive !== undefined){
            filters.isActive = parseBoolean(filters.isActive)
        }
        const services = await ServiceRepository.getAllServices(filters, {page, limit});
        return {
            data:ServiceMapper.toResponseList(services.data),
            meta:services.meta
        }
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

    async updateService(id, serviceData, user) {
        const userId = user?.id || null;

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

        const updatedBy= userId;
        if(updatedBy) data.updatedBy=updatedBy
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