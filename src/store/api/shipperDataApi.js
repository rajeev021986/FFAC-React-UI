import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";
const API_BASE_Shipper_URL= process.env.REACT_APP_Shipper_API_BASE_URL1;

export const shipperDataApi = createApi({
    reducerPath: "shipperDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_Shipper_URL }),
    tagTypes: ["Shipper"],
    endpoints: (builder) => ({
        fetchShipper: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/entity-service/shipper/get`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["Shipper"],
        }),
        addShipper: builder.mutation({
            query: (params) => {

                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };


                return { url: `entity-service/shipper/add`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Shipper"],
        }),
        updateShipper: builder.mutation({
            query: (params) => {
                
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `entity-service/shipper/update`, method: "PUT", body: params, headers: headers };
            },
            invalidatesTags: ["Shipper"],
        }),
        uploadShipperFile: builder.mutation({
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
        getShipperFileList: builder.mutation({
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
        
        fetchShipperDatas: builder.query({
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
    useFetchShipperQuery,
    useAddShipperMutation,
    useUpdateShipperMutation,
    useUploadShipperFileMutation, 
    useGetShipperFileListMutation, 
    useDownloadDocumnentMutation,
    useFetchShipperDatasQuery
} = shipperDataApi;
