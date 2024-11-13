import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  view : "grid",
  status: [],
  pagination : { page: 0, pageSize: 10 },
  sortModel : [],
  formData: {
  },
  sortBy : '',
  rowSelection : []
}

const otmBolListSlice = createSlice({
  name: 'otmBolList',
  initialState,
  reducers: {
    togglePackingListFilter: (state, action) => {
      const { category, value } = action.payload;
      const currentValues = state[category];
      const isSelected = currentValues.includes(value);
  
      state[category] = isSelected ? [] : [value];
    },
    updatePackingListInput: (state, action) => {
        state.formData = action.payload;
    },
    setPackingListPagination: (state, action) => {
        state.pagination = action.payload;
    },
    setPackingListView: (state, action) => {
        state.view = action.payload;
    },
    setPackingListSortBy: (state,action) =>{
      state.sortBy = action.payload;
    },
    setPackingListSortModel: (state, action) => {
      state.sortModel = action.payload;
    }
  }
});

export const { 
    togglePackingListFilter,
    updatePackingListInput,
    setPackingListPagination,
    setPackingListView,
    setPackingListSortBy,
    setPackingListSortModel 
} = otmBolListSlice.actions;

export default otmBolListSlice.reducer;