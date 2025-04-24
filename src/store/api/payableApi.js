import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const payableCodeAPI = createApi({
  reducerPath: "payableCodeAPI",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Code"],
  endpoints: (builder) => ({
    addPaybleEntry: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.document}/payble/entry`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),
    updatePaybleEntry: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.document}/customer`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),
    deletePaybleEntry: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.document}/payble/entry/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),
    uploadPaybleEntryFile: builder.mutation({
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
          url: `/${menuConfigUrl.document}/file`,
          method: "POST",
          body: formData,
          headers: headers,
        };
      },
    }),
    fetchPaybleEntryDatas: builder.query({
      query: ({ params, payload, page }) => {
        const queryString = new URLSearchParams(params).toString();
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `/${menuConfigUrl.document}/${page}?${queryString}`,
          method: "POST",
          body: payload,
          headers,
        };
      },
      providesTags: ["Code"],
    }),
  }),
});

export const {
  useAddPaybleEntryMutation,
  useUpdatePaybleEntryMutation,
  useDeletePaybleEntryMutation,
  useUploadPaybleEntryFileMutation,
  useFetchPaybleEntryDatasQuery,
} = payableCodeAPI;
