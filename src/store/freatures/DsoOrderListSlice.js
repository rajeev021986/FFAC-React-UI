import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  view: "grid",
  status: [],
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {},
  sortBy: "",
  rowSelection: [],
};

const DsoOrderListSlice = createSlice({
  name: "DsoOrderList",
  initialState,
  reducers: {
    togglePackingListFilter: (state, action) => {
      const { category, value } = action.payload;
      const currentValues = state[category];
      const isSelected = currentValues.includes(value);
      state[category] = isSelected ? [] : [value];
    },
    updateDsoOrderListInput: (state, action) => {
      state.formData = action.payload;
    },
    setDsoOrderPagination: (state, action) => {
      state.pagination = action.payload;
    },
    // setPackingListView: (state, action) => {
    //   state.view = action.payload;
    // },
    setDsoOrderListSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setPackingListSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
  },
});

export const {
  // togglePackingListFilter,
  // updatePackingListInput,
  updateDsoOrderListInput,
  setDsoOrderPagination,
  setDsoOrderListSortBy,
  // setPackingListView,
  // setPackingListSortBy,
  // setPackingListSortModel,
} = DsoOrderListSlice.actions;

export default DsoOrderListSlice.reducer;
