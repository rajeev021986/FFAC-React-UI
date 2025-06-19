import ApiManager from "../../services/ApiManager";

const suggestionName = {
  countryId: "PORT_COUNTRY",
  country:"PORT_COUNTRY",
  chargeId: "CHARGE",
  currency: "CURRENCY",
  vesselId : "VESSEL",
  vessel: "VESSEL",
  lineName :"VENDOR",
  lineId: "VENDOR",
  shippingLine: "SHIPPER",
  companyCode: "COMPANY",
  customerName: "CUSTOMER",
  supplierName: "SHIPPER",
  supplierId:"SHIPPER",
  consigneeName: "CONSIGNEE",
  consigneeId:"CONSIGNEE",
  shippingLine: "VENDOR_TYPE",
  loadingVoyage: "VESSEL_VOYAGE",
  dischargeVoyage: "VESSEL_VOYAGE",
  vesselAgent: "VENDOR_TYPE",
  vesselAgentId: "VENDOR_TYPE",

  originCountry: "PORT_COUNTRY",
  portOfLoading: "PORT",
  portOfDischarge: "PORT",
  portOfDischargeId:"PORT",
  placeOfDelivery: "PORT",
  placeOfDeliveryId:"PORT",
  clerkName: "USER",
  clerkId: "USER",

  transporter: "VENDOR_TYPE",
  transporterId:"VENDOR_TYPE",
  regionId: "PORT_REGION",
  jobNo: "JOB_ENTRY",
  vendorName: "VENDOR",
  bankName: "BANK",
  bankId:"BANK",
  directIncome: "CHARGE",
  directExpense: "CHARGE",
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
