const { ReservationStatus } = require("@prisma/client");
const ReservationService = require("../services/reservationService");
const { sendResponse }  = require("../utils/responseHandler");

class ReservationController {

    async createReservation(req, res, next){
        try {
            const reservation = await ReservationService.createReservation(req.body);
            console.log("Created reservation:", reservation);
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
                data: reservations.data,
                meta: reservations.meta
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
            const id  = Number(req.params.id);
            const reservation = await ReservationService.updateReservation(id, req.body);
            sendResponse(res, {
                statusCode: 200,
                message: 'Reservation updated successfully',
                data: reservation
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelReservation(req, res, next) {
        try {
            const id = Number(req.params.id);
            const reservation = await ReservationService.cancelReservation(id);
            sendResponse(res, {
                message: 'Reservation cancelled successfully',
                data: reservation
            })
        } catch (error) {
            next(error);
        }
    }

    async completeReservation(req, res, next){
        try {
            const id = Number(req.params.id);
            const reservation = await ReservationService.completeReservation(id);
            sendResponse(res, {
                message: 'Reservation completed successfully',
                data: reservation
            })
        } catch (error) {
            next(error);
        }
    }

} 
module.exports = new ReservationController();