const prisma = require("../config/prisma");

const BarberRepository = require("../repositories/barberRepository");
const UserRepository = require("../repositories/userRepository");
const UserService = require("../services/userServices");
const logger = require("../config/logger");

const BarberMapper = require("../mappers/barberMapper");

const { ValidationError, NotFoundError } = require('../errors/TypesError');
const { barberCreateSchema, barberUpdateSchema } = require("../schemas/barberSchema");

class BarberService {

    async createBarber(barberData, user) {
        const userId = user?.id || null;

        const validation = barberCreateSchema.safeParse(barberData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const { fullName, email, password, experienceYears, bio } = validation.data;

        const barber = await prisma.$transaction(async (tx) => {

            const newUser = await UserService.createUserInternal({
                fullName,
                email,
                password,
                role: 'BARBER',
                createdBy: userId
            }, tx);

            const existingBarber = await BarberRepository.getBarberByUserId(newUser.id, tx);
            if (existingBarber) {
                throw new ValidationError('Barber already exists for this user');
            }

            const newBarber = await BarberRepository.createBarber({
                userId: newUser.id,
                experienceYears,
                bio,
                createdBy: userId
            }, tx);

            logger.info(`Barber created: id ${newUser.id} | name: ${newUser.fullName} | Added By ${userId}`)
            return newBarber;
        });

        return BarberMapper.toResponse(barber);
    }

    async getAllBarbers(query) {
        const { page, limit, ...filters} = query;
        const barbers = await BarberRepository.getAllBarbers(filters, { page, limit});
        return {
            data: BarberMapper.toResponseList(barbers.data),
            meta: barbers.meta
        };
    }

    async getBarberByUserId(userId) {
        const id = Number(userId);

        if (isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const barber = await BarberRepository.getBarberByUserId(id);

        if (!barber) {
            throw new NotFoundError('Barber not found');
        }

        return BarberMapper.toResponse(barber);
    }

    async updateBarber(userId, updateData, user) {
        const creatorId = user?.id || null;

        const id = Number(userId);
        if (isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const validation = barberUpdateSchema.safeParse(updateData);
        if (!validation.success) {
            throw new ValidationError(validation.error.issues[0].message);
        }

        const { fullName, experienceYears, bio } = validation.data;

        const updatedBarber = await prisma.$transaction(async (tx) => {

            const existingBarber = await BarberRepository.getBarberByUserId(id, tx);
            if (!existingBarber) {
                throw new NotFoundError('Barber not found');
            }
            
            if (fullName !== undefined) {
                await UserRepository.updateUser(id, { fullName }, tx);
            }

            const barber = await BarberRepository.updateBarber(id, {
                ...(experienceYears !== undefined && { experienceYears }),
                ...(bio !== undefined && { bio }),
                updatedBy:creatorId
            }, tx);

            logger.info(`barber Updated: Id ${barber.id} | name: ${barber.fullName} | UpdatedBy: ${creatorId}`)
            return barber;
        });

        return BarberMapper.toResponse(updatedBarber);
    }

    async deactivateBarber(userId) {

        const id = Number(userId);
        if (isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const deactivatedBarber = await BarberRepository.deactivateBarber(id);
        if (!deactivatedBarber) {
            throw new NotFoundError('Barber not found');
        }

        logger.warn(`barber Deactivated: Id ${id} | name: ${deactivatedBarber.fullName}`)
        return BarberMapper.toResponse(deactivatedBarber);
    }

}

module.exports = new BarberService();