import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    customerName: "",
    customerRefNo: "",
    entryNo: "",
    mblNo: "",
    tansadNo: "",
    invoiceNo: "",
    hblNo: "",
    statusCode: "",
    isDoc: "",
  },
  sortBy: "",
};

const LooseCargoSlice = createSlice({
  name: "LooseCargoSlice",
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
    looseCargoView: (state, action) => {
      state.view = action.payload;
    },
    looseCargoSetSortModel: (state, action) => {
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
  looseCargoView,
  looseCargoSetSortModel,
  setPagination,
  setSortBy,
} = LooseCargoSlice.actions;
export default LooseCargoSlice.reducer;
