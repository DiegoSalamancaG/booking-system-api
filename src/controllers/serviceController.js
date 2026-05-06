const CatalogServicesService = require("../services/catalogServicesService");
const { sendResponse } = require("../utils/responseHandler");

class ServiceController {
    async createService(req,res,next){
        try {
            const data = req.body;
            const service = await CatalogServicesService.createService(data, req.user);
            sendResponse(res,{
                statusCode: 201,
                message: "Service created successfully",
                data: service
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllServices(req, res, next){
        try {
            const services = await CatalogServicesService.getAllServices(req.query);
            sendResponse(res,{
                statusCode: 200,
                message: "List of services",
                data: services.data,
                meta: services.meta
            })
        } catch (error) {
            next(error)
        }
    }


    async getServiceById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const service = await CatalogServicesService.getServiceById(id);
            sendResponse(res, {
                message: "Service found",
                data: service
            });

        } catch (error) {
            next(error)
        }
    }

    async updateService(req, res, next) {
        try {
            const id = Number(req.params.id);
            const updatedService = await CatalogServicesService.updateService(id, req.body, req.user);
            sendResponse(res, {
                message: "Service updated successfully",
                data: updatedService
            });

        } catch (error) {
            next(error);
        }
    }

    async deactivateService(req,res,next){
        try {
            const id = Number(req.params.id);
            const deactivatedService = await CatalogServicesService.deactivateService(id);
            sendResponse(res,{
                message: "Services deactivated successfully",
                data: deactivatedService
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new ServiceController();