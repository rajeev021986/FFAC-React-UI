import ApiManager from "../../services/ApiManager";

const suggestionName = {
  country: "PORT_COUNTRY",
  chargeName: "CHARGE",
  currency: "CURRENCY",
  vesselName: "VESSEL",
  vessel: "VESSEL",
  lineName: "VENDOR",
  shippingLine: "SHIPPER",
  companyCode: "COMPANY",
  customerName: "CUSTOMER",
  supplierName: "SHIPPER",
  consigneeName: "CONSIGNEE",
  shippingLine: "LINE",
  loadingVoyage: "VESSEL_VOYAGE",
  dischargeVoyage: "VESSEL_VOYAGE",
  vesselAgent: "LINE",
  originCountry: "PORT_COUNTRY",
  portOfLoading: "PORT_LOADING",
  portOfDischarge: "PORT",
  placeOfDelivery: "PORT",
};

export const GetAutoCompleteData = async (dataKey, inputId, dataLabel) => {
  inputId = suggestionName[inputId];
  console.log(dataKey, inputId, dataLabel, "keyprops");
  try {
    const response = await ApiManager.fetchAutoCompleteData("", inputId);
    const data = await response.body;
    let uniqueSuggestions = [];
    console.log(data, "data");
    uniqueSuggestions = data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t[dataKey] === value[dataKey])
    );
    console.log(uniqueSuggestions, "manish");

    uniqueSuggestions = uniqueSuggestions.map((item) => {
      return { label: item[dataLabel], value: item[dataKey] };
    });

    return uniqueSuggestions;
  } catch (error) {
    return [];
  }
};
