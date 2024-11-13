import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  view : "grid",
  status: [],
  pagination : { page: 0, pageSize: 10 },
  sortModel : [],
  formData: {
    invoice_no: '',
    mbl_no: '',
    fromDate: '',
    toDate: '',
  },
  sortBy : '',
}

const serviceInvoiceSlice = createSlice({
  name: 'serviceInvoice',
  initialState,
  reducers: {
    toggleServiceInvoiceFilter: (state, action) => {
      const { category, value } = action.payload;
      const currentValues = state[category];
      const isSelected = currentValues.includes(value);
  
      state[category] = isSelected ? [] : [value];
    },
    updateServiceInvoiceInput: (state, action) => {
        state.formData = action.payload;
    },
    setServiceInvoicePagination: (state, action) => {
        state.pagination = action.payload;
    },
    setServiceInvoiceView: (state, action) => {
        state.view = action.payload;
    },
    setServiceInvoiceSortBy: (state,action) =>{
      state.sortBy = action.payload;
    },
    setServiceInvoiceSortModel: (state, action) => {
      state.sortModel = action.payload;
    }
  }
});

export const { 
    toggleServiceInvoiceFilter,
    updateServiceInvoiceInput,
    setServiceInvoicePagination,
    setServiceInvoiceView,
    setServiceInvoiceSortBy,
    setServiceInvoiceSortModel 
} = serviceInvoiceSlice.actions;

export default serviceInvoiceSlice.reducer;