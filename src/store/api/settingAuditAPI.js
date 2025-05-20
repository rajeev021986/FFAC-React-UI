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

    deleteVatAndHoldingTax: builder.mutation({
      query: (params) => {
        return {
          url: `${menuConfigUrl.admin}/settings/api/${params?.id}?type=${params?.type}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),

    vatAndHoldingTax: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.admin}/settings/api?type=${params?.setting_type}`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),
  }),
});

export const {
  useAddVatAndHoldingTaxMutation,
  useFetchVatAndHoldingQuery,
  useDeleteVatAndHoldingTaxMutation,
  useVatAndHoldingTaxMutation,
} = settingAuditAPI;
