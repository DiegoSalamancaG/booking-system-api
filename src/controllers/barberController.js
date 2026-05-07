const BarberService = require("../services/barberService");
const { sendResponse }  = require("../utils/responseHandler");

class BarberController {

    async createBarber(req, res, next){
        try {
            const data = req.body;
            const barber = await BarberService.createBarber(data, req.user);
            sendResponse(res, {
                statusCode: 201,
                message: 'Barber created successfully',
                data: barber
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllbarbers(req, res, next){
        try {
            const barbers = await BarberService.getAllBarbers(req.query);
            sendResponse(res, {
                statusCode:200,
                message: 'List of barbers',
                data: barbers.data,
                meta: barbers.meta
            })
        } catch (error) {
            next(error);
        }
    }

    async getBarberById(req, res, next){
        try {
            const id = Number(req.params.id);
            const barber = await BarberService.getBarberById(id);
            sendResponse(res, {
                message: 'Barber found',
                data: barber
            });
        } catch (error) {
            next(error);
        }
    }

    async updateBarber(req, res, next){
        try {
            const id = Number(req.params.id);
            const data = req.body;
            const updatedBarber = await BarberService.updateBarber(id, data, req.user);
            sendResponse(res, {
                message: 'Barber updated successfully',
                data: updatedBarber
            });
        } catch (error) {
            next(error);
        }
    }

    async deactivateBarber(req, res, next){
        try {
            const id = Number(req.params.id);
            const deactivatedBarber= await BarberService.deactivateBarber(id);
            sendResponse(res, {
                message: 'Barber deactivated successfully',
                data: deactivatedBarber
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BarberController();