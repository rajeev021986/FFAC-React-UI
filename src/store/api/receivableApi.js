import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const receivableCodeAPI = createApi({
  reducerPath: "receivableCodeAPI",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Code"],
  endpoints: (builder) => ({
    addReceivable: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.account}/payble/entry`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    updateReceivable: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.account}/payble/entry`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    deleteReceivable: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.account}/payble/entry/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),

    uploadReceivableFile: builder.mutation({
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
          url: `/${menuConfigUrl.account}/file`,
          method: "POST",
          body: formData,
          headers: headers,
        };
      },
    }),

    fetchReceivableDatas: builder.query({
      query: ({ params, payload, page }) => {
        const queryString = new URLSearchParams(params).toString();
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `/${menuConfigUrl.account}/${page}?${queryString}`,
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
  useAddReceivableMutation,
  useUpdateReceivableMutation,
  useDeleteReceivableMutation,
  useUploadReceivableFileMutation,
  useFetchReceivableDatasQuery,
} = receivableCodeAPI;
