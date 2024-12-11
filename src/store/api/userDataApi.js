import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppHeaders, API_BASE_URL } from "../../services/ApiMethods";

export const userDataApi = createApi({
  reducerPath: "userDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params.params).toString();
        return {
          url: `/admin-service/user/filter?${queryString}`,
          method: "POST",
          headers: getAppHeaders(),
          body: params.payload
        };
      },
      providesTags: ["User"],
    }),
    fetchOptions: builder.query({
      query: () => {
        return {
          url: `/spr_ctype_list`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
      providesTags: ["User"],
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    editUser: builder.mutation({
      query: (params) => {
        return {
          url: `/users/${params.usercode}`,
          method: "PUT",
          body: params,
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["User"],
    }),
    fetchUserDetails: builder.query({
      query: (id) => {
        return {
          url: `/users?userid=${id}`,
          method: "GET",
          headers: getAppHeaders(),
        };
      },
      providesTags: ["User"],
    }),
    registerUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),
    fetchRegesterdUser: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `/users/new_registered_users?${queryString}`,
          method: "GET",
          headers: getAppHeaders()
        }
      }
    }),
    menuSubmenu: builder.query({
      query: () => {
        return { url: `/admin-service/menu/submenu`, method: "GET", headers: getAppHeaders() };
      },
      providesTags: ["User"],
    }),
    fetchuser: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return { url: `/admin-service/role/users`, method: "GET", headers: getAppHeaders() };
      },
      providesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (params) => {
        return {
          url: `/admin-service/user/update/password`,
          method: "PUT",
          body: params,
          headers: getAppHeaders(),
        };
      },
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useAddUserMutation,
  useFetchUsersQuery,
  useFetchOptionsQuery,
  useEditUserMutation,
  useFetchUserDetailsQuery,
  useRegisterUserMutation,
  useFetchRegesterdUserQuery,
  useMenuSubmenuQuery,
  useFetchuserQuery,
  useResetPasswordMutation
} = userDataApi;
