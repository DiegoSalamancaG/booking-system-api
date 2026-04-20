class UserMapper {
    toResponse(user) {
        if(!user) return null;
        return{
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    toResponseList(users){
        if(!Array.isArray(users)) return [];
        return users.map( user => this.toResponse(user))
    }
}

module.exports = new UserMapper();