import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const portDataAPI = createApi({
    reducerPath: "portDataAPI",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Port"],
    endpoints: (builder) => ({
        fetchPort: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params.params).toString();
                return { url: `master-service/v1/port/filter?${queryString}`, method: "POST", body: params.payload, headers: getAppHeaders() };
            },
            providesTags: ["Port"],
        }),
        addPort: builder.mutation({
            query: (payload) => ({
                url: 'master-service/v1/port',
                method: 'POST',
                body: payload,
                headers: getAppHeaders(),
            }),
        }),
        getPort: builder.query({
            query: (params) => {
                return { url: `master-service/v1/port/${params.id}`, method: "GET", headers: getAppHeaders() };
            },
        }),
        updatePort: builder.mutation({
            query: (payload) => ({
                url: 'master-service/v1/port',
                method: 'PUT',
                body: payload,
                headers: getAppHeaders(),
            }),
        }),
        getPortAudit: builder.query({
            query: (params) => {
                return { url: `master-service/v1/port/audit/${params.id}`, method: "GET", headers: getAppHeaders() };
            },
        }),
    }),
});

export const {
    useFetchPortQuery,
    useAddPortMutation,
    useLazyGetPortQuery,
    useUpdatePortMutation,
    useLazyGetPortAuditQuery
} = portDataAPI;
