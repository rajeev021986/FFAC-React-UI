import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";

export const dashboardDataApi = createApi({
    reducerPath: "dashboardDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["ShipmentData"],
    endpoints: (builder) => ({
        fetchShipmentData: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/dashboard/shipments?${queryString}`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["ShipmentData"],
        }),
        fetchShipmentTracking: builder.query({
            query: (params) => {
                return { url: `/dashboard/shipments/${params.mblno}`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["ShipmentData"],
        })
       
    }),
});

export const { 
   useFetchShipmentDataQuery,
   useFetchShipmentTrackingQuery
} = dashboardDataApi;
