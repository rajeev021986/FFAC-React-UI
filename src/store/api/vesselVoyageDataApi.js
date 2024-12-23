import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const vesselVoyageDataApi = createApi({
    reducerPath: "vesselVoyageDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Voyage"],
    endpoints: (builder) => ({
        fetchVoyage: builder.query({
            query: (queryString) => {
                const queryStrings = new URLSearchParams(queryString.params).toString();
                return { url: `/master-service/v1/vessel/voyage/filter?${queryStrings}`, method: "POST", body: queryString.payload, headers: getAppHeaders() };

            },
            providesTags: ["Voyage"],
        }),

        addVoyage: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `/master-service/v1/vessel/voyage`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Voyage"],
        }),

        updateVoyage: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `/master-service/v1/vessel/voyage`, method: "PUT", body: params, headers: headers };
            },
            invalidatesTags: ["Voyage"],
        }),

        fetchAuditVoyage: builder.query({
            query: ({ id }) => {
                return { url: `/master-service/v1/vessel/voyage/audit/${id}`, method: "GET", headers: getAppHeaders() };

            },
        }),


    })
})

export const { useFetchVoyageQuery, useLazyFetchAuditVoyageQuery, useAddVoyageMutation, useUpdateVoyageMutation } = vesselVoyageDataApi;

