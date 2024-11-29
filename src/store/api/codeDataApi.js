import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";

export const codeDataApi = createApi({
    reducerPath: "codeDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Code"],
    endpoints: (builder) => ({
        fetchCustomer: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/entity-service/customer/get`, method: "GET", headers: getAppHeaders() };
                // return { url: `/code/customer?${queryString}`, method: "GET", headers : getAppHeaders() };
            },
            providesTags: ["Code"],
        }),
        addCustomer: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };


                return { url: `entity-service/customer/add`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Code"],
        }),
        updateCustomer: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };

                return { url: `entity-service/customer/update`, method: "PUT", body: params, headers: headers };
            },
            invalidatesTags: ["Code"],
        }),



        fetchParty: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/code/party?${queryString}`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["Code"],
        }),
        addParty: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };
                return { url: `/code/party`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Code"],
        }),
        fetchAgent: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return { url: `/code/agent?${queryString}`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["Code"],
        }),
        addAgent: builder.mutation({
            query: (params) => {
                const headers = {
                    'Authorization': getAppHeaders()['Authorization']
                };
                return { url: `/code/agent`, method: "POST", body: params, headers: headers };
            },
            invalidatesTags: ["Code"],
        }),
        uploadCustomerFile: builder.mutation({
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
        getCustomerFileList: builder.mutation({
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
        // fetchCustomerDatas: builder.query({
        //     query: (params, payload) => {
        //         const queryString = new URLSearchParams(params).toString();
        //         return { url: `/entity-service/customer/filter?${queryString}`, method: "POST", body: payload, headers: getAppHeaders() };
        //     },
        //     providesTags: ["Code"],
        // }),
        fetchCustomerDatas: builder.query({
            query: ({ params, payload, page }) => {
                const queryString = new URLSearchParams(params).toString();
                const headers = {
                    Authorization: getAppHeaders()['Authorization'],
                };
                return {
                    url: `/entity-service/customer/${page}?${queryString}`,
                    method: "POST",
                    body: payload,
                    headers,
                };
            },
            providesTags: ["Code"],
        }),

    }),
});

export const { useFetchCustomerQuery, useAddCustomerMutation, useUpdateCustomerMutation, useFetchPartyQuery, useAddPartyMutation, useFetchAgentQuery, useAddAgentMutation, useUploadCustomerFileMutation, useGetCustomerFileListMutation, useDownloadDocumnentMutation, useFetchCustomerDatasQuery } = codeDataApi;
