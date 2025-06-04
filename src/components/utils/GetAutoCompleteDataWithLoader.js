import ApiManager from "../../services/ApiManager";

const suggestionName = {
  country: "PORT_COUNTRY",
  chargeName: "CHARGE",
  chargeId: "CHARGE",

  currency: "CURRENCY",
  vesselName: "VESSEL",
  vessel: "VESSEL",
  lineName: "VENDOR",
  shippingLine: "SHIPPER",
  companyCode: "COMPANY",
  customerName: "CUSTOMER",
  customerId: "CUSTOMER",
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
  jobNoId: "JOB_ENTRY",
  vendorName: "VENDOR",
  vendorId: "VENDOR",
  unitType: "JOB_CONTAINER",
  noOfUnit: "JOB_CONTAINER",
  exchangeRate: "EXCHANGE_RATE",
  exRate: "EXCHANGE_RATE",
  unitTypeReceviable: "CUSTOMER_TARIFF",
};

export const GetAutoCompleteDataWithLoader = async (
  dataKey,
  inputId,
  dataLabel,
  searchText,
  other
) => {
  inputId = suggestionName[inputId];
  try {
    const response = await ApiManager.fetchAutoCompleteData(
      searchText,
      inputId,
      other || ""
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
