const sendResponse = (res, { 
    statusCode=200,
    message="Success",
    data=null,
    meta=null}) => {
        const response = {
            message,
            data
        }
        if (meta) {
            response.meta = meta;
        }

        res.status(statusCode).json(response);
}

module.exports = {
    sendResponse
}