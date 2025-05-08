import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    vendorName: "",
    invoiceType: "",
    paybleRefNum: "",
    jobNo: "",
    customerName: "",
    vendorInvNo: "",
    totalAmount: "",
    currency: "",
  },
  sortBy: "",
};

const paymentApprovalSlice = createSlice({
  name: "paymentApproval",
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
    paymentApprovalView: (state, action) => {
      state.view = action.payload;
    },
    paymnetApprovalSetSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
  },
});

export const {
  toggleFilter,
  paymentApprovalView,
  paymnetApprovalSetSortModel,
  updateInput,
  setPagination,
  setView,
  setSortBy,
  setSortModel,
} = paymentApprovalSlice.actions;
export default paymentApprovalSlice.reducer;
