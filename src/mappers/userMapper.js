class UserMapper {
    toResponse(user) {
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
        return users.map( user => this.toResponse(user))
    }
}

module.exports = new UserMapper();