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
  shippingLine: "VENDOR_TYPE",
  loadingVoyage: "VESSEL_VOYAGE",
  dischargeVoyage: "VESSEL_VOYAGE",
  vesselAgent: "VENDOR_TYPE",
  originCountry: "PORT_COUNTRY",
  portOfLoading: "PORT",
  portOfDischarge: "PORT",
  placeOfDelivery: "PORT",
  clerkName: "USER",
};

export const GetAutoCompleteData = async (dataKey, inputId, dataLabel) => {
  inputId = suggestionName[inputId];
  try {
    const response = await ApiManager.fetchAutoCompleteData("", inputId);
    const data = await response.body;
    let uniqueSuggestions = [];
    uniqueSuggestions = data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t[dataKey] === value[dataKey])
    );
    uniqueSuggestions = uniqueSuggestions.map((item) => {
      return { label: item[dataLabel], value: item[dataKey], fullData: item };
    });

    return uniqueSuggestions;
  } catch (error) {
    return [];
  }
};
