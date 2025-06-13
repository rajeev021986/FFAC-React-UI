import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    jobNo: "",
    currency: "",
    customerName: "",
    exchangeRate: "",
    receivableRefNo: "",
    vendorInvoiceNo: "",
    consigneeName: "",
    statusCode: "",
    isDoc: "",
  },
  sortBy: "",
};

const receivableEntrySlice = createSlice({
  name: "receivableEntrySlice",
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
    receivableEntryView: (state, action) => {
      state.view = action.payload;
    },
    receivableEntrySetSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  toggleFilter,
  updateInput,
  receivableEntryView,
  receivableEntrySetSortModel,
  setPagination,
  setSortBy,
} = receivableEntrySlice.actions;
export default receivableEntrySlice.reducer;
