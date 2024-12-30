import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";


export const chargesDataApi = createApi({
    reducerPath: "chargesDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Charges"],
    endpoints: (builder) => ({
        fetchChargesDatas: builder.query({
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
            providesTags: ["Charges"],
        }),
        addCharge: builder.mutation({
            query: (params) => {
                return { url: `admin-service/v1/charge`, method: "POST", body: params, headers: getAppHeaders() };
            },
            invalidatesTags: ["Charges"],
        }),
        updateCharge: builder.mutation({
            query: (params) => {
                console.log(params, "params")
                return { url: `admin-service/v1/charge`, method: "PUT", body: params, headers: getAppHeaders() };
            },
            invalidatesTags: ["Charges"],
        }),
        getCharge: builder.query({
            query: (params) => {
                return { url: `admin-service/v1/charge/${params.id}`, method: "GET", body: params.body, headers: getAppHeaders() };
            },
        }),
    })

})

export const { useFetchChargesDatasQuery, useAddChargeMutation, useUpdateChargeMutation,useLazyGetChargeQuery  } = chargesDataApi;