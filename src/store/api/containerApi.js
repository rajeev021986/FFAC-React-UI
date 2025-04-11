import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const containerAPI = createApi({
  reducerPath: "containerAPI",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Code"],
  endpoints: (builder) => ({
    fetchContainer: builder.query({
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

    updateContainerNumber: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.document}/job-update/container`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    updateVehicleNumber: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.document}/job-update/vehicle`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    updateLooseCargoNumber: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.document}/job-update/loose-cargo`,
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
  useFetchContainerQuery,
  useUpdateContainerNumberMutation,
  useUpdateVehicleNumberMutation,
  useUpdateLooseCargoNumberMutation,
} = containerAPI;
