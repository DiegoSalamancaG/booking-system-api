const prisma = require('../config/prisma');

const ReservationRepository =require("../repositories/reservationRepository");
const UserRepository = require("../repositories/userRepository");
const BarberRepository = require("../repositories/barberRepository");
const ServiceRepository = require("../repositories/servicesRepository");

const { ValidationError, NotFoundError } = require("../errors/TypesError");
const ReservationMapper = require("../mappers/reservationMapper");
const { reservationSchema, reservationUpdateSchema } = require("../schemas/reservationSchema");

class ReservationService {

    async createReservation(reservationData) {
        const validation = reservationSchema.safeParse(reservationData);
        if (!validation.success) {
            console.log(validation.error.issues);
            throw new ValidationError(validation.error.issues[0].message);
        }
        
        const { clientId, serviceId, barberId, startTime, notes } = validation.data;

        return await prisma.$transaction(async (tx) => {
            
            // Validar Service
            const service = await ServiceRepository.getServiceById(serviceId,tx);
            if(!service || service.isActive === false){
                throw new NotFoundError("Service not found or unavailable");
            }

            // Validar Barber
            const barber = await BarberRepository.getBarberById(barberId,tx);
            if(!barber || barber.user.status !== "ACTIVE"){
                throw new NotFoundError("Barber not found or unavailable");
            }

            // Validar Client
            const client = await UserRepository.getUserById(clientId,tx);
            if(!client || client.status !== "ACTIVE"){
                throw new NotFoundError("Client not found or unavailable");
            }

            // Validar horário
            const start = new Date(startTime);
            if(isNaN(start.getTime())){
                throw new ValidationError("Invalid start time format");
            }
            if(start < new Date()){
                throw new ValidationError("Start time must be posterior to the current time");
            }
            const end = new Date(start.getTime() + service.durationMinutes * 60000);

            // Verificar reserva sobrepuesta
            const overlapping = await ReservationRepository.findOverlapping(barberId, start, end, tx);
            if (overlapping) {
                throw new ValidationError("Barber is not available at the selected time");
            }

            const reservation = await ReservationRepository.createReservation({
                barberId,
                clientId,
                serviceId,
                startTime: start,
                endTime: end,
                durationMinutes: service.durationMinutes,
                priceAtBooking: service.price,
                notes: notes || null,
                status: 'SCHEDULED'
            }, tx);
            return ReservationMapper.toResponse(reservation);
        })

    }

    async getAllReservations(query){
        const { page, limit, ...filters } = query;
        const reservations = await ReservationRepository.getAllReservations(filters, { page, limit });
        return  {
            data: ReservationMapper.toResponseList(reservations.data),
            meta: reservations.meta
        }
    }

    async getReservationById(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid reservation ID");
        }

        const reservation = await ReservationRepository.getReservationById(id);
        if(!reservation){
            throw new NotFoundError("Reservation not found");
        }
        return ReservationMapper.toResponse(reservation);
    }

    async updateReservation(id, reservationData) {
    if (!id || isNaN(id)) {
        throw new ValidationError("Invalid reservation ID");
    }
        return await prisma.$transaction(async (tx) => {
            const validation = reservationUpdateSchema.safeParse(reservationData);
            if (!validation.success) {
                throw new ValidationError(validation.error.issues[0].message);
            }

            const data = validation.data;

            const reservation = await ReservationRepository.getReservationById(id, tx);
            if (!reservation) {
                throw new NotFoundError("Reservation not found");
            }

            if (["CANCELLED", "COMPLETED"].includes(reservation.status)) {
                throw new ValidationError(
                    `Cannot update a reservation with status ${reservation.status}`
                );
            }

            // servicio final
            const finalServiceId = data.serviceId || reservation.serviceId;

            const service = await ServiceRepository.getServiceById(finalServiceId, tx);
            if (!service || !service.isActive) {
                throw new ValidationError("Service not available");
            }

            // startTime
            let start = reservation.startTime;

            if (data.startTime) {
                start = data.startTime;

                if (start < new Date()) {
                    throw new ValidationError("Start time must be in the future");
                }
            }

            // endTime
            const end = new Date(
                start.getTime() + service.durationMinutes * 60000
            );

            // Overlapping
            const overlapping = await ReservationRepository.findOverlapping(
                reservation.barberId,
                start,
                end,
                tx,
                id
            );

            if (overlapping) {
                throw new ValidationError("Barber is not available at this time");
            }

            const dataToUpdate = {
                startTime: start,
                endTime: end,
                serviceId: finalServiceId,
                priceAtBooking: service.price
            };

            if (data.status) {
                dataToUpdate.status = data.status;
            }

            if (data.notes !== undefined) {
                dataToUpdate.notes = data.notes;
            }

            const updated = await ReservationRepository.updateReservation(
                id,
                dataToUpdate,
                tx
            );
            return ReservationMapper.toResponse(updated);
        });
    }

    async completeReservation(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid reservation ID");
        }

        const reservation = await ReservationRepository.getReservationById(id);
        if(!reservation){
            throw new NotFoundError("Reservation not found");
        }

        if(reservation.status !== "SCHEDULED"){
            throw new ValidationError(`Only reservations with status SCHEDULED can be completed. Current status: ${reservation.status}`);
        }
        if(reservation.status === "COMPLETED"){
            throw new ValidationError("Reservation is already completed");
        }
        if(reservation.endTime > new Date()){
            throw new ValidationError("Cannot complete a reservation before its end time");
        }

        const completed = await ReservationRepository.completeReservation(id);
        return ReservationMapper.toResponse(completed);
    }

    async cancelReservation(id){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid reservation ID");
        }

        const reservation = await ReservationRepository.getReservationById(id);
        if(!reservation){
            throw new NotFoundError("Reservation not found");
        }

        if(reservation.status === "CANCELLED"){
            throw new ValidationError("Reservation is already cancelled");
        }
        if(reservation.status === "COMPLETED"){
            throw new ValidationError("Completed reservations cannot be cancelled");
        }

        const cancelled = await ReservationRepository.cancelReservation(id);
        return ReservationMapper.toResponse(cancelled);
    }


}

module.exports = new ReservationService();