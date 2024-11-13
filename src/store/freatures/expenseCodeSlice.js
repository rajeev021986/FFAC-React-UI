import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  view : "grid",
  pagination : { page: 0, pageSize: 20 },
  formData: {
    keyword : ''
  }
}

const expenseCodeSlice = createSlice({
  name: 'expenseCode',
  initialState,
  reducers: {
    toggleExpenseCodeFilter: (state, action) => {
      const { category, value } = action.payload;
      const currentValues = state[category];
      const isSelected = currentValues.includes(value);
  
      state[category] = isSelected ? [] : [value];
    },
    updateExpenseCodeInput: (state, action) => {
        state.formData = action.payload;
    },
    setExpenseCodePagination: (state, action) => {
        state.pagination = action.payload;
    },
  }
});

export const { 
    toggleExpenseCodeFilter,
    updateExpenseCodeInput,
    setExpenseCodePagination
} = expenseCodeSlice.actions;

export default expenseCodeSlice.reducer;