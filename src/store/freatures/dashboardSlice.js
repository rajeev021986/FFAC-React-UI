import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  view : "card",
  pagination : { page: 0, pageSize: 10 },
  sortModel : [],
  formData: {},
  shipment: ["ALL"],
  shipper: [],
  pol: [],
  pod: [],
  sortBy : '',
  theme:"#026de0",
  mode:false
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    dashboardToggleFilter: (state, action) => {
        const { category, value, type = 'checkbox' } = action.payload;

        const currentValues = state[category];
        const isSelected = currentValues.includes(value);

        if(type === 'radio'){
          state[category] = isSelected ? [] : [value];
        }else{
          if (isSelected) {
            state[category] = currentValues.filter((v) => v !== value);
          } else {
            state[category] = [...currentValues, value];
          }
        }
    },
    dashboardUpdateInput: (state, action) => {
        state.formData = action.payload;
    },
    dashboardSetPagination: (state, action) => {
        state.pagination = action.payload;
    },
    dashboardSetView: (state, action) => {
        state.view = action.payload;
    },
    dashboardSetSortBy: (state,action) =>{
      state.sortBy = action.payload;
    },
    dashboardSetSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    }
     
  }
});

export const { 
    dashboardToggleFilter,
    dashboardUpdateInput,
    dashboardSetPagination,
    dashboardSetView,
    dashboardSetSortBy,
    dashboardSetSortModel,
    setTheme,
    setMode
 } = dashboardSlice.actions;
export default dashboardSlice.reducer;