import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const destinationDataApi = createApi({
    reducerPath: "destinationDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Destination"],
    endpoints: (builder) => ({
        fetchDestination: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/destination?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["Destination"],
        }),
        addDestination: builder.mutation({
            query: (params) => {
                return { url: `/destination`, method: "POST", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["Destination"],
        }),
        updateDestination: builder.mutation({
            query: (params) => {
                return { url: `/destination/${params.id}`, method: "PUT", body: params, headers : getAppHeaders() };
            },
            invalidatesTags: ["Destination"],
        }),
        
        
    }),
});

export const { 
    useFetchDestinationQuery,
    useAddDestinationMutation,
    useUpdateDestinationMutation
} = destinationDataApi;
