const prisma = require("../config/prisma");
const UserRepository = require("../repositories/userRepository");
const BarberRepository = require("../repositories/barberRepository");
const BarberMapper = require("../mappers/barberMapper");
const UserService = require("../services/userServices");
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const barberMapper = require("../mappers/barberMapper");
const barberRepository = require("../repositories/barberRepository");

class BarberService {

    async createBarber(barberdata) {
        const { fullName, email, password, role, experienceYears, bio } = barberdata;
        console.log("Received barber data:", barberdata);
        if(!fullName || !email || !password){
            throw new ValidationError("Missing user required fields");
        }
        if(!experienceYears || !bio){
            throw new ValidationError("Missing barber required fields");
        }

        // Crear usuario primero
        const barber = await prisma.$transaction(async (tx) => {
            const newUser = await UserService.createUserInternal({
                fullName,
                email,
                password,
                role: role || 'BARBER',
                status: 'active'
            }, tx);

            const existingBarber = await tx.barber.findUnique({
                where: { userId: newUser.id }
            });
            if (existingBarber) {
                throw new ValidationError('Barber already exists for this user');
            }

            const newBarber = await tx.barber.create({
                data: {
                    userId: newUser.id,
                    experienceYears,
                    bio
                },
                include : { user: true}
            })
            return newBarber;
        })
        return BarberMapper.toResponse(barber);
    }

    async getAllBarbers() {
        const barbers = await BarberRepository.getAllBarbers();
        if(barbers.length === 0){
            throw new NotFoundError('No barbers found');
        }
        return BarberMapper.toResponseList(barbers);
    }

    async getBarberById(userId) {
        if (!userId || isNaN(userId)) {
            throw new ValidationError('Invalid ID');
        }

        const barber = await BarberRepository.getBarberById(userId);

        if (!barber) {
            throw new NotFoundError('Barber not found');
        }

        return BarberMapper.toResponse(barber);
    }

    async updateBarber(userId, updateData){
        const {fullName, experienceYears, bio} = updateData;
        if (!userId || isNaN(userId)) {
            throw new ValidationError('Invalid ID');
        }

        return await prisma.$transaction(async (tx)=>{
            const existingBarber = await tx.barber.findUnique({
                where: { userId },
            });
            if (!existingBarber) {
                throw new NotFoundError('Barber not found');
            }

            // Actualizar campos específicos del usuario
            if(fullName){
                await tx.user.update({
                    where: { id:userId},
                    data: {
                        ...(fullName !== undefined && { fullName })
                    }
                });
            }
            // Actualizar campos específicos del barbero
            const updatedBarber = await tx.barber.update({
                where: { userId },
                data:{
                    ...(experienceYears !== undefined && { experienceYears }),
                    ...(bio !== undefined && { bio })
                },
                include: { user: true }
            })
            return BarberMapper.toResponse(updatedBarber);
        })
    }

    async deactivateBarber(userId){
        if (!userId || isNaN(userId)) {
            throw new ValidationError('Invalid ID');
        }
        const deactivatedBarber = await BarberRepository.deactivateBarber(userId);
        if (!deactivatedBarber) {
            throw new NotFoundError('Barber not found');
        }

        return BarberMapper.toResponse(deactivatedBarber);
    }



}

module.exports = new BarberService();