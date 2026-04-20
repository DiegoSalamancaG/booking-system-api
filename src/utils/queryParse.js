const parseBoolean = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
}

const parseNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
}

module.exports = {
    parseBoolean,
    parseNumber
};