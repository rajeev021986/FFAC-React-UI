


export const makeCapitalized = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const optionFormatter = (options,type=String,valueKey,labelKey) => {
    if(!options || options.length === 0) return [];
    if(type === String){
        return options.map((option) => ({
            value: option,
            label: makeCapitalized(option),
        }));
    }else{ // object with value, label
        return options.map((option) => ({
            value: option[valueKey],
            label: option[labelKey],
        }));
    }
}

export const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};