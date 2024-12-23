import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    //   role: [],
    //   status: [],
    pagination: { page: 0, pageSize: 10 },
    sortModel: [],
    formData: {
        vvoyage: '',
        status: ''
    },
    sortBy: ''
};

const vesselVoyageSlice = createSlice({
    name: 'vesselVoyageStore',
    initialState: initialState,
    reducers: {
        toggleFilter: (state, action) => {
            const { category, value } = action.payload;
            const currentValues = state[category];
            const isSelected = currentValues.includes(value);
            state[category] = isSelected
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];
        },
        voyageSetSortModel: (state, action) => {
            state.sortModel = action.payload;
        },
        updateInput: (state, action) => {
            state.formData = action.payload;
        },
        voyageSetView: (state, action) => {
            state.view = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setSortModel: (state, action) => {
            state.sortModel = action.payload;
        }
    }

})

export const { voyageSetView, setPagination, updateInput, setSortBy, setSortModel, voyageSetSortModel, toggleFilter } = vesselVoyageSlice.actions;
export default vesselVoyageSlice.reducer;