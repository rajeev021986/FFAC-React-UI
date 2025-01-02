import { createSlice } from '@reduxjs/toolkit';

const initialState = {
//   role: [],
//   status: [],
  pagination : { page: 0, pageSize: 10 },
  sortModel : [],
  formData: {
    icode: '',
    iname: '',
    email: ''
  },
  sortBy : ''
};

const icdSlice = createSlice({
  name: 'icd',
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
    icdSetView: (state, action) => {
      state.view = action.payload;
  },
  icdSetSortModel: (state, action) => {
    state.sortModel = action.payload;
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

export const { toggleFilter,icdSetView,icdSetSortModel,updateInput,setPagination,setView,setSortBy,setSortModel } = icdSlice.actions;
export default icdSlice.reducer;