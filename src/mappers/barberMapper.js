class barberMapper{
    toResponse(barber){
        if (!barber) return null;
        return {
            userId: barber.userId,
            experienceYears: barber.experienceYears,
            bio: barber.bio,
            user: barber.user ? {
                id: barber.user.id,
                fullName: barber.user.fullName,
                email: barber.user.email,
                role: barber.user.role,
                status: barber.user.status
            } : null
        }
    }

    toResponseList(barbers){
        return barbers.map(barber => this.toResponse(barber));
    }
}
module.exports = new barberMapper();