import ApiManager from "../services/ApiManager";

export const downloadExcel = async ({ query, payload, service, page, filename }) => {
  try {
    const blob = await ApiManager.fetchDatasExcel({ query, payload, service, page });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading Excel file:", error);
  }
};
