class ServicesMapper {
    toResponse(service){
        return {
            id: service.id,
            name: service.name,
            description: service.description,
            durationMinutes: service.durationMinutes,
            price: service.price,
            isActive: service.isActive
        }
    }

    toResponseList(services){
        return services.map(service => this.toResponse(service));
    }
}

module.exports = new ServicesMapper();