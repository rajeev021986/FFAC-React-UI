import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const bondDataAPI = createApi({
  reducerPath: "bondDataAPI",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["bond"],
  endpoints: (builder) => ({
    fetchbond: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params.params).toString();
        return {
          url: `${menuConfigUrl.master}/bond/filter?${queryString}`,
          method: "POST",
          body: params.payload,
          headers: getAppHeaders(),
        };
      },
      providesTags: ["bond"],
    }),
    addbond: builder.mutation({
      query: (payload) => ({
        url: `${menuConfigUrl.master}/bond`,
        method: "POST",
        body: payload,
        headers: getAppHeaders(),
      }),
    }),
    getbond: builder.query({
      query: (params) => {
        return {
          url: `${menuConfigUrl.master}/bond/${params.id}`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
    }),
    updatebond: builder.mutation({
      query: (payload) => ({
        url: `${menuConfigUrl.master}/bond`,
        method: "PUT",
        body: payload,
        headers: getAppHeaders(),
      }),
    }),
    getbondAudit: builder.query({
      query: (params) => {
        return {
          url: `${menuConfigUrl.master}/bond/audit/${params.id}`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
    }),
    deleteBond: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.master}/bond/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
    }),
  }),
});

export const {
  useFetchbondQuery,
  useAddbondMutation,
  useLazyGetbondQuery,
  useUpdatebondMutation,
  useLazyGetbondAuditQuery,
  useDeleteBondMutation,
} = bondDataAPI;
