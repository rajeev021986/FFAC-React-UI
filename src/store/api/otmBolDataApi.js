import { createApi,fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";

export const otmBolDataApi = createApi({
    reducerPath: "otmBolDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["OtmBolList"],
    endpoints: (builder) => ({
        fetchOtmBolList: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/packing_listSPRBL/tracking?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["OtmBolList"],
        }),
        fetchOTMBOLPayLoad : builder.query({
            query : (params)=>{
                const queryString = new URLSearchParams(params).toString();
                return {
                    url : `/otm_bol/fetch_payload?${queryString}`,
                    method : "GET",
                    headers : getAppHeaders()
                }
            }
        }),
        fetchByUniqueKey : builder.query({
            query : (params)=>({
                url : `/otm_bol/${params}`,
                method : "GET",
                headers : getAppHeaders()
            })
        })  

    }),
});

export const { 
    useFetchOtmBolListQuery,
    useLazyFetchOTMBOLPayLoadQuery,
    useFetchByUniqueKeyQuery
} = otmBolDataApi;
