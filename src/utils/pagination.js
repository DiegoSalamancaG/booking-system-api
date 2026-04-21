const { ta } = require("zod/locales");

const getPagination = (query = {}) => {

    let { page = 1, limit= 10 } = query;

    page = Number(page);
    limit = Number(limit);

    // Validaciones
    if( isNaN(page) || page < 1 ) page = 1;
    if( isNaN(limit) || limit < 1 ) limit = 10;
    if( limit > 50 ) limit = 50;

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
        take: limit
    }
}

const buildPaginationMeta = (total, page, limit) => {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    }
}

module.exports = {
    getPagination,
    buildPaginationMeta
}