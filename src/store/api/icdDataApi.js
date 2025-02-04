import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";
//  const API_BASE_Shipper_URL= process.env.REACT_APP_Shipper_API_BASE_URL1;

export const icdDataApi = createApi({
  reducerPath: "icdDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Icd"],
  endpoints: (builder) => ({
    fetchIcd: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `/${menuConfigUrl.master}/icd`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
      providesTags: ["Icd"],
    }),
    addIcd: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.master}/icd`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Icd"],
    }),
    updateIcd: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.master}/icd`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Icd"],
    }),
    uploadIcdFile: builder.mutation({
      query: (params) => {
        const formData = new FormData();
        formData.append("file", params.file);
        const entityFileBlob = new Blob([JSON.stringify(params.entityFile)], {
          type: "application/json",
        });
        formData.append("entityFile", entityFileBlob);

        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `/${menuConfigUrl.master}/file/upload`,
          method: "POST",
          body: formData,
          headers: headers,
        };
      },
    }),
    getIcdFileList: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `/${menuConfigUrl.master}/file/get`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
    }),
    downloadDocumnent: builder.mutation({
      query: (params) => {
        return {
          url: `/file/download?${params.id}`,
          body: params.body,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
    }),

    fetchIcdDatas: builder.query({
      query: ({ params, payload, page }) => {
        const queryString = new URLSearchParams(params).toString();
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `/${menuConfigUrl.master}/${page}?${queryString}`,
          method: "POST",
          body: payload,
          headers,
        };
      },
      providesTags: ["Icd"],
    }),
    getIcdAudit: builder.query({
      query: (params) => {
        return {
          url: `${menuConfigUrl.master}/icd/audit/${params.id}`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
    }),
    deleteIcd: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.master}/icd/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      // invalidatesTags: ["Vendor"],
    }),
  }),
});

export const {
  useFetchIcdQuery,
  useAddIcdMutation,
  useUpdateIcdMutation,
  useUploadIcdFileMutation,
  useGetIcdFileListMutation,
  useDownloadDocumnentMutation,
  useFetchIcdDatasQuery,
  useLazyGetIcdAuditQuery,
  useDeleteIcdMutation,
} = icdDataApi;
