import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const vesselDataApi = createApi({
    reducerPath: "vesselDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Vessel"],
    endpoints: (builder) => ({
        fetchVessel: builder.query({
            query: (queryString, payload) => {
                const queryStrings = new URLSearchParams(queryString.params).toString();
                return { url: `/master-service/v1/vessel/filter?${queryStrings}`, method: "POST", body: queryString.payload, headers: getAppHeaders() };

            },
            providesTags: ["Vessel"],
        }),

        fetchAuditVessel: builder.query({
            query: ({ id }) => {
                console.log("id", id);
                return { url: `/master-service/v1/vessel/audit/${id}`, method: "GET", headers: getAppHeaders() };

            },

        }),

        addVessel: builder.mutation({
            query: (params) => {
                console.log(params, "params");
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `/master-service/v1/vessel`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Vessel"],
        }),
        updateVessel: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `/master-service/v1/vessel`, method: "PUT", body: params, headers: headers };
            },
            invalidatesTags: ["Vessel"],
        }),

    })
})

export const { useAddVesselMutation
    , useFetchVesselQuery, useLazyFetchAuditVesselQuery, useUpdateVesselMutation
} = vesselDataApi;