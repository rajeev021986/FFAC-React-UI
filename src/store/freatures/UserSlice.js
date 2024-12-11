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

const codeUserSlice = createSlice({
  name: 'codeUser',
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
    customerSetView: (state, action) => {
      state.view = action.payload;
  },
  customerSetSortModel: (state, action) => {
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

export const { toggleFilter,customerSetView,customerSetSortModel,updateInput,setPagination,setView,setSortBy,setSortModel } = codeUserSlice.actions;
export default codeUserSlice.reducer;