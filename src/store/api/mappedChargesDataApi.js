import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const mappedChargesDataApi = createApi({
  reducerPath: "mappedChargesDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["MappedCharges"],
  endpoints: (builder) => ({
    fetchMappedChargesDatas: builder.query({
       query: (params) => {
        return {
          url: `${menuConfigUrl.admin}/charge/mapping`,
          method: "GET",
          body: params,
          headers: getAppHeaders(),
        };
      },
      providesTags: ["MappedCharges"],
    }),
    updateMappedCharge: builder.mutation({
      query: (params) => {
        return {
          url: `${menuConfigUrl.admin}/charge/mapping`,
          method: "PUT",
          body: params,
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["MappedCharges"],
    }),
    getMappedCharge: builder.query({
      query: (params) => {
        return {
          url: `${menuConfigUrl.admin}/charge/${params.id}`,
          method: "GET",
          body: params.body,
          headers: getAppHeaders(),
        };
      },
    }),
    deleteMappedCharge: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.admin}/charge/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
    }),
    // getMappedChargeAudit: builder.query({
    //   query: (params) => {
    //     return {
    //       url: `${menuConfigUrl.admin}/charge/audit/${params.id}`,
    //       method: "GET",
    //       body: params.body,
    //       headers: getAppHeaders(),
    //     };
    //   },
    // }),
  }),
});

export const {
  useFetchMappedChargesDatasQuery,
  useUpdateMappedChargeMutation,
  useLazyGetMappedChargeQuery,
  useDeleteMappedChargeMutation,
//   useLazyGetMappedChargeAuditQuery,
} = mappedChargesDataApi;
