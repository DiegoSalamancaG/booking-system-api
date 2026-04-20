class BarberMapper{
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
            }: null
        }
    }

    toResponseList(barbers){
        if(!Array.isArray(barbers)) return [];
        return barbers.map(barber => this.toResponse(barber));
    }
}

module.exports = new BarberMapper();