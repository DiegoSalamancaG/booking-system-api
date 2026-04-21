const prisma = require('../config/prisma');

const ReservationRepository =require("../repositories/reservationRepository");
const UserRepository = require("../repositories/userRepository");
const BarberRepository = require("../repositories/barberRepository");
const ServiceRepository = require("../repositories/servicesRepository");

const { ValidationError, NotFoundError } = require("../errors/TypesError");
const ReservationMapper = require("../mappers/reservationMapper");
const { reservationSchema, reservationUpdateSchema } = require("../schemas/reservationSchema");
const { PrismaClientUnknownRequestError } = require('@prisma/client/runtime/client');

class ReservationService {

    async createReservation(reservationData) {
        console.log("Received reservation data:", reservationData);
        const validation = reservationSchema.safeParse(reservationData);
        if (!validation.success) {
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

    async getAllReservations(filter={}){
        const reservations = await ReservationRepository.getAllReservations(filter);
        return ReservationMapper.toResponseList(reservations);
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

    async updateReservation(id, reservationData){
        if(!id || isNaN(id)){
            throw new ValidationError("Invalid reservation ID");
        }

        return await prisma.$transaction(async (tx)=>{
            const validation = reservationUpdateSchema.safeParse(reservationData);
            if(!validation.success){
                throw new ValidationError(validation.error.issues[0].message);
            }

            const data = validation.data;
            const reservation = await ReservationRepository.getReservationById(id, tx);
            if(!reservation){
                throw new NotFoundError("Reservation not found");
            }

            //Validar estado
            if(["CANCELLED", "COMPLETED"].includes(reservation.status)){
                throw new ValidationError(`Cannot update a reservation with status ${reservation.status}`);
            }
            
            const dataToUpdate = {};

            if(data.startTime){
                const start = new Date(data.startTime);
                if(isNaN(start.getTime())){
                    throw new ValidationError("Invalid start time format");
                }
                if(start < new Date()){
                    throw new ValidationError("Start time must be posterior to the current time");
                }
                const end = new Date(
                    start.getTime() + reservation.service.durationMinutes * 60000
                )

                //Overlapping
                const overlapping = await ReservationRepository.findOverlapping(
                    reservation.barberId,
                    start,
                    end,
                    tx  
                );
                if(overlapping){
                    throw new ValidationError("Barber is not available at this time");
                }

                dataToUpdate.startTime = start;
                dataToUpdate.endTime = end;
            }

            if (data.status) {
                dataToUpdate.status = data.status;
            }
            if (data.notes !== undefined) {
                dataToUpdate.notes = data.notes;
            }
            const updated = await ReservationRepository.updateReservation(id, dataToUpdate, tx);
            return ReservationMapper.toResponse(updated)
        })
    }

}

module.exports = new ReservationService();