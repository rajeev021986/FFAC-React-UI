import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    chasisNo: "",
    engineType: "",
    driverCellNo: "",
    clerkName: "",
    clerkTelNo: "",
  },
  sortBy: "",
};

const vehicleSlice = createSlice({
  name: "vehicleSlice",
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
    vehicleView: (state, action) => {
      state.view = action.payload;
    },
    vehicleSetSortModel: (state, action) => {
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
  vehicleView,
  vehicleSetSortModel,
  setPagination,
  setSortBy,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
