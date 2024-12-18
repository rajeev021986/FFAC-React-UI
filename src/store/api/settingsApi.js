import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Format"],
    endpoints: (builder) => ({
        fetchFormat: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/settings/format?${queryString}`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["Format"],
        }),
        updateFormat: builder.mutation({
            query: (params) => {
                return { url: `/settings/format`, method: "PUT", body: params, headers: getAppHeaders() };
            },
            invalidatesTags: ["Format"],
        }),
        addOptons: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };
                return { url: `/admin-service/settings/update`, method: "PUT", body: params.body, headers: headers };
            },
            invalidatesTags: ["Code"],
        }),
        getOptionsSettings: builder.query({
            query: (params) => {
                // const queryString = new URLSearchParams(params).toString();
                return { url: `/admin-service/v1/settings/entity?entity=${params}`, method: "GET", headers: getAppHeaders() };
            },
        }),
    }),
});

export const {
    useFetchFormatQuery,
    useUpdateFormatMutation,
    useAddOptonsMutation,
    useGetOptionsSettingsQuery,
} = settingsApi;
