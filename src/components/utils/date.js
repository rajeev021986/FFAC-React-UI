

export const appDateFormat = (date) =>{
    // format date as YYYY-MM-DD
    if (!date) return '';
    const dateObj = new Date(date);
    if(isNaN(dateObj.getTime())){
        return '';
    }
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
}

export const DATE_FORMAT = 'MM/DD/YYYY';