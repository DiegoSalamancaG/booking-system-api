class ReservationMapper {
    toResponse(reservation){
        if(!reservation) return null;
        return {
            reservationId: reservation.id,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            status: reservation.status,
            client: {
                id: reservation.client.id,
                name: reservation.client.fullName,
                },
            barber: {
                id: reservation.barber.userId,
                name: reservation.barber.user.fullName,
                },
            service:{
                id: reservation.service.id,                
                name: reservation.service.name
                },
            notes: reservation.notes,
            createdAt: reservation.createdAt,
        }
    }

    toResponseList(reservations){
        if(!Array.isArray(reservations)) return [];
        return reservations.map(reservation => this.toResponse(reservation));
    }
}

module.exports = new ReservationMapper();