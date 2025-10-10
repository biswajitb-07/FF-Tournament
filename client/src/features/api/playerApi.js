import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_USER_API = `${BASE_URL}/api/v1/admin-user/`;

export const playerApi = createApi({
  reducerPath: 'playerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ADMIN_USER_API,
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (search) => `users${search ? `?search=${search}` : ''}`,
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    blockUser: builder.mutation({
      query: ({ id, reason }) => ({
        url: `users/${id}/block`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    verifyUser: builder.mutation({
      query: ({ id, isVerified }) => ({
        url: `users/${id}/verify`,
        method: 'PUT',
        body: { isVerified },
      }),
      invalidatesTags: ['User'],
    }),
    resetPassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `users/${id}/reset-password`,
        method: 'PUT',
        body: { newPassword },
      }),
      invalidatesTags: ['User'],
    }),
    getUserStats: builder.query({
      query: (id) => `users/${id}/stats`,
      providesTags: (result, error, id) => [{ type: 'User', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useBlockUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useVerifyUserMutation,
  useResetPasswordMutation,
  useGetUserStatsQuery,
} = playerApi;