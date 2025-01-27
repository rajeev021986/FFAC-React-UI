import ApiManager from "../../services/ApiManager";

const suggestionName = {
    country: "PORT_COUNTRY",
    chargeName: "CHARGE",
    currency: "CURRENCY",
    vesselName: "VESSEL",
    vessel: "VESSEL",
    lineName: "VENDOR",
    shippingLine: "SHIPPER",
    companyCode: "COMPANY"
};

export const GetAutoCompleteData = async (dataKey, inputId, dataLabel) => {

    inputId = suggestionName[inputId];

    try {
        const response = await ApiManager.fetchAutoCompleteData(
            "",
            inputId
        );
        const data = await response.body;
        let uniqueSuggestions = [];

        uniqueSuggestions = data.filter((value, index, self) =>
            index === self.findIndex((t) => t[dataKey] === value[dataKey])
        );


        uniqueSuggestions = uniqueSuggestions.map((item) => {
            return { label: item[dataLabel], value: item[dataKey] }
        })


        return uniqueSuggestions;
    } catch (error) {
        return [];
    }
};