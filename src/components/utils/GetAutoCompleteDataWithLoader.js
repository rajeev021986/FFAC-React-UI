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
  originCountry: "PORT_LOADING",
  portOfLoading: "PORT_LOADING",
  portOfDischarge: "PORT",
  placeOfDelivery: "PORT",
  bond_number: "BOND",
  region: "PORT_REGION",
  jobNo: "JOB_ENTRY",
  vendorName: "VENDOR",
  unitType: "JOB_CONTAINER",
  noOfUnit: "JOB_CONTAINER",
  exchangeRate: "EXCHANGE_RATE",
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
      .map((item) => ({
        label: item[dataLabel],
        value: item[dataKey],
        fullData: item,
      }));

    return uniqueSuggestions;
  } catch (error) {
    return [];
  }
};
