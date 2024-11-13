import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders , API_BASE_URL} from "../../services/ApiMethods";

export const codeDataApi = createApi({
    reducerPath: "codeDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Code"],
    endpoints: (builder) => ({
        fetchCustomer: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/entity-service/customer/get`, method: "GET", headers : getAppHeaders() };
                // return { url: `/code/customer?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["Code"],
        }),
        addCustomer: builder.mutation({
            query: (params) => {
                const headers = { 
                    'Authorization': getAppHeaders()['Authorization'] 
                };
                return { url: `entity-service/customer/add`, method: "POST", body: params, headers : headers };
            },
            invalidatesTags: ["Code"],
        }),
        fetchParty: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/code/party?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["Code"],
        }),
        addParty: builder.mutation({
            query: (params) => {
                const headers = { 
                    'Authorization': getAppHeaders()['Authorization'] 
                };
                return { url: `/code/party`, method: "POST", body: params, headers : headers };
            },
            invalidatesTags: ["Code"],
        }),
        fetchAgent: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/code/agent?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["Code"],
        }),
        addAgent: builder.mutation({
            query: (params) => {
                const headers = { 
                    'Authorization': getAppHeaders()['Authorization'] 
                };
                return { url: `/code/agent`, method: "POST", body: params, headers : headers };
            },
            invalidatesTags: ["Code"],
        }),
    }),
});

export const {useFetchCustomerQuery, useAddCustomerMutation, useFetchPartyQuery, useAddPartyMutation, useFetchAgentQuery, useAddAgentMutation } = codeDataApi;
