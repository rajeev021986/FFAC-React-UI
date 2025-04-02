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

const jobEntrySlice = createSlice({
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
    jobEntrySetView: (state, action) => {
      state.view = action.payload;
    },
    jobEntrySetSortModel: (state, action) => {
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
  jobEntrySetView,
  jobEntrySetSortModel,
  updateInput,
  setPagination,
  setView,
  setSortBy,
  setSortModel,
} = jobEntrySlice.actions;
export default jobEntrySlice.reducer;
