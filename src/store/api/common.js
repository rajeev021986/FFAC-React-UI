import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const auditDataApi = createApi({
    reducerPath: "auditDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Audit"],
    endpoints: (builder) => ({
        fetchAudit: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/audit?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["Audit"],
        }),
        
        
    }),
});

export const { 
    useFetchAuditQuery
} = auditDataApi;
