import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  view: "grid",
  pagination: { page: 0, pageSize: 10 },
  formData: {
    city: "",
    vendorName: "",
    country: "",
  },
  sortBy: "",
  sortModel: [],
  view:"card"
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    toggleVendorFilter: (state, action) => {
      const { category, value } = action.payload;
      const currentValues = state[category];
      const isSelected = currentValues.includes(value);

      state[category] = isSelected ? [] : [value];
    },
    updateVendorInput: (state, action) => {
      state.formData = action.payload;
    },
    setVendorPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    }
  }
});

export const {
  toggleVendorFilter,
  updateVendorInput,
  setVendorPagination,
  setSortBy,
  setSortModel,
  setView
} = vendorSlice.actions;

export default vendorSlice.reducer;