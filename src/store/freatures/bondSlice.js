import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    view: "grid",
    pagination: { page: 0, pageSize: 10 },
    formData: {
        city: "",
        bondName: "",
        country: "",
    },
    sortBy: "",
    sortModel: [],
    view: "card"
}

const bondSlice = createSlice({
    name: 'bond',
    initialState,
    reducers: {
        toggleBondFilter: (state, action) => {
            const { category, value } = action.payload;
            const currentValues = state[category];
            const isSelected = currentValues.includes(value);

            state[category] = isSelected ? [] : [value];
        },
        updateBondInput: (state, action) => {
            state.formData = action.payload;
        },
        setBondPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setSortModel: (state, action) => {
            state.sortModel = action.payload;
        },
        setView: (state, action) => {
            state.view = action.payload;
        }
    }
});

export const {
    toggleBondFilter,
    updateBondInput,
    setBondPagination,
    setSortBy,
    setSortModel,
    setView
} = bondSlice.actions;

export default bondSlice.reducer; 