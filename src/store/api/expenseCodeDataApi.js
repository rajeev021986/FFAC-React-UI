import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const expenseCodeDataApi = createApi({
    reducerPath: "expenseCodeDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["ExpenseCode"],
    endpoints: (builder) => ({
        fetchExpenseCode: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/expense_codes?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["ExpenseCode"],
        }),
        addExpenseCode: builder.mutation({
            query: (params) => {
                return { url: `/expense_codes`, method: "POST", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["ExpenseCode"],
        }),
        updateExpenseCode: builder.mutation({
            query: (params) => {
                return { url: `/expense_codes/${params.id}`, method: "PUT", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["ExpenseCode"],
        }),
        
        
    }),
});

export const { 
    useFetchExpenseCodeQuery,
    useAddExpenseCodeMutation,
    useUpdateExpenseCodeMutation
} = expenseCodeDataApi;
