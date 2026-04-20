const prisma = require("../config/prisma");
const UserRepository = require("../repositories/userRepository");
const BarberRepository = require("../repositories/barberRepository");
const BarberMapper = require("../mappers/barberMapper");
const UserService = require("../services/userServices");
const { ValidationError, NotFoundError } = require('../errors/TypesError');
const { barberCreateSchema, barberUpdateSchema } = require("../validators/barberSchema");

class BarberService {

    async createBarber(barberdata) {
        const validation = barberCreateSchema.safeParse(barberdata);
        if (!validation.success) {
            throw new ValidationError(validation.error.errors[0].message);
        }

        const { fullName, email, password, experienceYears, bio, role } = validation.data;
        
        //creamos el usuario primero
        const barber = await prisma.$transaction(async (tx) => {
            const newUser = await UserService.createUserInternal({
                fullName,
                email,
                password,
                role: 'BARBER',
                status: 'ACTIVE'
            }, tx);

            const existingBarber = await tx.barber.findUnique({
                where: { userId: newUser.id }
            });
            if (existingBarber) {
                throw new ValidationError('Barber already exists for this user');
            }

            //creamos el barbero asociado al usuario
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
        return BarberMapper.toResponseList(barbers);
    }

    async getBarberById(userId) {
        const id = Number(userId);
        if (isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }

        const barber = await BarberRepository.getBarberById(id);

        if (!barber) {
            throw new NotFoundError('Barber not found');
        }

        return BarberMapper.toResponse(barber);
    }

    async updateBarber(userId, updateData){
        const id = Number(userId);
        if (isNaN(id)) {
            throw new ValidationError('Invalid ID');
        }
        const validation = barberUpdateSchema.safeParse(updateData);
        if (!validation.success) {
            throw new ValidationError(validation.error.errors[0].message);
        }
        
        const { fullName, experienceYears, bio } = validation.data;

        return await prisma.$transaction(async (tx)=>{
            const existingBarber = await tx.barber.findUnique({
                where: { userId: id },
            });
            if (!existingBarber) {
                throw new NotFoundError('Barber not found');
            }

            // Actualizar campos específicos del usuario
            if(fullName){
                await tx.user.update({
                    where: { id: id },
                    data: {
                        ...(fullName !== undefined && { fullName })
                    }
                });
            }
            // Actualizar campos específicos del barbero
            const updatedBarber = await tx.barber.update({
                where: { userId: id },
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