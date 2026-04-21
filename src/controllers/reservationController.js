const { ReservationStatus } = require("@prisma/client");
const ReservationService = require("../services/reservationService");
const { sendResponse }  = require("../utils/responseHandler");

class ReservationController {

    async createReservation(req, res, next){
        try {
            const reservation = await ReservationService.createReservation(req.body);
            sendResponse(res, {
                statusCode: 201,
                message: 'Reservation created successfully',
                data: reservation
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllReservations(req, res, next){
        try {
            const reservations = await ReservationService.getAllReservations(req.query);
            sendResponse(res,{
                statusCode: 200,
                message: 'Reservations retrieved successfully',
                data: reservations,
                meta: {
                    quantity: reservations.length
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getReservationById(req, res, next){
        try {
            const id = Number(req.params.id);
            const reservation = await ReservationService.getReservationById(id);
            sendResponse(res, {
                statusCode: 200,
                message: 'Reservation retrieved successfully',
                data: reservation
            });
        } catch (error) {
            next(error);
        }
    }   

    async updateReservation(req, res, next){
        try {
            const reservation = await ReservationController.updateReservation(req.params.id, req.body);
            sendResponse(res, {
                statusCode: 200,
                message: 'Reservation updated successfully',
                data: reservation
            });
        } catch (error) {
            next(error);
        }
    }

} 
module.exports = new ReservationController();