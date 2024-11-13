
// @params - format , value
export const applyFormatting = (format, value) => {
    let numericValue = parseFloat(value);
    if (isNaN(numericValue)) return value;

    const options = {
        style: format.currency ? 'currency' : 'decimal',
        currency: format.currency ? (format.currencyOrigin === 'en-EU' ? 'EUR' : 'USD') : undefined,
        minimumFractionDigits: format.decimal ? (format.decimalPoint ? parseInt(format.decimalPoint) : 0) : 0,
        maximumFractionDigits: format.decimal ? (format.decimalPoint ? parseInt(format.decimalPoint) : 0) : 0,
        useGrouping: format.comma,
    };

    // Use `format.currencyOrigin` for locale (e.g., 'en-US' or 'en-E')
    const locale = format.currencyOrigin || 'en-US';

    return new Intl.NumberFormat(locale, options).format(numericValue);
};


export const revertToNumeric = (formattedValue) => {
    // Remove non-numeric characters except for the decimal point, minus sign, and comma
    const numericString = formattedValue
        .replace(/[^\d.-]/g, '') 
        .replace(/,/g, '');

    const numericValue = parseFloat(numericString);

    // Return NaN if not a valid number, or the parsed float
    return isNaN(numericValue) ? null : numericValue;
};