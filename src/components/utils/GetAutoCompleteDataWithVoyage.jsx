
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
  loadingVoyage: "VOYAGE",
  dischargeVoyage: "VOYAGE",
  dischargingVessel : "VESSEL_VOYAGE",
  loadingVessel : "VESSEL_VOYAGE",
  vesselAgent: "LINE",
  originCountry: "PORT_LOADING",
  portOfLoading: "PORT_LOADING",
  portOfDischarge: "PORT",
  placeOfDelivery: "PORT",
};

export const GetAutoCompleteDataWithVoyage = async (
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
    console.log("data in repsonse",data);
    let formattedData = data.map((item) => ({
      label: `${item.vessel} - ${item.voyage}`, // Show vessel and voyage together
      value: item.id, // Use a unique identifier (like ID)
      fullData: item, // Store full data object
    }));
  
      return formattedData;
    
}
     catch (error) {
      return [];
    }
  };