class ServicesMapper {
    toResponse(service){
        if(!service)
            return null;
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
        if(!Array.isArray(services)) return [];
        return services.map(service => this.toResponse(service));
    }
}

module.exports = new ServicesMapper();