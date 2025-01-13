import ApiManager from "../../services/ApiManager";

const suggestionName = {
    country: "PORT_COUNTRY",
    chargeName: "CHARGE",
    currency: "CURRENCY",
    vesselName: "VESSEL",
    vessel: "VESSEL",
    lineName: "VENDOR",
    shippingLine: "SHIPPER",
};

export const GetAutoCompleteData = async (inputValue, inputId) => {
    inputId = suggestionName[inputId];
    if (!inputValue) return [];

    try {
        const response = await ApiManager.fetchAutoCompleteData(
            inputValue,
            inputId
        );
        const data = await response.body;

        const uniqueSuggestions = data.reduce((acc, item) => {
            const exists = acc.some((entry) => entry.country === item.country);
            if (!exists) acc.push(item);
            return acc;
        }, []);

        return uniqueSuggestions;
    } catch (error) {
        return [];
    }
};