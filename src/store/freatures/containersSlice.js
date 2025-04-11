import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    containerNo: "",
    sizeType: "",
    sealNo: "",
    truckTrailerNo: "",
  },
  sortBy: "",
};

const containerSlice = createSlice({
  name: "containerSlice",
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
    containerView: (state, action) => {
      state.view = action.payload;
    },
    containerSetSortModel: (state, action) => {
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
  containerView,
  containerSetSortModel,
  setPagination,
  setSortBy,
} = containerSlice.actions;
export default containerSlice.reducer;
