// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
// import { menuConfigUrl } from "../menuConfigUrl";

// export const receiptsApi = createApi({
//   reducerPath: "receiptsEntry",
//   baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
//   tagTypes: ["Code"],

//   endpoints: (builder) => ({
//     addReceivableReceipts: builder.mutation({
//       query: (params) => {
//         const headers = {
//           Authorization: getAppHeaders()["Authorization"],
//         };

//         return {
//           url: `${menuConfigUrl.receipts}/receipt`,
//           method: "POST",
//           body: params,
//           headers: headers,
//         };
//       },
//       invalidatesTags: ["Code"],
//     }),
//     updateReceivableReceipts: builder.mutation({
//       query: (params) => {
//         const headers = {
//           Authorization: getAppHeaders()["Authorization"],
//         };

//         return {
//           url: `${menuConfigUrl.receipts}/receivable/receipt`,
//           method: "PUT",
//           body: params,
//           headers: headers,
//         };
//       },
//       invalidatesTags: ["Code"],
//     }),
//     addReceivableReceiptsDetails: builder.mutation({
//       query: (params) => {
//         const headers = {
//           Authorization: getAppHeaders()["Authorization"],
//         };

//         return {
//           url: `${menuConfigUrl.receipts}/receivable/receipt/detail`,
//           method: "POST",
//           body: params,
//           headers: headers,
//         };
//       },
//       invalidatesTags: ["Code"],
//     }),

//     fetchCustomerReceipts: builder.mutation({
//       query: (id) => {
//         return {
//           url: `${menuConfigUrl.receipts}/receipts/${id}`,
//           method: "GET",
//           headers: getAppHeaders(),
//         };
//       },
//       invalidatesTags: ["Code"],
//     }),
//     fetchAllCustomerReceipts: builder.query({
//       query: ({ params, payload, page }) => {
//         const queryString = new URLSearchParams(params).toString();

//         return {
//           url: `${menuConfigUrl.account}/${page}/${queryString}`,
//           method: "POST",
//           body: payload,

//           headers: getAppHeaders(),
//         };
//       },
//       invalidatesTags: ["Code"],
//     }),
//   }),
// });

// export const {
//   useAddReceivableReceiptsMutation,
//   useUpdateReceivableReceiptsMutation,
//   useAddReceivableReceiptsDetailsMutation,
//   useFetchCustomerReceiptsMutation,
//   useFetchAllCustomerReceiptsQuery,
// } = receiptsApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const receiptsApi = createApi({
  reducerPath: "receiptsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Code"],

  endpoints: (builder) => ({
    addReceivableReceipts: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.receipts}/receivable/receipt`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    updateReceivableReceipts: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.receipts}/receivable/receipt`,
          method: "PUT",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    addReceivableReceiptsDetails: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.receipts}/receivable/receipt/detail`,
          method: "POST",
          body: params,
          headers: headers,
        };
      },
      invalidatesTags: ["Code"],
    }),

    fetchAllCustomerReceipts: builder.query({
      query: ({ params, payload, page }) => {
        const queryString = new URLSearchParams(params).toString();
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `/${menuConfigUrl.receipts}/${page}?${queryString}`,
          method: "POST",
          body: payload,
          headers,
        };
      },
      providesTags: ["Code"],
    }),

    fetchCustomerReceipts: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.receipts}/receipts/${id}`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),
    deleteReceipts: builder.mutation({
      query: (id) => {
        return {
          url: `${menuConfigUrl.receipts}/receipts/${id}`,
          method: "DELETE",
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["Code"],
    }),
  }),
});

export const {
  useAddReceivableReceiptsMutation,
  useUpdateReceivableReceiptsMutation,
  useAddReceivableReceiptsDetailsMutation,
  useFetchAllCustomerReceiptsQuery,
  useFetchCustomerReceiptsMutation,
  useDeleteReceiptsMutation,
} = receiptsApi;
