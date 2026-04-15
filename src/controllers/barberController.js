const BarberService = require("../services/barberService");
const { sendResponse }  = require("../utils/responseHandler");

class BarberController {

    async createBarber(req, res, next){
        try {
            const barber = await BarberService.createBarber(req.body);
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
            const barbers = await BarberService.getAllBarbers();
            sendResponse(res,{
                message: 'List of barbers',
                data: barbers,
                meta: {
                    quantity: barbers.length
                }
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
            const updatedBarber = await BarberService.updateBarber(id, req.body);
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
            await BarberService.deactivateBarber(id);
            sendResponse(res, {
                message: 'Barber deactivated successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BarberController();