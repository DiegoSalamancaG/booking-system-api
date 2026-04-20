const prisma = require('../config/prisma');

const ReservationRepository =require("../repositories/reservationRepository");
const UserRepository = require("../repositories/userRepository");
const serviceRepository = require("../repositories/servicesRepository");

const { ValidationError, NotFoundError } = require("../errors/TypesError");
const { reservationMapper } = require("../mappers/reservationMapper");
const { reservationSchema, reservationUpdateSchema } = require("../schemas/reservationSchema");

class ReservationService {

    async createReservation(reservationData) {

        return await prisma.$transaction(async (tx) => {
            const validation = reservationSchema.safeParse(reservationData);
            if (!validation.success) {
                throw new ValidationError(validation.error.issues[0].message);
            }

            const { clientId, serviceId, barberId, reservationDate } = validation.data;

            const client = await UserRepository.getUserById(clientId);
            if(!client || client.role !== 'CLIENT' || client.status !== 'ACTIVE') {
                throw new ValidationError('Invalid client');
            }
            const barber = await UserRepository.getUserById(barberId);
            if(!barber || barber.role !== 'BARBER') {
                throw new ValidationError('Invalid barber');
            }
            const service = await serviceRepository.getServiceById(serviceId);
            if(!service) {
                throw new ValidationError('Invalid service');
            }

        });
    }


}