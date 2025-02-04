import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";
 //const API_BASE_Shipper_URL= process.env.REACT_APP_Shipper_API_BASE_URL1;

export const shipperDataApi = createApi({
    reducerPath: "shipperDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Shipper"],
    endpoints: (builder) => ({
        fetchShipper: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/${menuConfigUrl.entity}/shipper`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["Shipper"],
        }),
        addShipper: builder.mutation({
            query: (params) => {

                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };


                return { url: `${menuConfigUrl.entity}/shipper`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Shipper"],
        }),
        updateShipper: builder.mutation({
            query: (params) => {
                
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `${menuConfigUrl.entity}/shipper`, method: "PUT", body: params, headers: headers };
            },
            invalidatesTags: ["Shipper"],
        }),
        
        fetchShipperDatas: builder.query({
            query: ({ params, payload, page }) => {
                const queryString = new URLSearchParams(params).toString();
                const headers = {
                    Authorization: getAppHeaders()['Authorization'],
                };
                return {
                    url: `/${menuConfigUrl.entity}/${page}?${queryString}`,
                    method: "POST",
                    body: payload,
                    headers,
                };
            },
            providesTags: ["Shipper"],
        }),
        getShipperAudit: builder.query({
            query: (params) => {
                return { url: `${menuConfigUrl.entity}/shipper/audit/${params.id}`, method: "GET", headers: getAppHeaders() };
            },
        }),
        DeleteShipper: builder.mutation({
            query: (id) => {
                return {
                    url: `${menuConfigUrl.entity}/shipper/${id}`,
                    method: "DELETE",
                    headers: getAppHeaders()
                };
            },
            // invalidatesTags: ["Vendor"],
        }),
        
        
    }),
});

export const { 
    useFetchShipperQuery,
    useAddShipperMutation,
    useUpdateShipperMutation,
    useFetchShipperDatasQuery,
    useLazyGetShipperAuditQuery,
    useDeleteShipperMutation,
} = shipperDataApi;
