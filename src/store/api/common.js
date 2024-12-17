import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, getAppHeaders } from "../../services/ApiMethods";

export const auditDataApi = createApi({
    reducerPath: "auditDataApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ["Audit"],
    endpoints: (builder) => ({
        fetchAudit: builder.query({
            query: (params) => {
                // const queryString = new URLSearchParams(params).toString();
                return { url: `admin-service/user/audit/${params.userId}`, method: "GET", headers: getAppHeaders() };
            },
            providesTags: ["Audit"],
        }),
        updateProfileImage: builder.mutation({
            query: (params) => {
                const formData = new FormData();
                formData.append('image', params.file);

                const headers = {
                    Authorization: getAppHeaders()['Authorization'],
                };

                return {
                    url: `/admin-service/v1/profile/image?id=${params.id}`,
                    method: "PUT",
                    body: formData,
                    headers: headers
                };
            },
        }),


    }),
});

export const {
    useLazyFetchAuditQuery,
    useUpdateProfileImageMutation
} = auditDataApi;
