import ApiManager from "../../services/ApiManager";

const suggestionName = {
  originCountry: "PORT_LOADING",
  portOfLoading: "PORT",
};

export const GetAutoCompleteDataWithCountry = async (
  suggestionKey,
  inputId,
  dataLabel,
  searchText
) => {
  const apiKey = suggestionName[inputId];
  try {
    const response = await ApiManager.fetchAutoCompleteData(searchText, apiKey);
    const data = await response.body;
    return data.map((item) => ({
      label: `${item.country} - ${item.port_name}`,
      value: item.id,
      fullData: item,
    }));
  } catch (error) {
    return [];
  }
};
