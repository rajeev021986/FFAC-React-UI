import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const serviceInvoiceDataApi = createApi({
    reducerPath: "serviceInvoiceDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["ServiceInvoice","Verify"],
    endpoints: (builder) => ({
        fetchServiceInvoice: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/service_invoice?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["ServiceInvoice", "Verify"],
        }),
        verifyStatus: builder.mutation({
            query: (params) => {
                return { url: `/service_invoice/verify`, method: "POST", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["Verify"],
        }),
        saveServiceInvoice: builder.mutation({
            query: (params) => {
                const { serial_id } = params;
                return { url: `/service_invoice/${serial_id}`, method: "PUT", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["ServiceInvoice"],
        })
        
    }),
});

export const { 
    useFetchServiceInvoiceQuery,
    useVerifyStatusMutation,
    useSaveServiceInvoiceMutation
} = serviceInvoiceDataApi;
