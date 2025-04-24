import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    jobNo: "",
    currency: "",
    invoiceType: "",
    vendorName: "",
    exchangeRate: "",
    payableRefNo: "",
    vendorInvoiceNo: "",
    statusCode: "",
    isDoc: "",
  },
  sortBy: "",
};

const payableEntrySlice = createSlice({
  name: "jobEntries",
  initialState,
  reducers: {
    toggleFilter: (state, action) => {
      const { category, value } = action.payload;
      const currentValues = state[category];
      const isSelected = currentValues.includes(value);
      state[category] = isSelected
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
    },
    updateInput: (state, action) => {
      state.formData = action.payload;
    },
    payableDashboardView: (state, action) => {
      state.view = action.payload;
    },
    payableSetSortModal: (state, action) => {
      state.sortModel = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    formView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const {
  toggleFilter,
  updateInput,
  payableDashboardView,
  payableSetSortModal,
  setPagination,
  formView,
} = payableEntrySlice.actions;
export default payableEntrySlice.reducer;
