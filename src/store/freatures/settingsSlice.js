import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { settingsApi } from '../api/settingsApi';


const initialState = {
    format : {}
};

const settingsSlice = createSlice({
    name: 'format',
    initialState,
    reducers: {
        setFormat: (state, action) => {
            const { column, format } = action.payload;
            state.format[column] = format;
        }
    },
    extraReducers :(builder) => {
        builder.addMatcher(
            settingsApi.endpoints.fetchFormat.matchFulfilled,
            (state, { payload }) => {
                const {data} = payload;
                let result = {};
                for(let item of data){
                    result[item.key] = item.format
                }
                state.format = result;
            }
        );
    }
});

export const { 
    setFormat 
} = settingsSlice.actions;
export default settingsSlice.reducer;