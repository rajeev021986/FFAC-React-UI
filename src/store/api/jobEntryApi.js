import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";
import { menuConfigUrl } from "../menuConfigUrl";

export const jobEntry = createApi({
  reducerPath: "jobEntry",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Code"],

  endpoints: (builder) => ({
    addJobEntry: builder.mutation({
      query: (params) => {
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };

        return {
          url: `${menuConfigUrl.document}/job-detail`,
          method: "POST",
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

    // uploadCustomerFile: builder.mutation({
    //   query: (params) => {
    //     const formData = new FormData();
    //     formData.append("file", params.file);
    //     const entityFileBlob = new Blob([JSON.stringify(params.entityFile)], {
    //       type: "application/json",
    //     });
    //     formData.append("entityFile", entityFileBlob);

    //     const headers = {
    //       Authorization: getAppHeaders()["Authorization"],
    //     };

    //     return {
    //       url: `/${menuConfigUrl.entity}/file`,
    //       method: "POST",
    //       body: formData,
    //       headers: headers,
    //     };
    //   },
    // }),

    fetchJobEntries: builder.query({
      query: ({ params, payload, page }) => {
        const queryString = new URLSearchParams(params).toString();
        const headers = {
          Authorization: getAppHeaders()["Authorization"],
        };
        return {
          url: `${menuConfigUrl.document}/job-detail/filter?${queryString}`,
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
  //   useUploadCustomerFileMutation,
  useAddJobEntryMutation,
  useFetchJobEntriesQuery,
  useDeleteJobEntryMutation,
  useUpdateJobEntryMutation,
} = jobEntry;
