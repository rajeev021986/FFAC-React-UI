import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const vendorDataApi = createApi({
    reducerPath: "vendorDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Vendor"],
    endpoints: (builder) => ({
        fetchVendor: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/vendor?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["Vendor"],
        }),
        addVendor: builder.mutation({
            query: (params) => {
                return { url: `/vendor`, method: "POST", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["Vendor"],
        }),
        updateVendor: builder.mutation({
            query: (params) => {
                return { url: `/vendor/${params.id}`, method: "PUT", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["Vendor"],
        }),
        
        
    }),
});

export const { 
    useFetchVendorQuery,
    useAddVendorMutation,
    useUpdateVendorMutation
} = vendorDataApi;
