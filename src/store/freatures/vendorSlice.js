import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  view : "grid",
  pagination : { page: 0, pageSize: 20 },
  formData: {
    keyword : ''
  }
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
  }
});

export const { 
    toggleVendorFilter,
    updateVendorInput,
    setVendorPagination
} = vendorSlice.actions;

export default vendorSlice.reducer;