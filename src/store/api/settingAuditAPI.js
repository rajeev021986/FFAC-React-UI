import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const settingAuditAPI = createApi({
  reducerPath: "settingAuditAPI",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Code"],

  endpoints: (builder) => ({
    addVatAndHoldingTax: builder.mutation({
      query: (params) => {
        console.log(params, 34562323);
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.admin}/settings/api?type=${params?.setting_type}`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    fetchVatAndHolding: builder.query({
      query: ({ page }) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        const url = `/${menuConfigUrl.admin}/${page}`;
        return {
          url,
          method: "GET",
          headers,
        };
      },
      providesTags: ["Code"],
    }),

    updateJobDetailsEntry: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.admin}/job-update`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    updateJobEntry: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.document}/job-detail`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    deleteJobEntry: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.document}/job-detail/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),
  }),
});

export const {
  useAddVatAndHoldingTaxMutation,
  useFetchVatAndHoldingQuery,

  useDeleteJobEntryMutation,
  useUpdateJobEntryMutation,
  useUpdateJobDetailsEntryMutation,
} = settingAuditAPI;
