import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pagination: { page: 0, pageSize: 10 },
    sortModel: [],
    formData: {
        chargeName: '',
        chargeCode: '',
        statusCode: ''
    },
    sortBy: ''
};

const chargesSlice = createSlice({
    name: 'chargesStore',
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
        chargesSetView: (state, action) => {
            state.view = action.payload;
        },
        chargesSetSortModel: (state, action) => {
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
        }
    }
});

export const { toggleFilter, chargesSetView, chargesSetSortModel, updateInput, setPagination, setView, setSortBy, setSortModel } = chargesSlice.actions;
export default chargesSlice.reducer;