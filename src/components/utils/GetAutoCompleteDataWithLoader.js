
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

export const GetAutoCompleteDataWithLoader = async (
    dataKey,
    inputId,
    dataLabel,
    searchText
  ) => {
    inputId = suggestionName[inputId];
    try {
      const response = await ApiManager.fetchAutoCompleteData(
        searchText,
        inputId
      );
      const data = await response.body;
  
      let uniqueSuggestions = data
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t[dataKey] === value[dataKey])
        )
        .map((item) => ({ label: item[dataLabel], value: item[dataKey] }));
  
      return uniqueSuggestions;
    } catch (error) {
      return [];
    }
  };