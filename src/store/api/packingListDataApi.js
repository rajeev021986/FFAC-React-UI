import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";

export const packingListDataApi = createApi({
    reducerPath: "packingListDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["PackingList","PoOrderList"],
    endpoints: (builder) => ({
        fetchPackingList: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/packing_list?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["PackingList"],
        }),
        fetchPackingListDetails: builder.query({
            query: (id) => {
                return { url: `/packing_list?serialId=${id}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["PackingList"]
        }),
        editPLDetails : builder.mutation({
            query: (params) => {
                const { serial_id, ...body } = params;
                return { url: `/packing_list/${serial_id}`, method: "PUT", body, headers : getAppHeaders() };
            },
            invalidatesTags: ["PackingList"]
        }),
        addVesselDetails : builder.mutation({
            query: (params) => {
                return { url: `/vessel`, method: "POST", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["PackingList"]
        }),
        fetchSPRBLPackingList: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/packing_listSPRBL?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["PackingList"],
        }),
        addSPRBLSave : builder.mutation({
            query: (params) => {
                const headers = { 
                    'Authorization': getAppHeaders()['Authorization'] 
                };
                return { url: `/SPRBLSave`, method: "POST", body: params, headers : headers };
            },
            invalidatesTags: ["PackingList"]
        }),

        fetchPoOrderList: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/po_orders?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["PoOrderList"],
        }),
        fetchDsoOrderList: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/dso_orders?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["PoOrderList"],
        }),
    }),
});

export const { 
    useFetchPackingListQuery,
    useFetchPackingListDetailsQuery,
    useAddVesselDetailsMutation,
    useEditPLDetailsMutation,
    useFetchSPRBLPackingListQuery,
    useAddSPRBLSaveMutation,

    useFetchPoOrderListQuery,
    useFetchDsoOrderListQuery
} = packingListDataApi;
