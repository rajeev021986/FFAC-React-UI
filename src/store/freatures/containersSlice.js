import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { page: 0, pageSize: 10 },
  sortModel: [],
  formData: {
    customerName: "",
    customerRefNo: "",
    entryNo: "",
    mblNo: "",
    tansadNo: "",
    invoiceNo: "",
    hblNo: "",
    statusCode: "",
    isDoc: "",
  },
  sortBy: "",
};

// setPagination,
// containerView,
// containerSetSortModel,
// updateInput,

const containerSlice = createSlice({
  name: "containerSlice",
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
    containerView: (state, action) => {
      state.view = action.payload;
    },
    containerSetSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortModel: (state, action) => {
      state.sortModel = action.payload;
    },

    // Vehicle Shipment Action
    vehicleShipmentView: (state, action) => {
      state.view = action.payload;
    },
    setVehiclePagination: (state, action) => {
      state.pagination = action.payload;
    },
    VehicleSetSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
    updateVehicleInput: (state, action) => {
      state.formData = action.payload;
    },
  },
});

export const {
  toggleFilter,
  containerView,
  containerSetSortModel,
  updateInput,
  setPagination,
  setView,
  setSortBy,
  setSortModel,
  // Vehicle Shipment

  vehicleShipmentView,
  setVehiclePagination,
  VehicleSetSortModel,
  updateVehicleInput,
} = containerSlice.actions;
export default containerSlice.reducer;
