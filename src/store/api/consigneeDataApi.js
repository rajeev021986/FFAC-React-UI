import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";
// const API_BASE_Shipper_URL= process.env.REACT_APP_Shipper_API_BASE_URL1;

export const consigneeDataApi = createApi({
    reducerPath: "consigneeDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Consignee"],
    endpoints: (builder) => ({
        fetchConsignee: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/entity-service/consignee`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["Consignee"],
        }),
        addConsignee: builder.mutation({
            query: (params) => {

                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };


                return { url: `entity-service/consignee`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Consignee"],
        }),
        updateConsignee: builder.mutation({
            query: (params) => {
                
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `entity-service/consignee`, method: "PUT", body: params, headers: headers };
            },
            invalidatesTags: ["Consignee"],
        }),
        uploadConsigneeFile: builder.mutation({
            query: (params) => {
                const formData = new FormData();
                formData.append('file', params.file);
                const entityFileBlob = new Blob([JSON.stringify(params.entityFile)], { type: 'application/json' });
                formData.append('entityFile', entityFileBlob);

                const headers = {
                    Authorization: getAppHeaders()['Authorization'],
                };

                return {
                    url: `/entity-service/file/upload`,
                    method: "POST",
                    body: formData,
                    headers: headers
                };
            },
        }),
        getConsigneeFileList: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };
                return { url: `/entity-service/file/get`, method: "POST", body: params, headers: headers };
            },
        }),
        downloadDocumnent: builder.mutation({
            query: (params) => {
                return { url: `/file/download?${params.id}`, body: params.body, method: "GET", headers: getAppHeaders() };
            },
        }),
        
        fetchConsigneeDatas: builder.query({
            query: ({ params, payload, page }) => {
                const queryString = new URLSearchParams(params).toString();
                const headers = {
                    Authorization: getAppHeaders()['Authorization'],
                };
                return {
                    url: `/entity-service/${page}?${queryString}`,
                    method: "POST",
                    body: payload,
                    headers,
                };
            },
            providesTags: ["Shipper"],
        }),
        
        
    }),
});

export const { 
    useFetchConsigneeQuery,
    useAddConsigneeMutation,
    useUpdateConsigneeMutation,
    useUploadConsigneeFileMutation, 
    useGetConsigneeFileListMutation, 
    useDownloadDocumnentMutation,
    useFetchConsigneeDatasQuery
} = consigneeDataApi;
