import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";


export const exchangeRateDataApi = createApi({
    reducerPath: "exchangeRateDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Exchange"],
    endpoints: (builder) => ({
        fetchExchangeRateDatas: builder.query({
            query: ({ params, payload, page }) => {
                const queryString = new URLSearchParams(params).toString();
                const headers = {
                    Authorization: getAppHeaders()['Authorization'],
                };
                return {
                    url: `/admin-service/v1/${page}?${queryString}`,
                    method: "POST",
                    body: payload,
                    headers,
                };
            },
            providesTags: ["Exchange"],
        }),
        addExahangeRate: builder.mutation({
            query: (params) => {
                return { url: `admin-service/v1/exchange-rate`, method: "POST", body: params, headers: getAppHeaders() };
            },
            invalidatesTags: ["Charges"],
        }),
        updateExahangeRate: builder.mutation({
            query: (params) => {
                return { url: `admin-service/v1/exchange-rate`, method: "PUT", body: params, headers: getAppHeaders() };
            },
            invalidatesTags: ["Charges"],
        }),
        getExahangeRate: builder.query({
            query: (params) => {
                return { url: `admin-service/v1/exchange-rate/${params.id}`, method: "GET", body: params.body, headers: getAppHeaders() };
            },
        }),
        deleteExchangeRate: builder.mutation({
            query: (id) => {
                return {
                    url: `admin-service/v1/exchange-rate/${id}`,
                    method: "DELETE",
                    headers: getAppHeaders()
                };
            },
            invalidatesTags: ["Code"],
        }),
        getExchangeRateAudit: builder.query({
            query: (params) => {
                return {
                    url: `admin-service/v1/exchange-rate/audit/${params.id}`,
                    method: "GET",
                    headers: getAppHeaders(),
                };
            },
        }),

    })

})

export const { useFetchExchangeRateDatasQuery, useAddExahangeRateMutation, useUpdateExahangeRateMutation, useLazyGetExahangeRateQuery, useDeleteExchangeRateMutation, useLazyGetExchangeRateAuditQuery } = exchangeRateDataApi;