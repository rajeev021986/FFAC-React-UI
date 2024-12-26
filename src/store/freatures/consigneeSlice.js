import { createSlice } from '@reduxjs/toolkit';

const initialState = {
//   role: [],
//   status: [],
  pagination : { page: 0, pageSize: 10 },
  sortModel : [],
  formData: {
    city: '',
    cName: '',
    country: ''
  },
  sortBy : ''
};

const consigneeSlice = createSlice({
  name: 'consignee',
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
    consigneeSetView: (state, action) => {
      state.view = action.payload;
  },
  consigneeSetSortModel: (state, action) => {
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

export const { toggleFilter,consigneeSetView,consigneeSetSortModel,updateInput,setPagination,setView,setSortBy,setSortModel } = consigneeSlice.actions;
export default consigneeSlice.reducer;