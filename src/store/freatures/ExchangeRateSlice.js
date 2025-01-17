import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pagination: { page: 0, pageSize: 10 },
    sortModel: [],
    formData: {
        currency: '',
        usdExchange: '',
        statusCode: '',
    },
    sortBy: ''
};

const exchangeRateSlice = createSlice({
    name: 'exchangeRateStore',
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
        exchangeRateSetView: (state, action) => {
            state.view = action.payload;
        },
        exchangeRateSetSortModel: (state, action) => {
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

export const { toggleFilter, exchangeRateSetView, exchangeRateSetSortModel, updateInput, setPagination, setView, setSortBy, setSortModel } = exchangeRateSlice.actions;
export default exchangeRateSlice.reducer;