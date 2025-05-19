import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    id: "",
    value: "",
  },
  sortBy: "",
};

const vatAndHoldingTaxSlice = createSlice({
  name: "vatAndHolding",
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
    vatAndHoldingSetView: (state, action) => {
      state.view = action.payload;
    },
    vatAndHoldingSetSortModel: (state, action) => {
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
  vatAndHoldingSetView,
  vatAndHoldingSetSortModel,
  updateInput,
  setPagination,
  setView,
  setSortBy,
  setSortModel,
} = vatAndHoldingTaxSlice.actions;
export default vatAndHoldingTaxSlice.reducer;
