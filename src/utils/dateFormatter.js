const formatDateToCl = (date) => {
    if (!date) return null;

    return new Intl.DateTimeFormat('es-CL', {
        timeZone:"America/Santiago",
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(new Date(date));
}

module.exports = {
    formatDateToCl
}
