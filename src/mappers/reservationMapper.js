class ReservationMapper {
    toResponse(reservation){
        if(!reservation) return null;

        const startTime= reservation.startTime;
        const endTime = reservation.endTime;

        return {
            reservationId: reservation.id,
            startTimeUTC: startTime,
            endTimeUTC: endTime,
            starTimeLocal: startTime.toLocaleString("en-CL", { timeZone: "America/Santiago" }),
            endTimeLocal: endTime.toLocaleString("en-CL", { timeZone: "America/Santiago" }),
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
            priceAtBooking: reservation.priceAtBooking,
            createdAt: reservation.createdAt,
        }
    }

    toResponseList(reservations){
        if(!Array.isArray(reservations)) return [];
        return reservations.map(reservation => this.toResponse(reservation));
    }
}

module.exports = new ReservationMapper();