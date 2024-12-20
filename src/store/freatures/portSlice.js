import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    view: "grid",
    pagination: { page: 0, pageSize: 10 },
    formData: {
        city: "",
        portName: "",
        country: "",
    },
    sortBy: "",
    sortModel: [],
    view: "card"
}

const portSlice = createSlice({
    name: 'port',
    initialState,
    reducers: {
        togglePortFilter: (state, action) => {
            const { category, value } = action.payload;
            const currentValues = state[category];
            const isSelected = currentValues.includes(value);

            state[category] = isSelected ? [] : [value];
        },
        updatePortInput: (state, action) => {
            state.formData = action.payload;
        },
        setPortPagination: (state, action) => {
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
    togglePortFilter,
    updatePortInput,
    setPortPagination,
    setSortBy,
    setSortModel,
    setView
} = portSlice.actions;

export default portSlice.reducer; 