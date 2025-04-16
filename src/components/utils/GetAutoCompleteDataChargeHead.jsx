
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
  bond_number:"BOND",
};

export const GetAutoCompleteDataChargeHead = async (
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
   const formattedData = data.map((item) => ({
    label: item.charge_name,           // what user sees
    value: item.charge_name,           // what you POST to Formik's `chargeHead`
    fullData: item,                    // full backend object (not just first index)
  }));
      return formattedData;
    } catch (error) {
      return [];
    }
  };