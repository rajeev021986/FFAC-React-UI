import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const codeDataApi = createApi({
  reducerPath: "codeDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Code"],
  endpoints: (builder) => ({
    addCustomer: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.entity}/customer`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),
    updateCustomer: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.entity}/customer`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.entity}/customer/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),

    uploadCustomerFile: builder.mutation({
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
          url: `/${menuConfigUrl.entity}/file`,
          method: "POST",
          body: formData,
          headers: headers,
        };
      },
    }),
    fetchCustomerDatas: builder.query({
      query: ({ params, payload, page }) => {
        const queryString = new URLSearchParams(params).toString();
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `/${menuConfigUrl.entity}/${page}?${queryString}`,
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
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useUploadCustomerFileMutation,
  useFetchCustomerDatasQuery,
} = codeDataApi;
