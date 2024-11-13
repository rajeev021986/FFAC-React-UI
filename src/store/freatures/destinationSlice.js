import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  view : "grid",
  pagination : { page: 0, pageSize: 20 },
  formData: {
    keyword : ''
  }
}

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {
    toggleDestinationFilter: (state, action) => {
      const { category, value } = action.payload;
      const currentValues = state[category];
      const isSelected = currentValues.includes(value);
  
      state[category] = isSelected ? [] : [value];
    },
    updateDestinationInput: (state, action) => {
        state.formData = action.payload;
    },
    setDestinationPagination: (state, action) => {
        state.pagination = action.payload;
    },
  }
});

export const { 
    toggleDestinationFilter,
    updateDestinationInput,
    setDestinationPagination
} = destinationSlice.actions;

export default destinationSlice.reducer;