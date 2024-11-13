import { createSlice } from '@reduxjs/toolkit';

const initialState = {
//   role: [],
//   status: [],
  pagination : { page: 0, pageSize: 10 },
  sortModel : [],
  formData: {
    acode: '',
    city: '',
    cname: '',
    country: ''
  },
  sortBy : ''
};

const codeAgentSlice = createSlice({
  name: 'codeAgent',
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
    setPagination: (state, action) => {
        state.pagination = action.payload;
    },
    setSortBy: (state,action) =>{
      state.sortBy = action.payload;
    },
    setSortModel: (state, action) => {
      state.sortModel = action.payload;
    }
  }
});

export const { toggleFilter,updateInput,setPagination,setView,setSortBy,setSortModel } = codeAgentSlice.actions;
export default codeAgentSlice.reducer;