import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const vendorDataApi = createApi({
    reducerPath: "vendorDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Vendor"],
    endpoints: (builder) => ({
        fetchVendor: builder.query({
            query: (params) => {
                let url = params.page == "vendor" ? "vendor/filter" : "approval/filter/vendor"
                const queryString = new URLSearchParams(params.params).toString();
                // return { url: `entity-service/${url}?${queryString}`, method: "GET", headers: getAppHeaders() };
                return { url: `entity-service/vendor/filter?${queryString}`, method: "POST", headers: getAppHeaders() };
            },
            providesTags: ["Vendor"],
        }),
        addVendor: builder.mutation({
            query: (params) => {
                return { url: `entity-service/vendor/add`, method: "POST", body: params, headers: getAppHeaders() };
            },
            invalidatesTags: ["Vendor"],
        }),
        updateVendor: builder.mutation({
            query: (params) => {
                console.log(params, "params")
                return { url: `entity-service/vendor/update`, method: "PUT", body: params, headers: getAppHeaders() };
            },
            invalidatesTags: ["Vendor"],
        }),
        getVendor: builder.query({
            query: (params) => {
                return { url: `entity-service/vendor/get/${params.id}`, method: "GET", body: params.body, headers: getAppHeaders() };
            },
        }),
        getVendorAudit: builder.query({
            query: (params) => {
                console.log(params, "params")
                return { url: `entity-service/vendor/audit/${params.id}`, method: "GET", body: params.body, headers: getAppHeaders() };
            },
        }),
        deleteVendor: builder.mutation({
            query: (id) => {
                return {
                    url: `entity-service/vendor/delete/${id}`,
                    method: "DELETE",
                    headers: getAppHeaders()
                };
            },
            // invalidatesTags: ["Vendor"],
        }),


    }),
});

export const {
    useFetchVendorQuery,
    useAddVendorMutation,
    useUpdateVendorMutation,
    useLazyGetVendorQuery,
    useLazyGetVendorAuditQuery,
    useDeleteVendorMutation,
} = vendorDataApi;
