import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    receivablePartyName: "",
    receivablePartyId: "",
    currency: "",
    upTo: "",
    exchangeRate: "",
    recOutstandingAmount: "",
    date: "",
    recAmount: "",
    chargeType: "",
    charge: "",
    withHoldingTaxRecov: "",
    mode: "",
    bankName: "",
    chequeNo: "",
    chequeDate: "",
    recPayAmount: "",
    remarks: "",
    details: [
      {
        id: 0,
        refNo: "",
        receivableId: "",
        date: "",
        amount: "",
      },
    ],
  },
  sortBy: "",
};

const receiptsEntrySlice = createSlice({
  name: "receiptsEntrySlice",
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
    receiptsEntrySetView: (state, action) => {
      state.view = action.payload;
    },
    receiptsSetSortModel: (state, action) => {
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
  receiptsEntrySetView,
  receiptsEntrySetSortModel,
  updateInput,
  setPagination,
  setView,
  setSortBy,
  setSortModel,
} = receiptsEntrySlice.actions;
export default receiptsEntrySlice.reducer;
