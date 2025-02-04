import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const vesselDataApi = createApi({
  reducerPath: "vesselDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Vessel"],
  endpoints: (builder) => ({
    fetchVessel: builder.query({
      query: (queryString, payload) => {
        const queryStrings = new URLSearchParams(queryString.params).toString();
        return {
          url: `/${menuConfigUrl.master}/vessel/filter?${queryStrings}`,
          method: "POST",
          body: queryString.payload,
          headers: getAppHeaders(),
        };
      },
      providesTags: ["Vessel"],
    }),

    fetchAuditVessel: builder.query({
      query: ({ id }) => {
        return {
          url: `/${menuConfigUrl.master}/vessel/audit/${id}`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
    }),

    addVessel: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `/${menuConfigUrl.master}/vessel`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Vessel"],
    }),
    updateVessel: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `/${menuConfigUrl.master}/vessel`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Vessel"],
    }),
    deleteVessel: builder.mutation({
      query: (id) => {
        return {
          url: `/${menuConfigUrl.master}/vessel/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),
  }),
});

export const {
  useAddVesselMutation,
  useFetchVesselQuery,
  useLazyFetchAuditVesselQuery,
  useUpdateVesselMutation,
  useDeleteVesselMutation,
} = vesselDataApi;
