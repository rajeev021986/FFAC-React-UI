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

export const GetAutoCompleteData = async (dataKey, inputId) => {
    inputId = suggestionName[inputId];

    try {
        const response = await ApiManager.fetchAutoCompleteData(
            "",
            inputId
        );
        const data = await response.body;

        const uniqueSuggestions = [...new Set(data.map((obj) => obj[dataKey]))];

        return uniqueSuggestions;
    } catch (error) {
        return [];
    }
};