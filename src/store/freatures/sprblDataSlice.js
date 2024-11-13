import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  bolData: {},
  plData : [],
  updatePlData:[{}],
  errors : {}
}

const sprblDataSlice = createSlice({
  name: 'sprblDetails',
  initialState,
  reducers: {
    updateBolDataInput: (state, action) => {
      const { field, value } = action.payload;
      state.bolData[field] = value; // Update specific field
    },
    setPLData: (state, action) => {
      state.plData = action.payload; // Handle sortModel updates
    },
    updatePLDataInput: (state, action) => {
      const { field, value } = action.payload;
      state.updatePlData[field] = value;
    },
    updateInitialValue: (state, action) => {
      const prve = state.bolData;
      state.bolData = {...prve, ...action.payload}; // Update specific field
    },
    setFormErrors: (state, action )=>{
      state.errors = action.payload;
    },
    clearFormErrors: (state) => {
      state.errors = {};
    }


  }
});

export const {
  updateBolDataInput, 
    setPLData,
    updatePLDataInput,
    updateInitialValue,
    setFormErrors,
    clearFormErrors
} = sprblDataSlice.actions;

export default sprblDataSlice.reducer;