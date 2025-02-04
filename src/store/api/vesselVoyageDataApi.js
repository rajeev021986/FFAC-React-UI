import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const vesselVoyageDataApi = createApi({
  reducerPath: "vesselVoyageDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Voyage"],
  endpoints: (builder) => ({
    fetchVoyage: builder.query({
      query: (queryString) => {
        const queryStrings = new URLSearchParams(queryString.params).toString();
        return {
          url: `/${menuConfigUrl.master}/vessel/voyage/filter?${queryStrings}`,
          method: "POST",
          body: queryString.payload,
          headers: getAppHeaders(),
        };
      },
      providesTags: ["Voyage"],
    }),

    addVoyage: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `/${menuConfigUrl.master}/vessel/voyage`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Voyage"],
    }),

    updateVoyage: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `/${menuConfigUrl.master}/vessel/voyage`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Voyage"],
    }),

    fetchAuditVoyage: builder.query({
      query: ({ id }) => {
        return {
          url: `/${menuConfigUrl.master}/vessel/voyage/audit/${id}`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
    }),
    deleteVoyage: builder.mutation({
      query: (id) => {
        return {
          url: `/${menuConfigUrl.master}/vessel/voyage/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),
  }),
});

export const {
  useFetchVoyageQuery,
  useLazyFetchAuditVoyageQuery,
  useAddVoyageMutation,
  useUpdateVoyageMutation,
  useDeleteVoyageMutation,
} = vesselVoyageDataApi;
